'use client'

import { useEffect, useState, useRef } from 'react'
import { ClockIcon, RefreshCwIcon } from 'lucide-react'
import { getTokenStatusFn, refreshTokenFn, type TokenStatusInfo } from '@/lib/server/auth'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'

const DEFAULT_STATUS: TokenStatusInfo = {
  expiresAt: null,
  remainingSeconds: 0,
  isExpired: true,
  shouldRefresh: true,
  shouldWarn: true,
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return 'Expired'

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`
  }
  return `${secs}s`
}

interface TokenStatusProps {
  className?: string
  showIcon?: boolean
  compact?: boolean
}

export function TokenStatus({
  className,
  showIcon = true,
  compact = false,
}: TokenStatusProps) {
  const [status, setStatus] = useState<TokenStatusInfo>(DEFAULT_STATUS)
  const setUser = useAuthStore((s) => s.setUser)
  const refreshInProgress = useRef(false)
  const lastRefreshAt = useRef(0)
  const REFRESH_COOLDOWN_MS = 2000

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await getTokenStatusFn()
        setStatus(data)
      } catch {
        setStatus(DEFAULT_STATUS)
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const shouldAttemptRefresh =
      (status.shouldRefresh || status.isExpired) &&
      !refreshInProgress.current &&
      Date.now() - lastRefreshAt.current >= REFRESH_COOLDOWN_MS
    if (!shouldAttemptRefresh) return

    refreshInProgress.current = true
    refreshTokenFn()
      .then(({ user }) => {
        setUser(user)
        lastRefreshAt.current = Date.now()
      })
      .catch(() => {
        setStatus(DEFAULT_STATUS)
      })
      .finally(() => {
        refreshInProgress.current = false
      })
  }, [status.shouldRefresh, status.isExpired, setUser])

  const getStatusColor = () => {
    if (status.isExpired) return 'text-red-500'
    if (status.shouldRefresh) return 'text-orange-500'
    if (status.shouldWarn) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getStatusBg = () => {
    if (status.isExpired) return 'bg-red-500/10 border-red-500/20'
    if (status.shouldRefresh) return 'bg-orange-500/10 border-orange-500/20'
    if (status.shouldWarn) return 'bg-yellow-500/10 border-yellow-500/20'
    return 'bg-green-500/10 border-green-500/20'
  }

  const getStatusLabel = () => {
    if (status.isExpired) return 'Session expired'
    if (status.shouldRefresh) return 'Refresh soon'
    if (status.shouldWarn) return 'Token expiring'
    return 'Session active'
  }

  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center gap-1.5 text-xs',
          getStatusColor(),
          className,
        )}
      >
        {showIcon && <ClockIcon className="h-3 w-3" />}
        <span>{formatTime(status.remainingSeconds)}</span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-md border px-3 py-2 text-xs',
        getStatusBg(),
        getStatusColor(),
        className,
      )}
    >
      {showIcon &&
        (status.shouldRefresh || status.isExpired ? (
          <RefreshCwIcon className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <ClockIcon className="h-3.5 w-3.5" />
        ))}
      <div className="flex flex-col">
        <span className="font-medium">{getStatusLabel()}</span>
        <span className="opacity-80">
          {status.isExpired
            ? 'Please login again'
            : `Expires in ${formatTime(status.remainingSeconds)}`}
        </span>
      </div>
    </div>
  )
}
