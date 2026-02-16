import type {
  AdapterConfig,
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  AuthResponse,
  NormalizedUser,
} from '../types'
import { BaseAdapter, AdapterError } from '../base-adapter'
import { generateSignature, BFF_SECRET, BFF_ID } from '../../security/hmac'
import {
  transformAuthResponse,
  transformMeResponse,
  transformOAuthProviders,
  transformOAuthRedirect,
} from './transformer'

const ENDPOINTS = {
  LOGIN: '/api/v1/auth/login',
  REGISTER: '/api/v1/auth/register',
  LOGOUT: '/api/v1/auth/logout',
  REFRESH: '/api/v1/auth/refresh',
  ME: '/api/v1/me',
  OAUTH_PROVIDERS: '/api/v1/auth/providers',
  OAUTH_REDIRECT: (provider: string) => `/api/v1/auth/${provider}/redirect`,
}

export type LaravelAdapterConfig = AdapterConfig & {
  secret: string
  bffId: string
}

export class LaravelAdapter extends BaseAdapter {
  protected override config: LaravelAdapterConfig

  constructor(config: Partial<LaravelAdapterConfig> = {}) {
    const fullConfig: LaravelAdapterConfig = {
      baseUrl: process.env.LARAVEL_API_URL || 'http://localhost:8000',
      timeout: 30000,
      secret: config.secret || BFF_SECRET,
      bffId: config.bffId || BFF_ID,
      ...config,
    }
    super(fullConfig)
    this.config = fullConfig
  }

  protected override async makeRequest<T>(
    method: string,
    path: string,
    options: {
      body?: unknown
      headers?: Record<string, string>
      includeAuth?: boolean
    } = {}
  ): Promise<T> {
    const { body, headers = {}, includeAuth = true } = options

    const { normalizedBody, ...hmacHeaders } = generateSignature(method, path, body)

    const url = `${this.config.baseUrl}${path}`
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...hmacHeaders,
      ...headers,
    }

    if (includeAuth) {
      const token = await this.getAccessToken()
      if (token) requestHeaders['Authorization'] = `Bearer ${token}`
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: normalizedBody,
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

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.makeRequest<{
      data: { user: unknown; access_token: string; token_type?: string; expires_in?: number }
    }>('POST', ENDPOINTS.LOGIN, { body: credentials, includeAuth: false })
    const authResponse = transformAuthResponse(response as never)
    await this.storeTokens(authResponse.tokens)
    return authResponse
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.makeRequest<{
      data: { user: unknown; access_token: string; token_type?: string; expires_in?: number }
    }>('POST', ENDPOINTS.REGISTER, { body: data, includeAuth: false })
    const authResponse = transformAuthResponse(response as never)
    await this.storeTokens(authResponse.tokens)
    return authResponse
  }

  async logout(): Promise<void> {
    try {
      await this.makeRequest('POST', ENDPOINTS.LOGOUT)
    } finally {
      await this.clearTokens()
    }
  }

  async refresh(request?: RefreshTokenRequest): Promise<AuthResponse> {
    const refreshToken = request?.refresh_token || (await this.getRefreshToken())
    const response = await this.makeRequest<{
      data: { user: unknown; access_token: string; token_type?: string; expires_in?: number }
    }>('POST', ENDPOINTS.REFRESH, {
      body: refreshToken ? { refresh_token: refreshToken } : undefined,
    })
    const authResponse = transformAuthResponse(response as never)
    await this.storeTokens(authResponse.tokens)
    return authResponse
  }

  async getUser(): Promise<NormalizedUser | null> {
    try {
      const response = await this.makeRequest<{ data: unknown }>('GET', ENDPOINTS.ME)
      return transformMeResponse(response as never)
    } catch (error) {
      if (error instanceof AdapterError && (error.statusCode === 401 || error.statusCode === 403)) {
        return null
      }
      throw error
    }
  }

  async getOAuthProviders(): Promise<string[]> {
    const response = await this.makeRequest<{ data: string[] }>(
      'GET', ENDPOINTS.OAUTH_PROVIDERS, { includeAuth: false }
    )
    return transformOAuthProviders(response)
  }

  async getOAuthUrl(provider: string): Promise<string> {
    const response = await this.makeRequest<{ data: { redirect_url: string } }>(
      'GET', ENDPOINTS.OAUTH_REDIRECT(provider), { includeAuth: false }
    )
    return transformOAuthRedirect(response)
  }
}
