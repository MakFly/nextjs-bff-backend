'use client'

import { useEffect, useRef, useState } from 'react'
import { ClockIcon, RefreshCwIcon } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'

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
  const expiresIn = useAuthStore((s) => s.expiresIn)
  const user = useAuthStore((s) => s.user)
  const expiresAtRef = useRef<number | null>(null)
  const [remaining, setRemaining] = useState(0)

  // Compute expiresAt timestamp when expiresIn changes
  useEffect(() => {
    if (expiresIn != null && expiresIn > 0) {
      expiresAtRef.current = Date.now() + expiresIn * 1000
      setRemaining(expiresIn)
    } else {
      expiresAtRef.current = null
      setRemaining(0)
    }
  }, [expiresIn])

  // Countdown interval
  useEffect(() => {
    if (!expiresAtRef.current) return

    const tick = () => {
      const r = Math.floor((expiresAtRef.current! - Date.now()) / 1000)
      setRemaining(Math.max(0, r))
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [expiresIn])

  const isExpired = !user || remaining <= 0
  const shouldRefresh = remaining > 0 && remaining < 300
  const shouldWarn = remaining > 0 && remaining < 600

  const getStatusColor = () => {
    if (isExpired) return 'text-red-500'
    if (shouldRefresh) return 'text-orange-500'
    if (shouldWarn) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getStatusBg = () => {
    if (isExpired) return 'bg-red-500/10 border-red-500/20'
    if (shouldRefresh) return 'bg-orange-500/10 border-orange-500/20'
    if (shouldWarn) return 'bg-yellow-500/10 border-yellow-500/20'
    return 'bg-green-500/10 border-green-500/20'
  }

  const getStatusLabel = () => {
    if (isExpired) return 'Session expired'
    if (shouldRefresh) return 'Refresh soon'
    if (shouldWarn) return 'Token expiring'
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
        <span>{formatTime(remaining)}</span>
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
        (shouldRefresh || isExpired ? (
          <RefreshCwIcon className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <ClockIcon className="h-3.5 w-3.5" />
        ))}
      <div className="flex flex-col">
        <span className="font-medium">{getStatusLabel()}</span>
        <span className="opacity-80">
          {isExpired
            ? 'Please login again'
            : `Expires in ${formatTime(remaining)}`}
        </span>
      </div>
    </div>
  )
}
