import {
  type Transport,
  type TransportConfig,
  type RequestOptions,
  type HeadersProvider,
  BlockErrorException,
  ErrorCodes,
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
      // Handle arrays (e.g., filter[status][]=active&filter[status][]=pending)
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
  configHeaders?: Record<string, string> | HeadersProvider,
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
    'Content-Type': 'application/vnd.api+json',
    Accept: 'application/vnd.api+json',
    ...baseHeaders,
    ...optionHeaders,
  };
}

/**
 * Handle HTTP response and convert errors to BlockErrorException
 */
async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json') || contentType.includes('application/vnd.api+json');

  if (!response.ok) {
    if (isJson) {
      try {
        const errorBody = await response.json();
        // JSON:API error format
        if (errorBody.errors && Array.isArray(errorBody.errors)) {
          const firstError = errorBody.errors[0];
          throw new BlockErrorException({
            code: firstError.code || ErrorCodes.INTERNAL_ERROR,
            message: firstError.detail || firstError.title || 'Request failed',
            status: response.status,
            source: firstError.source?.pointer,
            meta: {
              errors: errorBody.errors,
            },
          });
        }
        // Generic error format
        throw new BlockErrorException({
          code: errorBody.error || ErrorCodes.INTERNAL_ERROR,
          message: errorBody.message || 'Request failed',
          status: response.status,
          meta: errorBody,
        });
      } catch (e) {
        if (e instanceof BlockErrorException) throw e;
        // Fall through to generic error
      }
    }

    // Generic HTTP error
    throw new BlockErrorException({
      code: response.status === 401 ? ErrorCodes.UNAUTHORIZED
           : response.status === 403 ? ErrorCodes.FORBIDDEN
           : response.status === 404 ? ErrorCodes.NOT_FOUND
           : response.status === 422 ? ErrorCodes.VALIDATION_ERROR
           : ErrorCodes.INTERNAL_ERROR,
      message: response.statusText || 'Request failed',
      status: response.status,
    });
  }

  // Handle empty response
  if (response.status === 204 || !isJson) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}

/**
 * Create an HTTP transport instance
 */
export function createHttpTransport(config: TransportConfig): Transport {
  const { baseUrl, headers: configHeaders, timeout: defaultTimeout = 30000, credentials } = config;

  async function request<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    const url = `${baseUrl}${path}${buildQueryString(options?.params)}`;
    const headers = await resolveHeaders(configHeaders, options?.headers);

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

      return handleResponse<T>(response);
    } catch (error) {
      if (error instanceof BlockErrorException) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new BlockErrorException({
            code: ErrorCodes.TIMEOUT,
            message: 'Request timed out',
            status: 408,
          });
        }

        throw new BlockErrorException({
          code: ErrorCodes.NETWORK_ERROR,
          message: error.message || 'Network error',
          status: 0,
        });
      }

      throw error;
    } finally {
      clearTimeout(timeoutId);
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

export type { Transport, TransportConfig, RequestOptions };
