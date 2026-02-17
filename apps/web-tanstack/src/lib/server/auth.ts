import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'
import { getAuthAdapter, toUser, COOKIE_NAMES } from '../adapters'

export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { email: string; password: string }) => data)
  .handler(async ({ data }) => {
    const adapter = getAuthAdapter()
    const response = await adapter.login(data)
    return {
      user: toUser(response.user),
      expiresIn: response.tokens.expires_in ?? null,
    }
  })

export const registerFn = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: {
      name: string
      email: string
      password: string
      password_confirmation: string
    }) => data,
  )
  .handler(async ({ data }) => {
    const adapter = getAuthAdapter()
    const response = await adapter.register(data)
    return {
      user: toUser(response.user),
      expiresIn: response.tokens.expires_in ?? null,
    }
  })

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  const adapter = getAuthAdapter()
  await adapter.logout()
  return { success: true }
})

export const getCurrentUserFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const adapter = getAuthAdapter()
    const normalized = await adapter.getUser()
    if (!normalized) return null

    let expiresIn: number | null = null
    const expiresValue = getCookie(COOKIE_NAMES.TOKEN_EXPIRES_AT)
    if (expiresValue) {
      const expiresAt = new Date(expiresValue).getTime()
      if (!isNaN(expiresAt)) {
        expiresIn = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))
      }
    }

    return { user: toUser(normalized), expiresIn }
  },
)

export const refreshTokenFn = createServerFn({ method: 'POST' }).handler(
  async () => {
    const adapter = getAuthAdapter()
    const response = await adapter.refresh()
    return {
      user: toUser(response.user),
      expiresIn: response.tokens.expires_in ?? null,
    }
  },
)

export const getOAuthUrlFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { provider: string }) => data)
  .handler(async ({ data }) => {
    const adapter = getAuthAdapter()
    const url = await adapter.getOAuthUrl(data.provider)
    return { url }
  })
