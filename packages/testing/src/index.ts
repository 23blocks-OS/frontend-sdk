/**
 * @23blocks/testing
 *
 * Testing utilities for the 23blocks SDK
 *
 * @example
 * ```typescript
 * import { createMockTransport, fixtures } from '@23blocks/testing';
 * import { createAuthenticationBlock } from '@23blocks/block-authentication';
 *
 * // Create mock transport
 * const mock = createMockTransport();
 *
 * // Set up mock responses
 * mock.onPost('/auth/sign_in').reply(200, fixtures.auth.signInResponse());
 * mock.onGet('/users/me').reply(200, fixtures.auth.currentUserResponse({ name: 'John' }));
 * mock.onPost('/auth/sign_up').replyWithError('already_exists', 'Email taken', 422);
 *
 * // Use with blocks
 * const auth = createAuthenticationBlock(mock, { apiKey: 'test' });
 *
 * // Test your code
 * const result = await auth.auth.signIn({ email: 'test@example.com', password: 'password' });
 *
 * // Make assertions
 * expect(mock.history.post).toHaveLength(1);
 * expect(mock.history.post[0].body).toEqual({
 *   email: 'test@example.com',
 *   password: 'password',
 * });
 * ```
 */

// Mock Transport
export {
  MockTransport,
  createMockTransport,
  RequestMatcher,
  type HttpMethod,
  type RecordedRequest,
  type MockResponse,
  type MockTransportOptions,
} from './lib/mock-transport.js';

// Fixtures
export {
  fixtures,
  auth,
  products,
  search,
  generic,
  createUser,
  createProduct,
  createSearchResult,
  jsonApiResponse,
  jsonApiListResponse,
  jsonApiError,
  generateId,
  resetIdCounter,
  uuid,
  timestamp,
  type UserFixture,
  type ProductFixture,
  type SearchResultFixture,
} from './lib/fixtures.js';

// Assertions
export {
  MockAssertionError,
  assertRequestMade,
  assertRequestNotMade,
  assertRequestBody,
  assertRequestBodyContains,
  assertRequestParams,
  assertNoRequests,
  assertRequestCount,
  assertRequestOrder,
  getRequestsMatching,
  waitForRequests,
  mockTransportMatchers,
} from './lib/assertions.js';
