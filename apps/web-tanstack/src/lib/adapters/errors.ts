export class AdapterError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'AdapterError'
  }

  static fromResponse(response: Response, body?: unknown): AdapterError {
    let message = `HTTP ${response.status}: ${response.statusText}`
    let code: string | undefined
    let details: unknown

    if (body && typeof body === 'object') {
      const bodyObj = body as Record<string, unknown>
      message = (bodyObj.message as string) || (bodyObj.error as string) || message
      code = bodyObj.code as string | undefined
      details = bodyObj.errors || bodyObj.details
    }

    return new AdapterError(message, response.status, code, details)
  }
}
