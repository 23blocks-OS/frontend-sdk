/**
 * Logger interface for SDK debugging and tracing
 */
export interface Logger {
  /**
   * Debug level logging - detailed information for debugging
   */
  debug(message: string, meta?: Record<string, unknown>): void;

  /**
   * Info level logging - general information about operations
   */
  info(message: string, meta?: Record<string, unknown>): void;

  /**
   * Warning level logging - potentially harmful situations
   */
  warn(message: string, meta?: Record<string, unknown>): void;

  /**
   * Error level logging - error events
   */
  error(message: string, meta?: Record<string, unknown>): void;
}

/**
 * Console logger implementation with [23blocks] prefix
 */
export const consoleLogger: Logger = {
  debug: (message: string, meta?: Record<string, unknown>) => {
    if (meta && Object.keys(meta).length > 0) {
      console.debug(`[23blocks] ${message}`, meta);
    } else {
      console.debug(`[23blocks] ${message}`);
    }
  },
  info: (message: string, meta?: Record<string, unknown>) => {
    if (meta && Object.keys(meta).length > 0) {
      console.info(`[23blocks] ${message}`, meta);
    } else {
      console.info(`[23blocks] ${message}`);
    }
  },
  warn: (message: string, meta?: Record<string, unknown>) => {
    if (meta && Object.keys(meta).length > 0) {
      console.warn(`[23blocks] ${message}`, meta);
    } else {
      console.warn(`[23blocks] ${message}`);
    }
  },
  error: (message: string, meta?: Record<string, unknown>) => {
    if (meta && Object.keys(meta).length > 0) {
      console.error(`[23blocks] ${message}`, meta);
    } else {
      console.error(`[23blocks] ${message}`);
    }
  },
};

/**
 * No-op logger that silently discards all log messages
 */
export const noopLogger: Logger = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
};

/**
 * Generate a unique request ID
 * Format: req_<timestamp>_<random>
 */
export function generateRequestId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `req_${timestamp}_${random}`;
}

/**
 * Mask sensitive values in objects for logging
 */
export function maskSensitiveData(
  data: Record<string, unknown>,
  sensitiveKeys: string[] = ['password', 'token', 'secret', 'api_key', 'apiKey', 'authorization']
): Record<string, unknown> {
  const masked: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    const isSensitive = sensitiveKeys.some((sk) => lowerKey.includes(sk.toLowerCase()));

    if (isSensitive && typeof value === 'string') {
      masked[key] = '***';
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      masked[key] = maskSensitiveData(value as Record<string, unknown>, sensitiveKeys);
    } else {
      masked[key] = value;
    }
  }

  return masked;
}
