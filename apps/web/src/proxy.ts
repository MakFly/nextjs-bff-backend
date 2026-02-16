import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createEdgeLogger } from "@/lib/logger/edge";

const log = createEdgeLogger("middleware");

/**
 * Token configuration (must match token-service.ts)
 * Note: We can't import from token-service.ts in Edge runtime,
 * so we duplicate the constants here.
 */
const TOKEN_CONFIG = {
  /** Threshold in seconds before expiration to trigger proactive refresh (5 minutes) */
  REFRESH_THRESHOLD: 5 * 60,
} as const;

/**
 * Header name to signal refresh needed to route handlers
 */
export const REFRESH_NEEDED_HEADER = "x-bff-refresh-needed";

/**
 * Cookie names (ACCESS_TOKEN configurable via AUTH_COOKIE_NAME env)
 *
 * Note: We can't import from @/lib/config/env in Edge runtime,
 * so we read process.env directly here. Keep in sync with env.ts.
 */
const COOKIE_NAMES = {
  ACCESS_TOKEN: process.env.AUTH_COOKIE_NAME || "auth_token",
  REFRESH_TOKEN: process.env.REFRESH_COOKIE_NAME || "refresh_token",
  TOKEN_EXPIRES_AT: process.env.TOKEN_EXPIRES_COOKIE_NAME || "token_expires_at",
} as const;

// Routes that require authentication
const protectedRoutes = ["/dashboard"];

// Routes that should redirect to home if already authenticated
const authRoutes = ["/auth/login", "/auth/register"];

// API routes that should check for proactive refresh
const apiRoutes = ["/api/v1/"];

/**
 * Decode JWT payload without signature verification (Edge-compatible).
 * This is safe because we only extract the expiration time,
 * and the actual auth verification happens on the backend.
 */
function decodeJwtPayloadEdge(token: string): { exp?: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    if (!payload) return null;

    // Base64url to base64
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");

    // Pad if necessary
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

    // Decode (atob is available in Edge runtime)
    const decoded = atob(padded);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Check if token needs proactive refresh
 */
function shouldRefreshProactively(token: string): boolean {
  const payload = decodeJwtPayloadEdge(token);
  if (!payload?.exp) return false;

  const now = Math.floor(Date.now() / 1000);
  const remainingSeconds = payload.exp - now;

  // Refresh if less than threshold remaining (but not expired)
  return remainingSeconds > 0 && remainingSeconds < TOKEN_CONFIG.REFRESH_THRESHOLD;
}

/**
 * Check if token is expired
 */
function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayloadEdge(token);
  if (!payload?.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now;
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
  const refreshToken = request.cookies.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;
  const { pathname } = request.nextUrl;

  // For API routes, check if proactive refresh is needed
  if (apiRoutes.some((route) => pathname.startsWith(route))) {
    const response = NextResponse.next();

    if (token) {
      // Check if token needs proactive refresh
      if (shouldRefreshProactively(token)) {
        log.info("Token needs proactive refresh", {
          pathname,
          hasRefreshToken: !!refreshToken
        });
        // Signal to route handler that refresh is needed
        response.headers.set(REFRESH_NEEDED_HEADER, "true");
      }

      // Check if token is expired but we have refresh token
      if (isTokenExpired(token) && refreshToken) {
        log.info("Token expired, refresh needed", { pathname });
        response.headers.set(REFRESH_NEEDED_HEADER, "expired");
      }
    }

    return response;
  }

  // Check if trying to access protected route without token
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      log.info("Redirecting unauthenticated user to login", { pathname });
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // If token is expired and no refresh token, redirect to login
    if (isTokenExpired(token) && !refreshToken) {
      log.info("Token expired without refresh token, redirecting to login", { pathname });
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);
      // Clear invalid token
      response.cookies.delete(COOKIE_NAMES.ACCESS_TOKEN);
      response.cookies.delete(COOKIE_NAMES.TOKEN_EXPIRES_AT);
      return response;
    }
  }

  // Check if trying to access auth routes while authenticated
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (token && !isTokenExpired(token)) {
      log.debug("Redirecting authenticated user from auth page", { pathname });
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*",
    "/api/v1/:path*",
  ],
};
