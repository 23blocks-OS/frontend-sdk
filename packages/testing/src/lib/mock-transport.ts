import {
  type Transport,
  type RequestOptions,
  BlockErrorException,
  ErrorCodes,
  generateRequestId,
} from '@23blocks/contracts';

/**
 * HTTP method type
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Recorded request from mock transport
 */
export interface RecordedRequest {
  /** HTTP method */
  method: HttpMethod;
  /** Request path */
  path: string;
  /** Request body (if any) */
  body?: unknown;
  /** Request options */
  options?: RequestOptions;
  /** Timestamp of the request */
  timestamp: number;
}

/**
 * Mock response configuration
 */
export interface MockResponse<T = unknown> {
  /** HTTP status code */
  status: number;
  /** Response data */
  data: T;
  /** Response delay in milliseconds */
  delay?: number;
  /** Headers to include in response */
  headers?: Record<string, string>;
}

/**
 * Mock handler that matches requests and returns responses
 */
interface MockHandler {
  method: HttpMethod | '*';
  pathMatcher: string | RegExp | ((path: string) => boolean);
  response: MockResponse | ((request: RecordedRequest) => MockResponse | Promise<MockResponse>);
  times?: number;
  called: number;
}

/**
 * Options for creating a mock transport
 */
export interface MockTransportOptions {
  /** Default delay for all responses (ms) */
  defaultDelay?: number;
  /** Whether to throw on unmatched requests (default: true) */
  throwOnUnmatched?: boolean;
  /** Base URL for the mock (optional, for logging) */
  baseUrl?: string;
}

/**
 * Request matcher builder for fluent API
 */
export class RequestMatcher {
  private handler: Partial<MockHandler> = { called: 0 };

  constructor(
    private handlers: MockHandler[],
    method: HttpMethod | '*',
    pathMatcher: string | RegExp | ((path: string) => boolean)
  ) {
    this.handler.method = method;
    this.handler.pathMatcher = pathMatcher;
  }

  /**
   * Set the response for this matcher
   */
  reply<T>(status: number, data: T, options?: { delay?: number; headers?: Record<string, string> }): this {
    this.handler.response = {
      status,
      data,
      delay: options?.delay,
      headers: options?.headers,
    };
    this.handlers.push(this.handler as MockHandler);
    return this;
  }

  /**
   * Set an error response for this matcher
   */
  replyWithError(
    code: string,
    message: string,
    status: number = 400,
    options?: { delay?: number; meta?: Record<string, unknown> }
  ): this {
    this.handler.response = {
      status,
      data: {
        errors: [{ code, detail: message, status: String(status) }],
      },
      delay: options?.delay,
    };
    this.handlers.push(this.handler as MockHandler);
    return this;
  }

  /**
   * Set a dynamic response handler
   */
  replyWith<T>(
    handler: (request: RecordedRequest) => MockResponse<T> | Promise<MockResponse<T>>
  ): this {
    this.handler.response = handler;
    this.handlers.push(this.handler as MockHandler);
    return this;
  }

  /**
   * Limit this handler to only respond N times
   */
  times(n: number): this {
    this.handler.times = n;
    return this;
  }

  /**
   * Only respond once
   */
  once(): this {
    return this.times(1);
  }

  /**
   * Only respond twice
   */
  twice(): this {
    return this.times(2);
  }
}

/**
 * Mock Transport implementation for testing
 *
 * @example
 * ```typescript
 * const mock = createMockTransport();
 *
 * // Set up mock responses
 * mock.onPost('/auth/sign_in').reply(200, {
 *   data: { type: 'user', id: '123', attributes: { email: 'test@example.com' } }
 * });
 *
 * mock.onGet('/users/123').reply(404, {
 *   errors: [{ code: 'not_found', detail: 'User not found' }]
 * });
 *
 * // Use with blocks
 * const auth = createAuthenticationBlock(mock, { apiKey: 'test' });
 *
 * // Make assertions
 * expect(mock.history.post).toHaveLength(1);
 * expect(mock.history.post[0].body).toEqual({ email: 'test@example.com', password: 'xxx' });
 * ```
 */
export class MockTransport implements Transport {
  private handlers: MockHandler[] = [];
  private _history: RecordedRequest[] = [];
  private options: Required<MockTransportOptions>;

  constructor(options: MockTransportOptions = {}) {
    this.options = {
      defaultDelay: options.defaultDelay ?? 0,
      throwOnUnmatched: options.throwOnUnmatched ?? true,
      baseUrl: options.baseUrl ?? 'https://mock.23blocks.test',
    };
  }

  /**
   * Access request history
   */
  get history(): {
    all: RecordedRequest[];
    get: RecordedRequest[];
    post: RecordedRequest[];
    put: RecordedRequest[];
    patch: RecordedRequest[];
    delete: RecordedRequest[];
  } {
    return {
      all: this._history,
      get: this._history.filter((r) => r.method === 'GET'),
      post: this._history.filter((r) => r.method === 'POST'),
      put: this._history.filter((r) => r.method === 'PUT'),
      patch: this._history.filter((r) => r.method === 'PATCH'),
      delete: this._history.filter((r) => r.method === 'DELETE'),
    };
  }

  /**
   * Register a GET request handler
   */
  onGet(path: string | RegExp | ((path: string) => boolean)): RequestMatcher {
    return new RequestMatcher(this.handlers, 'GET', path);
  }

  /**
   * Register a POST request handler
   */
  onPost(path: string | RegExp | ((path: string) => boolean)): RequestMatcher {
    return new RequestMatcher(this.handlers, 'POST', path);
  }

  /**
   * Register a PUT request handler
   */
  onPut(path: string | RegExp | ((path: string) => boolean)): RequestMatcher {
    return new RequestMatcher(this.handlers, 'PUT', path);
  }

  /**
   * Register a PATCH request handler
   */
  onPatch(path: string | RegExp | ((path: string) => boolean)): RequestMatcher {
    return new RequestMatcher(this.handlers, 'PATCH', path);
  }

  /**
   * Register a DELETE request handler
   */
  onDelete(path: string | RegExp | ((path: string) => boolean)): RequestMatcher {
    return new RequestMatcher(this.handlers, 'DELETE', path);
  }

  /**
   * Register a handler for any HTTP method
   */
  onAny(path: string | RegExp | ((path: string) => boolean)): RequestMatcher {
    return new RequestMatcher(this.handlers, '*', path);
  }

  /**
   * Clear all handlers
   */
  reset(): void {
    this.handlers = [];
  }

  /**
   * Clear request history
   */
  resetHistory(): void {
    this._history = [];
  }

  /**
   * Clear both handlers and history
   */
  resetAll(): void {
    this.reset();
    this.resetHistory();
  }

  /**
   * Get the number of times a path was called
   */
  getCallCount(method: HttpMethod, path: string): number {
    return this._history.filter((r) => r.method === method && r.path === path).length;
  }

  /**
   * Check if a path was called
   */
  wasCalled(method: HttpMethod, path: string): boolean {
    return this.getCallCount(method, path) > 0;
  }

  /**
   * Get the last request made
   */
  getLastRequest(): RecordedRequest | undefined {
    return this._history[this._history.length - 1];
  }

  /**
   * Get the last request for a specific method
   */
  getLastRequestFor(method: HttpMethod): RecordedRequest | undefined {
    const requests = this._history.filter((r) => r.method === method);
    return requests[requests.length - 1];
  }

  // Transport implementation

  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('GET', path, undefined, options);
  }

  async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('POST', path, body, options);
  }

  async put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PUT', path, body, options);
  }

  async patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>('PATCH', path, body, options);
  }

  async delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>('DELETE', path, undefined, options);
  }

  private async request<T>(
    method: HttpMethod,
    path: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    const recorded: RecordedRequest = {
      method,
      path,
      body,
      options,
      timestamp: Date.now(),
    };

    this._history.push(recorded);

    // Find matching handler
    const handler = this.findHandler(method, path);

    if (!handler) {
      if (this.options.throwOnUnmatched) {
        throw new BlockErrorException({
          code: ErrorCodes.NOT_FOUND,
          message: `No mock handler found for ${method} ${path}`,
          status: 404,
          requestId: generateRequestId(),
        });
      }
      return {} as T;
    }

    // Increment call count
    handler.called++;

    // Get response
    let response: MockResponse;
    if (typeof handler.response === 'function') {
      response = await handler.response(recorded);
    } else {
      response = handler.response;
    }

    // Apply delay
    const delay = response.delay ?? this.options.defaultDelay;
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    // Check for error response
    if (response.status >= 400) {
      const errorData = response.data as { errors?: Array<{ code?: string; detail?: string }> };
      const firstError = errorData.errors?.[0];

      throw new BlockErrorException({
        code: firstError?.code ?? ErrorCodes.INTERNAL_ERROR,
        message: firstError?.detail ?? 'Mock error',
        status: response.status,
        requestId: generateRequestId(),
      });
    }

    // Remove handler if it has reached its limit
    if (handler.times !== undefined && handler.called >= handler.times) {
      const index = this.handlers.indexOf(handler);
      if (index > -1) {
        this.handlers.splice(index, 1);
      }
    }

    return response.data as T;
  }

  private findHandler(method: HttpMethod, path: string): MockHandler | undefined {
    // Find first matching handler (order matters)
    return this.handlers.find((handler) => {
      // Check method
      if (handler.method !== '*' && handler.method !== method) {
        return false;
      }

      // Check if handler has reached its limit
      if (handler.times !== undefined && handler.called >= handler.times) {
        return false;
      }

      // Check path
      const matcher = handler.pathMatcher;

      if (typeof matcher === 'string') {
        return matcher === path;
      }

      if (matcher instanceof RegExp) {
        return matcher.test(path);
      }

      if (typeof matcher === 'function') {
        return matcher(path);
      }

      return false;
    });
  }
}

/**
 * Create a new mock transport instance
 */
export function createMockTransport(options?: MockTransportOptions): MockTransport {
  return new MockTransport(options);
}
