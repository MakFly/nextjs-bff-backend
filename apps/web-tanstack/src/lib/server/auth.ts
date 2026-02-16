import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'
import { getAuthAdapter, toUser, COOKIE_NAMES } from '../adapters'
import { getTokenExpirationFromTimestamp } from '../services/token-service'

export type TokenStatusInfo = {
  expiresAt: number | null
  remainingSeconds: number
  isExpired: boolean
  shouldRefresh: boolean
  shouldWarn: boolean
}

export const getTokenStatusFn = createServerFn({ method: 'GET' })
  .handler(async (): Promise<TokenStatusInfo> => {
    const expiresValue =
      getCookie(COOKIE_NAMES.TOKEN_EXPIRES_AT) ??
      getCookie('auth_token_expires_at') ??
      getCookie('expires_at')

    if (!expiresValue) {
      return {
        expiresAt: null,
        remainingSeconds: 0,
        isExpired: true,
        shouldRefresh: true,
        shouldWarn: true,
      }
    }

    const info = getTokenExpirationFromTimestamp(expiresValue)
    if (!info) {
      return {
        expiresAt: null,
        remainingSeconds: 0,
        isExpired: true,
        shouldRefresh: true,
        shouldWarn: true,
      }
    }

    return {
      ...info,
      expiresAt: info.expiresAt,
    }
  })

export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const adapter = getAuthAdapter()
    const response = await adapter.login(data)
    return { user: toUser(response.user) }
  })

export const registerFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { name: string; email: string; password: string; password_confirmation: string }) => data)
  .handler(async ({ data }) => {
    const adapter = getAuthAdapter()
    const response = await adapter.register(data)
    return { user: toUser(response.user) }
  })

export const logoutFn = createServerFn({ method: 'POST' })
  .handler(async () => {
    const adapter = getAuthAdapter()
    await adapter.logout()
    return { success: true }
  })

export const getCurrentUserFn = createServerFn({ method: 'GET' })
  .handler(async () => {
    const adapter = getAuthAdapter()
    const normalized = await adapter.getUser()
    if (!normalized) return null
    return toUser(normalized)
  })

export const refreshTokenFn = createServerFn({ method: 'POST' })
  .handler(async () => {
    const adapter = getAuthAdapter()
    const response = await adapter.refresh()
    return { user: toUser(response.user) }
  })

export const getOAuthUrlFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { provider: string }) => data)
  .handler(async ({ data }) => {
    const adapter = getAuthAdapter()
    const url = await adapter.getOAuthUrl(data.provider)
    return { url }
  })
