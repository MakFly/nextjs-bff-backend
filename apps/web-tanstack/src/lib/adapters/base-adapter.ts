import { getCookie, setCookie, deleteCookie } from '@tanstack/react-start/server'
import type {
  AuthAdapter,
  AdapterConfig,
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  AuthResponse,
  NormalizedUser,
  TokenStorage,
} from './types'
import {
  TOKEN_CONFIG,
  COOKIE_NAMES as TOKEN_COOKIE_NAMES,
  calculateExpirationTimestamp,
  formatExpirationForCookie,
} from '../services/token-service'
import { AdapterError } from './errors'

export { AdapterError } from './errors'

const BASE_COOKIE_CONFIG = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
}

export const COOKIE_NAMES = TOKEN_COOKIE_NAMES

const DEFAULT_TIMEOUT = 30000

export abstract class BaseAdapter implements AuthAdapter {
  protected config: AdapterConfig

  constructor(config: AdapterConfig) {
    this.config = { timeout: DEFAULT_TIMEOUT, ...config }
  }

  protected async makeRequest<T>(
    method: string,
    path: string,
    options: {
      body?: unknown
      headers?: Record<string, string>
      includeAuth?: boolean
    } = {}
  ): Promise<T> {
    const { body, headers = {}, includeAuth = true } = options
    const url = `${this.config.baseUrl}${path}`
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
    }

    if (includeAuth) {
      const authHeaders = await this.getAuthHeaders()
      Object.assign(requestHeaders, authHeaders)
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        let errorBody: unknown
        try { errorBody = await response.json() } catch {}
        throw AdapterError.fromResponse(response, errorBody)
      }

      const contentType = response.headers.get('content-type')
      if (!contentType?.includes('application/json')) return {} as T

      const text = await response.text()
      if (!text) return {} as T

      return JSON.parse(text) as T
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof AdapterError) throw error
      if (error instanceof Error && error.name === 'AbortError') {
        throw new AdapterError('Request timeout', 408, 'TIMEOUT')
      }
      throw new AdapterError(
        error instanceof Error ? error.message : 'Network error',
        0,
        'NETWORK_ERROR'
      )
    }
  }

  protected async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await this.getAccessToken()
    if (token) return { Authorization: `Bearer ${token}` }
    return {}
  }

  async storeTokens(tokens: TokenStorage): Promise<void> {
    const expiresIn = tokens.expires_in || TOKEN_CONFIG.ACCESS_TOKEN_MAX_AGE

    if (tokens.access_token) {
      setCookie(COOKIE_NAMES.ACCESS_TOKEN, tokens.access_token, {
        ...BASE_COOKIE_CONFIG,
        httpOnly: true,
        maxAge: expiresIn,
      })

      const expiresAt = calculateExpirationTimestamp(expiresIn)
      setCookie(COOKIE_NAMES.TOKEN_EXPIRES_AT, formatExpirationForCookie(expiresAt), {
        ...BASE_COOKIE_CONFIG,
        httpOnly: false,
        maxAge: expiresIn,
      })
    }

    if (tokens.refresh_token) {
      setCookie(COOKIE_NAMES.REFRESH_TOKEN, tokens.refresh_token, {
        ...BASE_COOKIE_CONFIG,
        httpOnly: true,
        maxAge: TOKEN_CONFIG.REFRESH_TOKEN_MAX_AGE,
      })
    }
  }

  protected storeTokenExpiration(expiresAt: number | string): void {
    const iso = typeof expiresAt === 'number'
      ? formatExpirationForCookie(expiresAt)
      : expiresAt
    const maxAge = typeof expiresAt === 'number'
      ? Math.max(0, expiresAt - Math.floor(Date.now() / 1000))
      : TOKEN_CONFIG.ACCESS_TOKEN_MAX_AGE
    setCookie(COOKIE_NAMES.TOKEN_EXPIRES_AT, iso, {
      ...BASE_COOKIE_CONFIG,
      httpOnly: false,
      maxAge,
    })
  }

  async clearTokens(): Promise<void> {
    deleteCookie(COOKIE_NAMES.ACCESS_TOKEN)
    deleteCookie(COOKIE_NAMES.REFRESH_TOKEN)
    deleteCookie(COOKIE_NAMES.TOKEN_EXPIRES_AT)
  }

  async getAccessToken(): Promise<string | null> {
    return getCookie(COOKIE_NAMES.ACCESS_TOKEN) ?? null
  }

  protected async getRefreshToken(): Promise<string | null> {
    return getCookie(COOKIE_NAMES.REFRESH_TOKEN) ?? null
  }

  abstract login(credentials: LoginRequest): Promise<AuthResponse>
  abstract register(data: RegisterRequest): Promise<AuthResponse>
  abstract logout(): Promise<void>
  abstract refresh(request?: RefreshTokenRequest): Promise<AuthResponse>
  abstract getUser(): Promise<NormalizedUser | null>
  abstract getOAuthProviders(): Promise<string[]>
  abstract getOAuthUrl(provider: string): Promise<string>
}
