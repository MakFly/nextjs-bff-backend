import { createHash, createHmac } from 'node:crypto'
import type { HmacHeaders } from './types'

export const BFF_SECRET = process.env.BFF_HMAC_SECRET || ''
export const BFF_ID = process.env.BFF_ID || 'tanstack-bff'

export function ensureHmacConfigured(): void {
  if (!BFF_SECRET) {
    throw new Error('BFF_HMAC_SECRET environment variable is not set')
  }
}

export function hashBody(body: unknown): string {
  if (!body) return ''
  const normalized = sortObjectKeys(body)
  const jsonString = JSON.stringify(normalized, (_key, value) => {
    if (typeof value === 'number' && Number.isInteger(value)) return value
    return value
  }, 0)
  const compactJson = jsonString.replace(/\s/g, '')
  return createHash('sha256').update(compactJson, 'utf8').digest('hex')
}

function sortObjectKeys(obj: unknown): unknown {
  if (obj === null || typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(sortObjectKeys)
  const sorted = Object.keys(obj as Record<string, unknown>)
    .sort()
    .reduce<Record<string, unknown>>((acc, key) => {
      acc[key] = sortObjectKeys((obj as Record<string, unknown>)[key])
      return acc
    }, {})
  return sorted
}

export function generateSignature(
  method: string,
  path: string,
  body?: unknown
): HmacHeaders & { normalizedBody?: string } {
  ensureHmacConfigured()
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const bodyHash = hashBody(body)
  const payload = `${timestamp}:${method}:${path}:${bodyHash}`
  const signature = createHmac('sha256', BFF_SECRET).update(payload, 'utf8').digest('hex')
  const headers: HmacHeaders = {
    'X-BFF-Id': BFF_ID,
    'X-BFF-Timestamp': timestamp,
    'X-BFF-Signature': signature,
  }
  let normalizedBody: string | undefined
  if (body !== null && body !== undefined) {
    const normalized = sortObjectKeys(body)
    normalizedBody = JSON.stringify(normalized)
  }
  return { ...headers, normalizedBody }
}
