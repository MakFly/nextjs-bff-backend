'use client'

import { useEffect, useRef, useCallback } from 'react'
import { refreshTokenFn } from '@/lib/server/auth'
import { useAuthStore } from '@/stores/auth-store'

interface UseTokenRefreshOptions {
  onExpired?: () => void
}

export function useTokenRefresh({ onExpired }: UseTokenRefreshOptions = {}) {
  const expiresIn = useAuthStore((s) => s.expiresIn)
  const setUser = useAuthStore((s) => s.setUser)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const refreshInProgress = useRef(false)
  const lastRefreshAt = useRef(0)
  const onExpiredRef = useRef(onExpired)
  onExpiredRef.current = onExpired

  const COOLDOWN_MS = 5000

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const doRefresh = useCallback(async () => {
    if (refreshInProgress.current) return
    if (Date.now() - lastRefreshAt.current < COOLDOWN_MS) return

    refreshInProgress.current = true
    try {
      const { user: newUser, expiresIn: newExpiresIn } = await refreshTokenFn()
      setUser(newUser, newExpiresIn)
      lastRefreshAt.current = Date.now()
    } catch {
      onExpiredRef.current?.()
    } finally {
      refreshInProgress.current = false
    }
  }, [setUser])

  const scheduleRefresh = useCallback(
    (ttlSeconds: number) => {
      clearTimer()
      if (ttlSeconds <= 0) {
        doRefresh()
        return
      }
      const delay = ttlSeconds * 0.75 * 1000
      timerRef.current = setTimeout(() => doRefresh(), delay)
    },
    [clearTimer, doRefresh],
  )

  // Schedule timer when expiresIn changes (login, refresh)
  useEffect(() => {
    if (expiresIn == null || expiresIn <= 0) return
    scheduleRefresh(expiresIn)
    return () => clearTimer()
  }, [expiresIn, scheduleRefresh, clearTimer])

  // Re-check on visibility change (tab back to foreground)
  useEffect(() => {
    if (expiresIn == null) return

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return
      // Re-schedule based on current expiresIn from store
      const currentExpiresIn = useAuthStore.getState().expiresIn
      if (currentExpiresIn == null || currentExpiresIn <= 0) {
        doRefresh()
        return
      }
      scheduleRefresh(currentExpiresIn)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [expiresIn, scheduleRefresh, doRefresh])

  return { refresh: doRefresh }
}
