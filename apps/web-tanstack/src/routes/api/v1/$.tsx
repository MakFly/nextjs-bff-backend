import { createFileRoute } from '@tanstack/react-router'
import {
  getCookie,
  setCookie,
  deleteCookie,
} from '@tanstack/react-start/server'
import type { Request } from '@tanstack/react-start'
import {
  getBackendType,
  getAdapterConfig,
  type BackendType,
  type AdapterConfig,
} from '@/lib/adapters'
import {
  TOKEN_CONFIG,
  COOKIE_NAMES,
  calculateExpirationTimestamp,
  formatExpirationForCookie,
} from '@/lib/services/token-service'

const SAFE_PATH_SEGMENT = /^[a-zA-Z0-9_-]+$/

const COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

function validatePathSegments(segments: string[]): void {
  for (const segment of segments) {
    if (!segment) {
      throw new Response(
        JSON.stringify({ error: 'Invalid path: empty segment' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
    if (segment === '..' || segment === '.') {
      throw new Response(
        JSON.stringify({ error: 'Invalid path: traversal not allowed' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
    if (segment.includes('://') || segment.startsWith('//')) {
      throw new Response(
        JSON.stringify({ error: 'Invalid path: absolute URLs not allowed' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
    if (!SAFE_PATH_SEGMENT.test(segment)) {
      throw new Response(
        JSON.stringify({ error: 'Invalid path: forbidden characters' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
  }
}

function getBackendTypeServer(): BackendType {
  const backend = process.env.AUTH_BACKEND || 'laravel'
  if (backend !== 'laravel' && backend !== 'symfony' && backend !== 'node') {
    console.warn(`Unknown AUTH_BACKEND "${backend}", defaulting to "laravel"`)
    return 'laravel'
  }
  return backend
}

function getProxyConfig() {
  const backend = getBackendTypeServer()
  const config = getAdapterConfig(backend)
  return { backend, config }
}

function buildBackendUrl(config: AdapterConfig, path: string): URL {
  const baseUrl = config.baseUrl?.replace(/\/$/, '') || 'http://localhost:8000'
  return new URL(path, baseUrl)
}

function transformPath(backend: BackendType, bffPath: string): string {
  if (backend === 'laravel') return bffPath
  if (backend === 'symfony') return bffPath.replace('/api/v1', '/api')
  if (backend === 'node') {
    const prefix = process.env.NODE_AUTH_PREFIX || '/api/v1/auth'
    return bffPath.replace('/api/v1/auth', prefix)
  }
  return bffPath
}

function getSignatureHeaders(
  backend: BackendType,
  method: string,
  path: string,
  body: unknown,
): { headers: Record<string, string>; normalizedBody?: string } {
  if (backend !== 'laravel') return { headers: {} }

  const secret = process.env.BFF_HMAC_SECRET || process.env.BFF_SECRET
  const bffId = process.env.BFF_ID || 'tanstack-bff'

  if (!secret) return { headers: {} }

  const timestamp = Math.floor(Date.now() / 1000).toString()
  const bodyStr = body ? JSON.stringify(body) : ''
  const signaturePayload = `${timestamp}${method}${path}${bodyStr}`

  let signature: string
  try {
    const crypto = globalThis.crypto
    if (crypto?.subtle) {
      const encoder = new TextEncoder()
      const key = encoder.encode(secret)
      const data = encoder.encode(signaturePayload)
      const hash = crypto.subtle.sign('HMAC', key, data)
      if (hash instanceof Promise) {
        throw new Error('Promise-based crypto not supported')
      }
      signature = Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
    } else {
      throw new Error('No crypto')
    }
  } catch {
    const nodeCrypto = require('crypto')
    signature = nodeCrypto
      .createHmac('sha256', secret)
      .update(signaturePayload)
      .digest('hex')
  }

  return {
    headers: {
      'X-BFF-Timestamp': timestamp,
      'X-BFF-Signature': `sha256=${signature}`,
      'X-BFF-ID': bffId,
    },
    normalizedBody: bodyStr || undefined,
  }
}

function getRefreshEndpoint(backend: BackendType): string {
  switch (backend) {
    case 'laravel':
      return '/api/v1/auth/refresh'
    case 'symfony':
      return '/api/v1/auth/refresh'
    case 'node':
      return process.env.NODE_AUTH_PREFIX
        ? `${process.env.NODE_AUTH_PREFIX}/refresh`
        : '/api/v1/auth/refresh'
    default:
      return '/api/v1/auth/refresh'
  }
}

async function attemptTokenRefresh(
  backend: BackendType,
  config: AdapterConfig,
  refreshToken: string,
): Promise<{
  accessToken: string
  refreshToken: string
  expiresIn: number
} | null> {
  try {
    const refreshPath = getRefreshEndpoint(backend)
    const refreshUrl = buildBackendUrl(config, refreshPath)

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }

    if (backend === 'laravel') {
      const body = { refresh_token: refreshToken }
      const { headers: signatureHeaders, normalizedBody } = getSignatureHeaders(
        backend,
        'POST',
        refreshPath,
        body,
      )
      Object.assign(headers, signatureHeaders)

      const response = await fetch(refreshUrl.toString(), {
        method: 'POST',
        headers,
        body: normalizedBody || JSON.stringify(body),
      })

      if (!response.ok) return null

      const data = await response.json()
      return {
        accessToken: data.data?.access_token || data.access_token,
        refreshToken:
          data.data?.refresh_token || data.refresh_token || refreshToken,
        expiresIn:
          data.data?.expires_in ||
          data.expires_in ||
          TOKEN_CONFIG.ACCESS_TOKEN_MAX_AGE,
      }
    }

    const body = JSON.stringify({
      refresh_token: refreshToken,
      refreshToken: refreshToken,
    })

    const response = await fetch(refreshUrl.toString(), {
      method: 'POST',
      headers,
      body,
    })

    if (!response.ok) return null

    const data = await response.json()
    return {
      accessToken: data.access_token || data.accessToken,
      refreshToken: data.refresh_token || data.refreshToken || refreshToken,
      expiresIn:
        data.expires_in || data.expiresIn || TOKEN_CONFIG.ACCESS_TOKEN_MAX_AGE,
    }
  } catch (error) {
    console.error('Token refresh error:', error)
    return null
  }
}

async function storeTokens(
  accessToken: string,
  refreshToken: string,
  expiresIn: number,
): Promise<void> {
  if (accessToken) {
    setCookie(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
      ...COOKIE_CONFIG,
      maxAge: expiresIn,
    })

    const expiresAt = calculateExpirationTimestamp(expiresIn)
    setCookie(
      COOKIE_NAMES.TOKEN_EXPIRES_AT,
      formatExpirationForCookie(expiresAt),
      {
        ...COOKIE_CONFIG,
        httpOnly: false,
        maxAge: expiresIn,
      },
    )
  }

  if (refreshToken) {
    setCookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
      ...COOKIE_CONFIG,
      maxAge: TOKEN_CONFIG.REFRESH_TOKEN_MAX_AGE,
    })
  }
}

async function clearAuthCookies(): Promise<void> {
  deleteCookie(COOKIE_NAMES.ACCESS_TOKEN)
  deleteCookie(COOKIE_NAMES.REFRESH_TOKEN)
  deleteCookie(COOKIE_NAMES.TOKEN_EXPIRES_AT)
}

function isPublicRoute(backend: BackendType, path: string): boolean {
  const publicPaths = [
    '/api/v1/auth/login',
    '/api/v1/auth/register',
    '/api/v1/auth/refresh',
    '/api/v1/auth/providers',
    '/api/v1/auth/{provider}/redirect',
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/refresh',
    '/api/auth/providers',
    '/api/auth/{provider}/redirect',
  ]
  return publicPaths.some((p) => {
    if (p.includes('{')) {
      const regex = new RegExp('^' + p.replace(/{[^}]+}/g, '[^/]+') + '$')
      return regex.test(path)
    }
    return path === p || path.startsWith(p + '/')
  })
}

async function handleBffRequest(request: Request): Promise<Response> {
  const { backend, config } = getProxyConfig()

  const url = new URL(request.url)
  const pathSegments = url.pathname
    .replace(/^\/api\/v1\//, '')
    .split('/')
    .filter(Boolean)

  if (pathSegments.length === 0) {
    return new Response(JSON.stringify({ error: 'Missing path' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  validatePathSegments(pathSegments)

  const bffPath = `/api/v1/${pathSegments.join('/')}`
  const backendPath = transformPath(backend, bffPath)
  const backendUrl = buildBackendUrl(config, backendPath)

  const expectedHost = new URL(config.baseUrl!).host
  if (backendUrl.host !== expectedHost) {
    return new Response(
      JSON.stringify({ error: 'Invalid request: host mismatch' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }

  const method = request.method
  let body: unknown = null

  if (method !== 'GET' && method !== 'HEAD') {
    try {
      body = await request.json()
    } catch {}
  }

  const { headers: signatureHeaders, normalizedBody } = getSignatureHeaders(
    backend,
    method,
    backendPath,
    body,
  )

  let authToken = getCookie(COOKIE_NAMES.ACCESS_TOKEN) ?? undefined
  const refreshToken = getCookie(COOKIE_NAMES.REFRESH_TOKEN) ?? undefined

  if (!authToken && !isPublicRoute(backend, backendPath)) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized', message: 'No auth token found' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...signatureHeaders,
  }

  if (authToken) {
    requestHeaders['Authorization'] = `Bearer ${authToken}`
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(
    () => controller.abort(),
    config.timeout || 30000,
  )

  try {
    const options: RequestInit = {
      method,
      headers: requestHeaders,
      signal: controller.signal,
    }

    if (method !== 'GET' && method !== 'HEAD') {
      if (normalizedBody !== undefined) {
        options.body = normalizedBody
      } else if (body) {
        options.body = JSON.stringify(body)
      }
    }

    url.searchParams.forEach((value, key) => {
      backendUrl.searchParams.set(key, value)
    })

    let response = await fetch(backendUrl.toString(), options)
    clearTimeout(timeoutId)

    if (
      response.status === 401 &&
      refreshToken &&
      !backendPath.includes('/refresh')
    ) {
      const newTokens = await attemptTokenRefresh(backend, config, refreshToken)

      if (newTokens) {
        requestHeaders['Authorization'] = `Bearer ${newTokens.accessToken}`

        const retryController = new AbortController()
        const retryTimeoutId = setTimeout(
          () => retryController.abort(),
          config.timeout || 30000,
        )

        response = await fetch(backendUrl.toString(), {
          ...options,
          headers: requestHeaders,
          signal: retryController.signal,
        })

        clearTimeout(retryTimeoutId)

        const responseData = await response.text()
        const headers = new Headers()
        response.headers.forEach((value, key) => {
          if (key !== 'set-cookie') headers.set(key, value)
        })
        response.headers
          .getSetCookie()
          .forEach((cookie) => headers.append('set-cookie', cookie))

        await storeTokens(
          newTokens.accessToken,
          newTokens.refreshToken,
          newTokens.expiresIn,
        )

        return new Response(responseData, {
          status: response.status,
          statusText: response.statusText,
          headers,
        })
      } else {
        await clearAuthCookies()
        return new Response(
          JSON.stringify({
            error: 'Session expired',
            message: 'Please log in again',
          }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }
    }

    const responseData = await response.text()
    const responseHeaders = new Headers()
    response.headers.forEach((value, key) => {
      if (key !== 'set-cookie') responseHeaders.set(key, value)
    })
    response.headers
      .getSetCookie()
      .forEach((cookie) => responseHeaders.append('set-cookie', cookie))

    try {
      const jsonData = JSON.parse(responseData)
      let accessToken: string | undefined
      let refreshTokenFromResponse: string | undefined
      let expiresIn: number | undefined

      if (backend === 'laravel') {
        accessToken = jsonData.data?.access_token
        refreshTokenFromResponse = jsonData.data?.refresh_token
        expiresIn = jsonData.data?.expires_in
      } else {
        accessToken = jsonData.access_token || jsonData.accessToken
        refreshTokenFromResponse =
          jsonData.refresh_token || jsonData.refreshToken
        expiresIn = jsonData.expires_in || jsonData.expiresIn
      }

      if (accessToken) {
        const tokenMaxAge = expiresIn || TOKEN_CONFIG.ACCESS_TOKEN_MAX_AGE

        setCookie(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
          ...COOKIE_CONFIG,
          maxAge: tokenMaxAge,
        })

        const expiresAt = calculateExpirationTimestamp(tokenMaxAge)
        setCookie(
          COOKIE_NAMES.TOKEN_EXPIRES_AT,
          formatExpirationForCookie(expiresAt),
          {
            ...COOKIE_CONFIG,
            httpOnly: false,
            maxAge: tokenMaxAge,
          },
        )
      }

      if (refreshTokenFromResponse) {
        setCookie(COOKIE_NAMES.REFRESH_TOKEN, refreshTokenFromResponse, {
          ...COOKIE_CONFIG,
          maxAge: TOKEN_CONFIG.REFRESH_TOKEN_MAX_AGE,
        })
      }
    } catch {}

    return new Response(responseData, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    })
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof Error && error.name === 'AbortError') {
      return new Response(JSON.stringify({ error: 'Request timeout' }), {
        status: 504,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: 'Failed to proxy request',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}

export const Route = createFileRoute('/api/v1/$')({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        return handleBffRequest(request as unknown as Request)
      },
      POST: async ({ request }: { request: Request }) => {
        return handleBffRequest(request as unknown as Request)
      },
      PUT: async ({ request }: { request: Request }) => {
        return handleBffRequest(request as unknown as Request)
      },
      PATCH: async ({ request }: { request: Request }) => {
        return handleBffRequest(request as unknown as Request)
      },
      DELETE: async ({ request }: { request: Request }) => {
        return handleBffRequest(request as unknown as Request)
      },
    },
  },
})
