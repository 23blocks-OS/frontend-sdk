import {
  type Transport,
  type TransportConfig,
  type RequestOptions,
  type RetryConfig,
  type Interceptors,
  type Logger,
  BlockErrorException,
  ErrorCodes,
  consoleLogger,
  noopLogger,
  generateRequestId as defaultGenerateRequestId,
  maskSensitiveData,
} from '@23blocks/contracts';

/**
 * Build query string from params object
 */
function buildQueryString(
  params?: Record<string, string | number | boolean | string[] | undefined>
): string {
  if (!params) return '';

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;

    if (Array.isArray(value)) {
      for (const item of value) {
        searchParams.append(`${key}[]`, item);
      }
    } else {
      searchParams.append(key, String(value));
    }
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Resolve headers from config and options
 */
async function resolveHeaders(
  configHeaders?: Record<string, string> | (() => Record<string, string>) | (() => Promise<Record<string, string>>),
  optionHeaders?: Record<string, string>
): Promise<Record<string, string>> {
  let baseHeaders: Record<string, string> = {};

  if (configHeaders) {
    if (typeof configHeaders === 'function') {
      baseHeaders = await configHeaders();
    } else {
      baseHeaders = configHeaders;
    }
  }

  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...baseHeaders,
    ...optionHeaders,
  };
}

/**
 * Sleep for a given number of milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate retry delay with exponential backoff and jitter
 */
function calculateRetryDelay(attempt: number, config: RetryConfig): number {
  const exponentialDelay = config.initialDelay * Math.pow(config.backoffMultiplier, attempt);
  const cappedDelay = Math.min(exponentialDelay, config.maxDelay);
  // Add jitter (±25%)
  const jitter = cappedDelay * 0.25 * (Math.random() * 2 - 1);
  return Math.floor(cappedDelay + jitter);
}

/**
 * Check if an error should trigger a retry
 */
function shouldRetry(error: unknown, config: RetryConfig): boolean {
  if (error instanceof BlockErrorException) {
    const retryableStatuses = config.retryableStatuses ?? [429, 502, 503, 504];
    return retryableStatuses.includes(error.status);
  }
  // Retry network errors
  if (error instanceof Error && error.message.includes('network')) {
    return true;
  }
  return false;
}

/**
 * Mask headers for logging (hide sensitive values)
 */
function maskHeaders(headers: Record<string, string>): Record<string, string> {
  const sensitiveHeaders = ['authorization', 'x-api-key', 'api-key', 'cookie', 'set-cookie'];
  const masked: Record<string, string> = {};

  for (const [key, value] of Object.entries(headers)) {
    if (sensitiveHeaders.includes(key.toLowerCase())) {
      masked[key] = '***';
    } else {
      masked[key] = value;
    }
  }

  return masked;
}

/**
 * Create an HTTP transport instance with logging, retries, and interceptors
 */
export function createHttpTransport(config: TransportConfig): Transport {
  const {
    baseUrl,
    headers: configHeaders,
    timeout: defaultTimeout = 30000,
    credentials,
    debug = false,
    retry: retryConfig,
    interceptors = {},
    generateRequestId = defaultGenerateRequestId,
  } = config;

  // Determine logger: use provided logger, or consoleLogger if debug, otherwise noopLogger
  const logger: Logger = config.logger ?? (debug ? consoleLogger : noopLogger);

  async function request<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    const requestId = generateRequestId();
    const url = `${baseUrl}${path}${buildQueryString(options?.params)}`;
    const headers = await resolveHeaders(configHeaders, options?.headers);

    // Add request ID to headers for backend tracing
    headers['X-Request-ID'] = requestId;

    const startTime = Date.now();

    // Log request
    logger.debug(`${method} ${path} [${requestId}]`);
    if (debug) {
      logger.debug(`→ Headers: ${JSON.stringify(maskHeaders(headers))}`);
      if (body) {
        logger.debug(`→ Body: ${JSON.stringify(maskSensitiveData(body as Record<string, unknown>))}`);
      }
    }

    // Call onRequest interceptor
    if (interceptors.onRequest) {
      try {
        await interceptors.onRequest({ method, path, body, headers, requestId });
      } catch (error) {
        const duration = Date.now() - startTime;
        logger.error(`✗ Request interceptor error [${requestId}]`, { error });
        throw error;
      }
    }

    // Execute with retry logic
    const executeRequest = async (): Promise<T> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        options?.timeout ?? defaultTimeout
      );

      try {
        const response = await fetch(url, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
          signal: options?.signal ?? controller.signal,
          credentials,
        });

        const duration = Date.now() - startTime;

        if (!response.ok) {
          const contentType = response.headers.get('content-type') || '';
          const isJson = contentType.includes('application/json') || contentType.includes('application/vnd.api+json');

          let errorBody: Record<string, unknown> = {};
          if (isJson) {
            try {
              errorBody = await response.json();
            } catch {
              // Ignore JSON parse errors
            }
          }

          logger.error(`✗ ${response.status} ${response.statusText} (${duration}ms) [${requestId}]`);
          if (debug && Object.keys(errorBody).length > 0) {
            logger.error(`✗ Error: ${JSON.stringify(errorBody)}`);
          }

          // Handle different error formats
          if (errorBody.errors && Array.isArray(errorBody.errors)) {
            const firstError = errorBody.errors[0];
            if (typeof firstError === 'object' && firstError !== null) {
              throw new BlockErrorException({
                code: (firstError as Record<string, unknown>).code as string || ErrorCodes.VALIDATION_ERROR,
                message: (firstError as Record<string, unknown>).detail as string || (firstError as Record<string, unknown>).title as string || 'Request failed',
                status: response.status,
                source: ((firstError as Record<string, unknown>).source as Record<string, unknown>)?.pointer as string,
                meta: { errors: errorBody.errors },
                requestId,
                duration,
              });
            }
            throw new BlockErrorException({
              code: ErrorCodes.VALIDATION_ERROR,
              message: (errorBody.errors as string[]).join(', '),
              status: response.status,
              meta: { errors: errorBody.errors, data: errorBody.data },
              requestId,
              duration,
            });
          }

          if (errorBody.success === false && errorBody.errors) {
            const errors = Array.isArray(errorBody.errors) ? errorBody.errors : [errorBody.errors];
            throw new BlockErrorException({
              code: ErrorCodes.VALIDATION_ERROR,
              message: (errors as string[]).join(', '),
              status: response.status,
              meta: { errors, data: errorBody.data },
              requestId,
              duration,
            });
          }

          throw new BlockErrorException({
            code: (errorBody.error as string) || getErrorCodeFromStatus(response.status),
            message: (errorBody.message as string) || response.statusText || 'Request failed',
            status: response.status,
            meta: errorBody,
            requestId,
            duration,
          });
        }

        // Success
        logger.info(`← ${response.status} OK (${duration}ms) [${requestId}]`);

        const contentType = response.headers.get('content-type') || '';
        const isJson = contentType.includes('application/json') || contentType.includes('application/vnd.api+json');

        if (response.status === 204 || !isJson) {
          let result = {} as T;

          // Call onResponse interceptor
          if (interceptors.onResponse) {
            result = await interceptors.onResponse(result, {
              method,
              path,
              status: response.status,
              duration,
              requestId,
            });
          }

          return result;
        }

        let result = await response.json() as T;

        if (debug) {
          logger.debug(`← Body: ${JSON.stringify(result)}`);
        }

        // Call onResponse interceptor
        if (interceptors.onResponse) {
          result = await interceptors.onResponse(result, {
            method,
            path,
            status: response.status,
            duration,
            requestId,
          });
        }

        return result;
      } catch (error) {
        if (error instanceof BlockErrorException) {
          throw error;
        }

        const duration = Date.now() - startTime;

        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            logger.error(`✗ Timeout after ${duration}ms [${requestId}]`);
            throw new BlockErrorException({
              code: ErrorCodes.TIMEOUT,
              message: 'Request timed out',
              status: 408,
              requestId,
              duration,
            });
          }

          logger.error(`✗ Network error: ${error.message} [${requestId}]`);
          throw new BlockErrorException({
            code: ErrorCodes.NETWORK_ERROR,
            message: error.message || 'Network error',
            status: 0,
            requestId,
            duration,
          });
        }

        throw error;
      } finally {
        clearTimeout(timeoutId);
      }
    };

    // Execute with retries if configured
    if (retryConfig && retryConfig.maxRetries > 0) {
      let lastError: Error = new Error('Unknown error');

      for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
        try {
          return await executeRequest();
        } catch (error) {
          lastError = error as Error;

          if (attempt < retryConfig.maxRetries && shouldRetry(error, retryConfig)) {
            const delay = calculateRetryDelay(attempt, retryConfig);
            logger.warn(`Retrying in ${delay}ms (attempt ${attempt + 1}/${retryConfig.maxRetries}) [${requestId}]`);
            await sleep(delay);
          } else {
            // Call onError interceptor if defined
            if (interceptors.onError) {
              const duration = Date.now() - startTime;
              await interceptors.onError(lastError, { method, path, duration, requestId });
            }
            throw error;
          }
        }
      }

      // Call onError interceptor for final failure
      if (interceptors.onError) {
        const duration = Date.now() - startTime;
        await interceptors.onError(lastError, { method, path, duration, requestId });
      }
      throw lastError;
    }

    // Execute without retries
    try {
      return await executeRequest();
    } catch (error) {
      // Call onError interceptor if defined
      if (interceptors.onError) {
        const duration = Date.now() - startTime;
        await interceptors.onError(error as Error, { method, path, duration, requestId });
      }
      throw error;
    }
  }

  return {
    get<T>(path: string, options?: RequestOptions): Promise<T> {
      return request<T>('GET', path, undefined, options);
    },

    post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
      return request<T>('POST', path, body, options);
    },

    patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
      return request<T>('PATCH', path, body, options);
    },

    put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
      return request<T>('PUT', path, body, options);
    },

    delete<T>(path: string, options?: RequestOptions): Promise<T> {
      return request<T>('DELETE', path, undefined, options);
    },
  };
}

/**
 * Get error code from HTTP status
 */
function getErrorCodeFromStatus(status: number): string {
  switch (status) {
    case 401:
      return ErrorCodes.UNAUTHORIZED;
    case 403:
      return ErrorCodes.FORBIDDEN;
    case 404:
      return ErrorCodes.NOT_FOUND;
    case 409:
      return ErrorCodes.CONFLICT;
    case 422:
      return ErrorCodes.VALIDATION_ERROR;
    case 429:
      return 'rate_limit_exceeded';
    case 503:
      return ErrorCodes.SERVICE_UNAVAILABLE;
    default:
      return ErrorCodes.INTERNAL_ERROR;
  }
}

export type { Transport, TransportConfig, RequestOptions };
