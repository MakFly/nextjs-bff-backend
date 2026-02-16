/**
 * BFF Route Handler
 *
 * This catch-all handler proxies all /api/v1/* requests to the configured backend
 * (Laravel, Symfony, or Node.js) based on AUTH_BACKEND environment variable.
 *
 * Features:
 * - Laravel: Uses HMAC signing for server-to-server auth
 * - Symfony: Uses Bearer token (BetterAuth)
 * - Node.js: Uses Bearer token (generic)
 * - 401 Interceptor: Automatic token refresh on 401 responses
 * - Proactive Refresh: Refresh tokens before they expire
 */

import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { BffException, BffErrorCode } from '@/lib/security/types';
import {
  getProxyConfig,
  isPublicRoute,
  buildBackendUrl,
  type ProxyConfig,
} from '@/lib/adapters/proxy-config';
import { getBackendType } from '@/lib/adapters';
import { createLogger } from '@/lib/logger';
import {
  TOKEN_CONFIG,
  COOKIE_NAMES,
  decodeJwtPayload,
  calculateExpirationTimestamp,
  formatExpirationForCookie,
} from '@/lib/services/token-service';
import { REFRESH_NEEDED_HEADER } from '@/middleware';

const log = createLogger('bff-proxy');

/**
 * Type for Next.js 14+ dynamic route params
 */
type RouteParams = {
  params: Promise<{ path: string[] }>;
};

/**
 * Regex to validate path segments (alphanumerics, dashes, underscores only)
 */
const SAFE_PATH_SEGMENT = /^[a-zA-Z0-9_-]+$/;

/**
 * Cookie configuration
 */
const COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

/**
 * Validates path segments to prevent SSRF/Path Traversal attacks
 * @throws {BffException} if path contains dangerous segments
 */
function validatePathSegments(segments: string[]): void {
  for (const segment of segments) {
    // Reject empty segments
    if (!segment) {
      throw new BffException(BffErrorCode.INVALID_SIGNATURE, 'Invalid path: empty segment');
    }

    // Reject path traversal
    if (segment === '..' || segment === '.') {
      throw new BffException(BffErrorCode.INVALID_SIGNATURE, 'Invalid path: traversal not allowed');
    }

    // Reject absolute URLs
    if (segment.includes('://') || segment.startsWith('//')) {
      throw new BffException(BffErrorCode.INVALID_SIGNATURE, 'Invalid path: absolute URLs not allowed');
    }

    // Validate segment format (alphanumerics, dashes, underscores)
    if (!SAFE_PATH_SEGMENT.test(segment)) {
      throw new BffException(BffErrorCode.INVALID_SIGNATURE, 'Invalid path: forbidden characters');
    }
  }
}

/**
 * Extract and parse request body
 */
async function extractBody(request: NextRequest): Promise<unknown> {
  if (request.method === 'GET' || request.method === 'HEAD') {
    return null;
  }

  try {
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const clonedRequest = request.clone();
      return await clonedRequest.json();
    }
  } catch {
    // No body or non-JSON
  }

  return null;
}

/**
 * Get refresh endpoint path for the current backend
 */
function getRefreshEndpoint(backend: string): string {
  switch (backend) {
    case 'laravel':
      return '/api/v1/auth/refresh';
    case 'symfony':
      return '/api/v1/auth/refresh';
    case 'node':
      return process.env.NODE_AUTH_PREFIX
        ? `${process.env.NODE_AUTH_PREFIX}/refresh`
        : '/api/v1/auth/refresh';
    default:
      return '/api/v1/auth/refresh';
  }
}

/**
 * Attempt to refresh the access token
 */
async function attemptTokenRefresh(
  config: ProxyConfig,
  backend: string,
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string; expiresIn: number } | null> {
  try {
    const refreshPath = getRefreshEndpoint(backend);
    const refreshUrl = buildBackendUrl(config, refreshPath);

    // Build headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    // Add HMAC for Laravel
    if (backend === 'laravel') {
      const body = { refresh_token: refreshToken };
      const { headers: signatureHeaders, normalizedBody } = config.getSignatureHeaders(
        'POST',
        refreshPath,
        body
      );
      Object.assign(headers, signatureHeaders);

      const response = await fetch(refreshUrl.toString(), {
        method: 'POST',
        headers,
        body: normalizedBody || JSON.stringify(body),
      });

      if (!response.ok) {
        log.warn('Token refresh failed', { status: response.status, backend });
        return null;
      }

      const data = await response.json();
      // Laravel format: { data: { access_token, refresh_token?, expires_in? } }
      return {
        accessToken: data.data?.access_token || data.access_token,
        refreshToken: data.data?.refresh_token || data.refresh_token || refreshToken,
        expiresIn: data.data?.expires_in || data.expires_in || TOKEN_CONFIG.ACCESS_TOKEN_MAX_AGE,
      };
    }

    // For Symfony/Node, send refresh token in body
    const body = JSON.stringify({
      refresh_token: refreshToken,
      refreshToken: refreshToken, // Some backends expect camelCase
    });

    const response = await fetch(refreshUrl.toString(), {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      log.warn('Token refresh failed', { status: response.status, backend });
      return null;
    }

    const data = await response.json();
    return {
      accessToken: data.access_token || data.accessToken,
      refreshToken: data.refresh_token || data.refreshToken || refreshToken,
      expiresIn: data.expires_in || data.expiresIn || TOKEN_CONFIG.ACCESS_TOKEN_MAX_AGE,
    };
  } catch (error) {
    log.error('Token refresh error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      backend,
    });
    return null;
  }
}

/**
 * Store new tokens in cookies
 */
function storeTokensInResponse(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
  expiresIn: number
): void {
  // Calculate actual expiration from token if possible
  let actualExpiresIn = expiresIn;
  const payload = decodeJwtPayload(accessToken);
  if (payload?.exp) {
    const now = Math.floor(Date.now() / 1000);
    actualExpiresIn = Math.max(payload.exp - now, 0);
  }

  // Store access token
  response.cookies.set(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
    ...COOKIE_CONFIG,
    maxAge: actualExpiresIn,
  });

  // Store expiration for client UX
  const expiresAt = calculateExpirationTimestamp(actualExpiresIn);
  response.cookies.set(COOKIE_NAMES.TOKEN_EXPIRES_AT, formatExpirationForCookie(expiresAt), {
    ...COOKIE_CONFIG,
    httpOnly: false,
    maxAge: actualExpiresIn,
  });

  // Store refresh token
  response.cookies.set(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
    ...COOKIE_CONFIG,
    maxAge: TOKEN_CONFIG.REFRESH_TOKEN_MAX_AGE,
  });
}

/**
 * Clear auth cookies on logout or invalid refresh
 */
function clearAuthCookies(response: NextResponse): void {
  response.cookies.delete(COOKIE_NAMES.ACCESS_TOKEN);
  response.cookies.delete(COOKIE_NAMES.REFRESH_TOKEN);
  response.cookies.delete(COOKIE_NAMES.TOKEN_EXPIRES_AT);
}

/**
 * Main proxy function to backend
 */
async function proxyRequest(
  request: NextRequest,
  method: string,
  paramsPromise: RouteParams['params']
): Promise<NextResponse> {
  const config = getProxyConfig();
  const backend = getBackendType();

  try {
    // Extract path from params
    const params = await paramsPromise;
    const pathSegments = params.path;

    // Validate segments to prevent SSRF
    validatePathSegments(pathSegments);

    // Build BFF path
    const bffPath = `/api/v1/${pathSegments.join('/')}`;

    // Transform to backend path
    const backendPath = config.transformPath(bffPath);

    // Build full backend URL
    const backendUrl = buildBackendUrl(config, backendPath);

    // Security check: ensure final URL points to configured backend
    const expectedHost = new URL(config.baseUrl).host;
    if (backendUrl.host !== expectedHost) {
      throw new BffException(BffErrorCode.INVALID_SIGNATURE, 'Invalid request: host mismatch');
    }

    // Extract body for signature (Laravel HMAC)
    const body = await extractBody(request);

    // Get signature headers (HMAC for Laravel, empty for others)
    const { headers: signatureHeaders, normalizedBody } = config.getSignatureHeaders(
      method,
      backendPath,
      body
    );

    // Get tokens from cookies
    const cookieStore = await cookies();
    let authToken = cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
    const refreshToken = cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;

    // Check if middleware signaled refresh needed
    const refreshNeeded = request.headers.get(REFRESH_NEEDED_HEADER);

    // Proactive refresh if middleware signaled it (and this isn't the refresh endpoint itself)
    if (refreshNeeded && refreshToken && !backendPath.includes('/refresh')) {
      log.info('Attempting proactive token refresh', { refreshNeeded, bffPath });
      const newTokens = await attemptTokenRefresh(config, backend, refreshToken);
      if (newTokens) {
        authToken = newTokens.accessToken;
        log.info('Proactive refresh successful');
      }
    }

    // Check if route requires authentication
    if (!authToken && !isPublicRoute(config, backendPath)) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'No auth token found' },
        { status: 401 }
      );
    }

    // Build request headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...signatureHeaders,
    };

    // Add auth token
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    try {
      // Prepare fetch options
      const options: RequestInit = {
        method,
        headers,
        signal: controller.signal,
      };

      // Use normalized body for Laravel (HMAC consistency), original for others
      if (method !== 'GET' && method !== 'HEAD') {
        if (normalizedBody !== undefined) {
          options.body = normalizedBody;
        } else if (body) {
          options.body = JSON.stringify(body);
        }
      }

      // Copy query params
      request.nextUrl.searchParams.forEach((value, key) => {
        backendUrl.searchParams.set(key, value);
      });

      // Make request to backend
      let response = await fetch(backendUrl.toString(), options);

      clearTimeout(timeoutId);

      // 401 Interceptor: Attempt refresh and retry
      if (response.status === 401 && refreshToken && !backendPath.includes('/refresh')) {
        log.info('Received 401, attempting token refresh', { bffPath });

        const newTokens = await attemptTokenRefresh(config, backend, refreshToken);

        if (newTokens) {
          log.info('Refresh successful, retrying request');

          // Retry with new token
          headers['Authorization'] = `Bearer ${newTokens.accessToken}`;

          const retryController = new AbortController();
          const retryTimeoutId = setTimeout(() => retryController.abort(), config.timeout);

          response = await fetch(backendUrl.toString(), {
            ...options,
            headers,
            signal: retryController.signal,
          });

          clearTimeout(retryTimeoutId);

          // Create response and store new tokens
          const responseData = await response.text();
          const nextResponse = await buildResponse(response, responseData, backend);
          storeTokensInResponse(
            nextResponse,
            newTokens.accessToken,
            newTokens.refreshToken,
            newTokens.expiresIn
          );
          return nextResponse;
        } else {
          log.warn('Refresh failed, clearing auth cookies');
          // Refresh failed - clear cookies and return 401
          const nextResponse = NextResponse.json(
            { error: 'Session expired', message: 'Please log in again' },
            { status: 401 }
          );
          clearAuthCookies(nextResponse);
          return nextResponse;
        }
      }

      // Build and return response
      const responseData = await response.text();
      const nextResponse = await buildResponse(response, responseData, backend);

      // Handle proactive refresh - store new tokens if we refreshed earlier
      if (refreshNeeded && refreshToken && !backendPath.includes('/refresh')) {
        const newTokens = await attemptTokenRefresh(config, backend, refreshToken);
        if (newTokens) {
          storeTokensInResponse(
            nextResponse,
            newTokens.accessToken,
            newTokens.refreshToken,
            newTokens.expiresIn
          );
        }
      }

      return nextResponse;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new BffException(BffErrorCode.TIMEOUT, 'Request timeout');
      }

      throw error;
    }
  } catch (error) {
    // Error handling
    if (error instanceof BffException) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 500 }
      );
    }

    log.error('Proxy request failed', {
      backend,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json(
      { error: 'Internal server error', message: 'Failed to proxy request' },
      { status: 500 }
    );
  }
}

/**
 * Build NextResponse from backend response
 */
async function buildResponse(
  response: Response,
  responseData: string,
  backend: string
): Promise<NextResponse> {
  // Get response cookies
  const setCookieHeaders = response.headers.getSetCookie();
  const responseHeaders = new Headers();

  // Copy important response headers
  response.headers.forEach((value, key) => {
    if (key !== 'set-cookie') {
      responseHeaders.set(key, value);
    }
  });

  // Transfer cookies from backend
  setCookieHeaders.forEach((cookie) => {
    responseHeaders.append('set-cookie', cookie);
  });

  // Create Next.js response
  const nextResponse = new NextResponse(responseData, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });

  // Handle token storage based on backend response format
  try {
    const jsonData = JSON.parse(responseData);
    let accessToken: string | undefined;
    let refreshTokenFromResponse: string | undefined;
    let expiresIn: number | undefined;

    // Extract token based on backend format
    if (backend === 'laravel') {
      // Laravel: { data: { access_token, refresh_token?, expires_in? } }
      accessToken = jsonData.data?.access_token;
      refreshTokenFromResponse = jsonData.data?.refresh_token;
      expiresIn = jsonData.data?.expires_in;
    } else {
      // Symfony/Node: { access_token, accessToken, refresh_token, refreshToken, expires_in, expiresIn }
      accessToken = jsonData.access_token || jsonData.accessToken;
      refreshTokenFromResponse = jsonData.refresh_token || jsonData.refreshToken;
      expiresIn = jsonData.expires_in || jsonData.expiresIn;
    }

    // Store tokens if present
    if (accessToken) {
      const actualExpiresIn = expiresIn || TOKEN_CONFIG.ACCESS_TOKEN_MAX_AGE;

      // Calculate actual expiration from JWT if possible
      let tokenMaxAge = actualExpiresIn;
      const payload = decodeJwtPayload(accessToken);
      if (payload?.exp) {
        const now = Math.floor(Date.now() / 1000);
        tokenMaxAge = Math.max(payload.exp - now, 0);
      }

      // Set access token cookie
      nextResponse.cookies.set(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
        ...COOKIE_CONFIG,
        maxAge: tokenMaxAge,
      });

      // Set expiration cookie for client UX
      const expiresAt = calculateExpirationTimestamp(tokenMaxAge);
      nextResponse.cookies.set(COOKIE_NAMES.TOKEN_EXPIRES_AT, formatExpirationForCookie(expiresAt), {
        ...COOKIE_CONFIG,
        httpOnly: false,
        maxAge: tokenMaxAge,
      });
    }

    // Handle refresh token if present
    if (refreshTokenFromResponse) {
      nextResponse.cookies.set(COOKIE_NAMES.REFRESH_TOKEN, refreshTokenFromResponse, {
        ...COOKIE_CONFIG,
        maxAge: TOKEN_CONFIG.REFRESH_TOKEN_MAX_AGE,
      });
    }
  } catch {
    // No JSON or no token
  }

  return nextResponse;
}

/**
 * Handlers for each HTTP method
 */
export async function GET(request: NextRequest, params: RouteParams) {
  return proxyRequest(request, 'GET', params.params);
}

export async function POST(request: NextRequest, params: RouteParams) {
  return proxyRequest(request, 'POST', params.params);
}

export async function PUT(request: NextRequest, params: RouteParams) {
  return proxyRequest(request, 'PUT', params.params);
}

export async function PATCH(request: NextRequest, params: RouteParams) {
  return proxyRequest(request, 'PATCH', params.params);
}

export async function DELETE(request: NextRequest, params: RouteParams) {
  return proxyRequest(request, 'DELETE', params.params);
}

/**
 * Configure route options
 */
export const runtime = 'nodejs'; // Required for crypto (Laravel HMAC)
export const dynamic = 'force-dynamic'; // Disable cache for sensitive routes
