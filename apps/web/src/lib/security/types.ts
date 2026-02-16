/**
 * Types for BFF security and HMAC
 */

/**
 * Required HMAC headers for communication with Laravel
 */
export type HmacHeaders = {
  'X-BFF-Id': string;
  'X-BFF-Timestamp': string;
  'X-BFF-Signature': string;
};

/**
 * Standardized BFF error
 */
export type BffError = {
  code: BffErrorCode;
  message: string;
  details?: unknown;
};

/**
 * BFF error codes
 */
export enum BffErrorCode {
  INVALID_SIGNATURE = 'INVALID_SIGNATURE',
  MISSING_HEADERS = 'MISSING_HEADERS',
  TIMESTAMP_EXPIRED = 'TIMESTAMP_EXPIRED',
  INVALID_BFF_ID = 'INVALID_BFF_ID',
  UPSTREAM_ERROR = 'UPSTREAM_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
}

/**
 * BFF exception for controlled errors
 */
export class BffException extends Error {
  constructor(
    public code: BffErrorCode,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'BffException';
  }

  toJSON(): BffError {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
    };
  }
}

/**
 * BFF configuration
 */
export type BffConfig = {
  id: string;
  secret: string;
  apiUrl: string;
  timeout: number;
};

/**
 * BFF request result
 */
export type BffResponse<T = unknown> = {
  data: T;
  status: number;
  headers: Headers;
};

/**
 * BFF request options
 */
export type BffRequestOptions = {
  method: string;
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
};
