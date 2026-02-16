export type HmacHeaders = {
  'X-BFF-Id': string
  'X-BFF-Timestamp': string
  'X-BFF-Signature': string
}

export enum BffErrorCode {
  INVALID_SIGNATURE = 'INVALID_SIGNATURE',
  MISSING_HEADERS = 'MISSING_HEADERS',
  TIMESTAMP_EXPIRED = 'TIMESTAMP_EXPIRED',
  INVALID_BFF_ID = 'INVALID_BFF_ID',
  UPSTREAM_ERROR = 'UPSTREAM_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
}

export class BffException extends Error {
  constructor(
    public code: BffErrorCode,
    message: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'BffException'
  }

  toJSON() {
    return { code: this.code, message: this.message, details: this.details }
  }
}
