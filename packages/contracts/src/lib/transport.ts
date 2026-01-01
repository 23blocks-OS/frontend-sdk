import type { Logger } from './logger.js';

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
 * Interceptors for request/response lifecycle
 */
export interface Interceptors {
  /**
   * Called before each request is sent
   * Can modify the request config or throw to abort
   */
  onRequest?: (config: {
    method: string;
    path: string;
    body?: unknown;
    headers: Record<string, string>;
    requestId: string;
  }) => void | Promise<void>;

  /**
   * Called after each successful response
   * Can transform the response or throw to convert to error
   */
  onResponse?: <T>(response: T, context: {
    method: string;
    path: string;
    status: number;
    duration: number;
    requestId: string;
  }) => T | Promise<T>;

  /**
   * Called when an error occurs
   * Can transform the error, recover, or re-throw
   */
  onError?: (error: Error, context: {
    method: string;
    path: string;
    duration: number;
    requestId: string;
  }) => never | Promise<never>;
}

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
  credentials?: 'include' | 'same-origin' | 'omit';

  /**
   * Enable debug logging
   * When true, logs all requests and responses to the console
   */
  debug?: boolean;

  /**
   * Custom logger implementation
   * Defaults to consoleLogger when debug is true, noopLogger otherwise
   */
  logger?: Logger;

  /**
   * Custom request ID generator
   * Defaults to generateRequestId() which produces 'req_<timestamp>_<random>'
   */
  generateRequestId?: () => string;

  /**
   * Request/response interceptors
   */
  interceptors?: Interceptors;
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
