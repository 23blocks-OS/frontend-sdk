/**
 * Base error interface for all 23blocks SDK errors
 */
export interface BlockError {
  /** Error code identifier */
  code: string;
  /** Human-readable error message */
  message: string;
  /** HTTP status code */
  status: number;
  /** Source pointer (e.g., '/data/attributes/email') */
  source?: string;
  /** Additional metadata */
  meta?: Record<string, unknown>;
  /** Unique request ID for tracing and support */
  requestId?: string;
  /** Request duration in milliseconds */
  duration?: number;
}

/**
 * BlockError class that can be thrown and caught
 */
export class BlockErrorException extends Error implements BlockError {
  readonly code: string;
  readonly status: number;
  readonly source?: string;
  readonly meta?: Record<string, unknown>;
  readonly requestId?: string;
  readonly duration?: number;

  constructor(error: BlockError) {
    super(error.message);
    this.name = 'BlockErrorException';
    this.code = error.code;
    this.status = error.status;
    this.source = error.source;
    this.meta = error.meta;
    this.requestId = error.requestId;
    this.duration = error.duration;

    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BlockErrorException);
    }
  }

  toJSON(): BlockError {
    return {
      code: this.code,
      message: this.message,
      status: this.status,
      source: this.source,
      meta: this.meta,
      requestId: this.requestId,
      duration: this.duration,
    };
  }
}

/**
 * Type guard to check if an error is a BlockError
 */
export function isBlockError(error: unknown): error is BlockError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    'status' in error
  );
}

/**
 * Type guard to check if an error is a BlockErrorException
 */
export function isBlockErrorException(error: unknown): error is BlockErrorException {
  return error instanceof BlockErrorException;
}

/**
 * Common error codes used across the SDK
 */
export const ErrorCodes = {
  // Authentication errors
  UNAUTHORIZED: 'unauthorized',
  FORBIDDEN: 'forbidden',
  INVALID_CREDENTIALS: 'invalid_credentials',
  TOKEN_EXPIRED: 'token_expired',
  TOKEN_INVALID: 'token_invalid',

  // Validation errors
  VALIDATION_ERROR: 'validation_error',
  INVALID_ATTRIBUTE: 'invalid_attribute',
  MISSING_ATTRIBUTE: 'missing_attribute',

  // Resource errors
  NOT_FOUND: 'not_found',
  CONFLICT: 'conflict',
  ALREADY_EXISTS: 'already_exists',

  // Server errors
  INTERNAL_ERROR: 'internal_error',
  SERVICE_UNAVAILABLE: 'service_unavailable',
  TIMEOUT: 'timeout',

  // Network errors
  NETWORK_ERROR: 'network_error',
  CONNECTION_REFUSED: 'connection_refused',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
