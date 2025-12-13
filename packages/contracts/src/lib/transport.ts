/**
 * HTTP request configuration
 */
export interface RequestConfig {
  /** Request path (relative to baseUrl) */
  path: string;
  /** HTTP method */
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  /** Request body */
  body?: unknown;
  /** Query parameters */
  params?: Record<string, string | number | boolean | string[] | undefined>;
  /** Additional headers */
  headers?: Record<string, string>;
  /** Request timeout in milliseconds */
  timeout?: number;
}

/**
 * Request options for individual requests
 */
export interface RequestOptions {
  /** Query parameters */
  params?: Record<string, string | number | boolean | string[] | undefined>;
  /** Additional headers */
  headers?: Record<string, string>;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Signal for aborting the request */
  signal?: AbortSignal;
}

/**
 * Transport interface - abstraction over HTTP implementations
 */
export interface Transport {
  /**
   * Perform a GET request
   */
  get<T>(path: string, options?: RequestOptions): Promise<T>;

  /**
   * Perform a POST request
   */
  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T>;

  /**
   * Perform a PATCH request
   */
  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T>;

  /**
   * Perform a PUT request
   */
  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T>;

  /**
   * Perform a DELETE request
   */
  delete<T>(path: string, options?: RequestOptions): Promise<T>;
}

/**
 * Headers provider function type
 */
export type HeadersProvider =
  | (() => Record<string, string>)
  | (() => Promise<Record<string, string>>);

/**
 * Transport configuration
 */
export interface TransportConfig {
  /** Base URL for all requests */
  baseUrl: string;
  /** Default headers or headers provider */
  headers?: Record<string, string> | HeadersProvider;
  /** Default timeout in milliseconds */
  timeout?: number;
  /** Retry configuration */
  retry?: RetryConfig;
  /**
   * Credentials mode for fetch requests
   * - 'include': Always send cookies, even for cross-origin requests
   * - 'same-origin': Only send cookies for same-origin requests (default browser behavior)
   * - 'omit': Never send cookies
   * Use 'include' for cookie-based authentication
   */
  credentials?: RequestCredentials;
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  /** Maximum number of retries */
  maxRetries: number;
  /** Initial delay in milliseconds */
  initialDelay: number;
  /** Maximum delay in milliseconds */
  maxDelay: number;
  /** Backoff multiplier */
  backoffMultiplier: number;
  /** Status codes to retry on */
  retryableStatuses?: number[];
}
