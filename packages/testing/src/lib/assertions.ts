import type { MockTransport, RecordedRequest, HttpMethod } from './mock-transport.js';

/**
 * Assertion error for mock transport assertions
 */
export class MockAssertionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MockAssertionError';
  }
}

/**
 * Assert that a request was made with the specified method and path
 */
export function assertRequestMade(
  mock: MockTransport,
  method: HttpMethod,
  path: string,
  options?: { times?: number }
): void {
  const count = mock.getCallCount(method, path);
  const expectedTimes = options?.times ?? 1;

  if (count === 0) {
    throw new MockAssertionError(`Expected ${method} ${path} to be called, but it was never called`);
  }

  if (options?.times !== undefined && count !== expectedTimes) {
    throw new MockAssertionError(
      `Expected ${method} ${path} to be called ${expectedTimes} time(s), but it was called ${count} time(s)`
    );
  }
}

/**
 * Assert that a request was NOT made with the specified method and path
 */
export function assertRequestNotMade(mock: MockTransport, method: HttpMethod, path: string): void {
  if (mock.wasCalled(method, path)) {
    const count = mock.getCallCount(method, path);
    throw new MockAssertionError(
      `Expected ${method} ${path} to NOT be called, but it was called ${count} time(s)`
    );
  }
}

/**
 * Assert that a request was made with the specified body
 */
export function assertRequestBody(
  mock: MockTransport,
  method: HttpMethod,
  path: string,
  expectedBody: unknown
): void {
  const requests = mock.history.all.filter((r) => r.method === method && r.path === path);

  if (requests.length === 0) {
    throw new MockAssertionError(`Expected ${method} ${path} to be called, but it was never called`);
  }

  const lastRequest = requests[requests.length - 1];
  const actualBody = JSON.stringify(lastRequest.body);
  const expected = JSON.stringify(expectedBody);

  if (actualBody !== expected) {
    throw new MockAssertionError(
      `Expected ${method} ${path} to be called with body:\n${expected}\n\nBut received:\n${actualBody}`
    );
  }
}

/**
 * Assert that a request body contains specific fields
 */
export function assertRequestBodyContains(
  mock: MockTransport,
  method: HttpMethod,
  path: string,
  expectedFields: Record<string, unknown>
): void {
  const requests = mock.history.all.filter((r) => r.method === method && r.path === path);

  if (requests.length === 0) {
    throw new MockAssertionError(`Expected ${method} ${path} to be called, but it was never called`);
  }

  const lastRequest = requests[requests.length - 1];
  const body = lastRequest.body as Record<string, unknown>;

  for (const [key, expectedValue] of Object.entries(expectedFields)) {
    const actualValue = body?.[key];
    if (JSON.stringify(actualValue) !== JSON.stringify(expectedValue)) {
      throw new MockAssertionError(
        `Expected ${method} ${path} body.${key} to be ${JSON.stringify(expectedValue)}, but got ${JSON.stringify(actualValue)}`
      );
    }
  }
}

/**
 * Assert that a request was made with specific query parameters
 */
export function assertRequestParams(
  mock: MockTransport,
  method: HttpMethod,
  path: string,
  expectedParams: Record<string, unknown>
): void {
  const requests = mock.history.all.filter((r) => r.method === method && r.path === path);

  if (requests.length === 0) {
    throw new MockAssertionError(`Expected ${method} ${path} to be called, but it was never called`);
  }

  const lastRequest = requests[requests.length - 1];
  const actualParams = lastRequest.options?.params ?? {};

  for (const [key, expectedValue] of Object.entries(expectedParams)) {
    const actualValue = actualParams[key];
    if (JSON.stringify(actualValue) !== JSON.stringify(expectedValue)) {
      throw new MockAssertionError(
        `Expected ${method} ${path} params.${key} to be ${JSON.stringify(expectedValue)}, but got ${JSON.stringify(actualValue)}`
      );
    }
  }
}

/**
 * Assert that no requests were made
 */
export function assertNoRequests(mock: MockTransport): void {
  if (mock.history.all.length > 0) {
    const requests = mock.history.all.map((r) => `${r.method} ${r.path}`).join('\n  ');
    throw new MockAssertionError(`Expected no requests to be made, but found:\n  ${requests}`);
  }
}

/**
 * Assert the total number of requests made
 */
export function assertRequestCount(mock: MockTransport, count: number): void {
  const actual = mock.history.all.length;
  if (actual !== count) {
    throw new MockAssertionError(`Expected ${count} request(s) to be made, but found ${actual}`);
  }
}

/**
 * Assert requests were made in a specific order
 */
export function assertRequestOrder(
  mock: MockTransport,
  expectedOrder: Array<{ method: HttpMethod; path: string }>
): void {
  const history = mock.history.all;

  if (history.length < expectedOrder.length) {
    throw new MockAssertionError(
      `Expected at least ${expectedOrder.length} request(s), but only ${history.length} were made`
    );
  }

  for (let i = 0; i < expectedOrder.length; i++) {
    const expected = expectedOrder[i];
    const actual = history[i];

    if (actual.method !== expected.method || actual.path !== expected.path) {
      throw new MockAssertionError(
        `Expected request ${i + 1} to be ${expected.method} ${expected.path}, but got ${actual.method} ${actual.path}`
      );
    }
  }
}

/**
 * Get all requests matching a pattern
 */
export function getRequestsMatching(
  mock: MockTransport,
  predicate: (request: RecordedRequest) => boolean
): RecordedRequest[] {
  return mock.history.all.filter(predicate);
}

/**
 * Wait for a specific number of requests to be made
 * Useful for async tests
 */
export async function waitForRequests(
  mock: MockTransport,
  count: number,
  timeout: number = 5000
): Promise<void> {
  const startTime = Date.now();

  while (mock.history.all.length < count) {
    if (Date.now() - startTime > timeout) {
      throw new MockAssertionError(
        `Timeout waiting for ${count} request(s). Only ${mock.history.all.length} were made.`
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}

/**
 * Create a Jest/Vitest matcher extension object
 * Use with expect.extend(mockTransportMatchers)
 */
export const mockTransportMatchers = {
  toHaveBeenCalledWith(
    mock: MockTransport,
    method: HttpMethod,
    path: string,
    body?: unknown
  ) {
    const pass = mock.wasCalled(method, path);

    if (pass && body !== undefined) {
      const requests = mock.history.all.filter((r) => r.method === method && r.path === path);
      const lastRequest = requests[requests.length - 1];
      const bodyMatches = JSON.stringify(lastRequest?.body) === JSON.stringify(body);

      return {
        pass: bodyMatches,
        message: () =>
          bodyMatches
            ? `Expected ${method} ${path} not to be called with ${JSON.stringify(body)}`
            : `Expected ${method} ${path} to be called with ${JSON.stringify(body)}, but got ${JSON.stringify(lastRequest?.body)}`,
      };
    }

    return {
      pass,
      message: () =>
        pass
          ? `Expected ${method} ${path} not to be called`
          : `Expected ${method} ${path} to be called`,
    };
  },

  toHaveRequestCount(mock: MockTransport, count: number) {
    const actual = mock.history.all.length;
    const pass = actual === count;

    return {
      pass,
      message: () =>
        pass
          ? `Expected not to have ${count} request(s)`
          : `Expected ${count} request(s), but found ${actual}`,
    };
  },
};
