# @23blocks/testing

Testing utilities for the 23blocks SDK - mock transport, fixtures, and assertion helpers.

[![npm version](https://img.shields.io/npm/v/@23blocks/testing.svg)](https://www.npmjs.com/package/@23blocks/testing)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install --save-dev @23blocks/testing
```

## Overview

This package provides testing utilities for applications using the 23blocks SDK:

- **MockTransport** - A mock HTTP transport with fluent API for setting up responses
- **Fixtures** - Pre-built response factories for common entities (users, products, etc.)
- **Assertions** - Helper functions for asserting on recorded requests

## Quick Start

```typescript
import { createMockTransport, fixtures } from '@23blocks/testing';
import { createAuthenticationBlock } from '@23blocks/block-authentication';

// Create mock transport
const mock = createMockTransport();

// Set up mock responses
mock.onPost('/auth/sign_in').reply(200, fixtures.auth.signInResponse());
mock.onGet('/users/me').reply(200, fixtures.auth.currentUserResponse({ name: 'John Doe' }));

// Use with blocks
const auth = createAuthenticationBlock(mock, { apiKey: 'test-key' });

// Test your code
const result = await auth.auth.signIn({
  email: 'test@example.com',
  password: 'password123',
});

// Assert on requests
expect(mock.history.post).toHaveLength(1);
expect(mock.history.post[0].body).toEqual({
  email: 'test@example.com',
  password: 'password123',
});
```

## MockTransport

### Creating a Mock

```typescript
import { createMockTransport } from '@23blocks/testing';

// Basic usage
const mock = createMockTransport();

// With options
const mock = createMockTransport({
  defaultDelay: 100,        // Add delay to all responses (ms)
  throwOnUnmatched: true,   // Throw error for unhandled requests (default: true)
  baseUrl: 'https://test.api.com',
});
```

### Setting Up Responses

```typescript
// Simple response
mock.onGet('/users').reply(200, { data: [...] });

// With delay
mock.onPost('/auth/sign_in').reply(200, { data: {...} }, { delay: 500 });

// Error response
mock.onGet('/users/999').replyWithError('not_found', 'User not found', 404);

// Dynamic response
mock.onPost('/users').replyWith((request) => ({
  status: 201,
  data: {
    data: {
      type: 'user',
      id: 'new-id',
      attributes: request.body,
    },
  },
}));

// Match with regex
mock.onGet(/\/users\/\d+/).reply(200, { data: {...} });

// Match with function
mock.onGet((path) => path.startsWith('/api/')).reply(200, { data: {...} });

// Match any method
mock.onAny('/health').reply(200, { status: 'ok' });
```

### Limiting Response Count

```typescript
// Only respond once
mock.onGet('/users').reply(200, { data: [...] }).once();

// Respond twice
mock.onGet('/users').reply(200, { data: [...] }).twice();

// Respond N times
mock.onGet('/users').reply(200, { data: [...] }).times(3);
```

### Request History

```typescript
// Access all requests
mock.history.all;

// Access by method
mock.history.get;
mock.history.post;
mock.history.put;
mock.history.patch;
mock.history.delete;

// Check if path was called
mock.wasCalled('GET', '/users');

// Get call count
mock.getCallCount('POST', '/auth/sign_in');

// Get last request
mock.getLastRequest();
mock.getLastRequestFor('POST');
```

### Resetting

```typescript
// Clear all handlers
mock.reset();

// Clear request history
mock.resetHistory();

// Clear both
mock.resetAll();
```

## Fixtures

### Authentication Fixtures

```typescript
import { fixtures } from '@23blocks/testing';

// Sign in response
fixtures.auth.signInResponse();
fixtures.auth.signInResponse({ email: 'custom@example.com', name: 'Custom User' });

// Sign up response
fixtures.auth.signUpResponse();
fixtures.auth.signUpResponse({}, { requiresConfirmation: true });

// Current user response
fixtures.auth.currentUserResponse({ name: 'John Doe' });

// Error responses
fixtures.auth.invalidCredentialsError();
fixtures.auth.unauthorizedError();
fixtures.auth.tokenExpiredError();
fixtures.auth.emailNotConfirmedError();
fixtures.auth.emailTakenError();
```

### Product Fixtures

```typescript
// Single product
fixtures.products.productResponse({ name: 'Test Product', price: 1999 });

// Product list
fixtures.products.listResponse(10);  // 10 products
fixtures.products.listResponse(5, { status: 'active' });

// Error
fixtures.products.notFoundError('product-123');
```

### Search Fixtures

```typescript
// Search results
fixtures.search.resultsResponse(10, 'search query');

// Empty results
fixtures.search.emptyResponse('no results query');
```

### Generic Fixtures

```typescript
// Empty success
fixtures.generic.emptySuccess();

// Validation error
fixtures.generic.validationError('email', 'Email is invalid');

// Not found
fixtures.generic.notFoundError('User', '123');

// Forbidden
fixtures.generic.forbiddenError();

// Server error
fixtures.generic.serverError();

// Rate limit
fixtures.generic.rateLimitError(60);
```

### Creating Custom Fixtures

```typescript
import { createUser, createProduct, jsonApiResponse } from '@23blocks/testing';

// Create user
const user = createUser({ email: 'test@example.com' });

// Create product
const product = createProduct({ name: 'Widget', price: 999 });

// Wrap in JSON:API format
const response = jsonApiResponse('user', user, user.id);
```

## Assertions

### Basic Assertions

```typescript
import {
  assertRequestMade,
  assertRequestNotMade,
  assertRequestBody,
  assertNoRequests,
} from '@23blocks/testing';

// Assert request was made
assertRequestMade(mock, 'POST', '/auth/sign_in');
assertRequestMade(mock, 'POST', '/auth/sign_in', { times: 2 });

// Assert request was NOT made
assertRequestNotMade(mock, 'DELETE', '/users/123');

// Assert request body
assertRequestBody(mock, 'POST', '/users', {
  email: 'test@example.com',
  name: 'Test User',
});

// Assert no requests were made
assertNoRequests(mock);
```

### Advanced Assertions

```typescript
import {
  assertRequestBodyContains,
  assertRequestParams,
  assertRequestCount,
  assertRequestOrder,
  getRequestsMatching,
  waitForRequests,
} from '@23blocks/testing';

// Assert body contains specific fields
assertRequestBodyContains(mock, 'POST', '/users', {
  email: 'test@example.com',
});

// Assert query params
assertRequestParams(mock, 'GET', '/products', {
  limit: 20,
  status: 'active',
});

// Assert total request count
assertRequestCount(mock, 5);

// Assert request order
assertRequestOrder(mock, [
  { method: 'POST', path: '/auth/sign_in' },
  { method: 'GET', path: '/users/me' },
  { method: 'GET', path: '/products' },
]);

// Get matching requests
const authRequests = getRequestsMatching(mock, (r) => r.path.startsWith('/auth'));

// Wait for async requests
await waitForRequests(mock, 3, 5000);  // Wait for 3 requests, 5s timeout
```

### Jest/Vitest Custom Matchers

```typescript
import { mockTransportMatchers } from '@23blocks/testing';

// Extend expect
expect.extend(mockTransportMatchers);

// Use custom matchers
expect(mock).toHaveBeenCalledWith('POST', '/auth/sign_in');
expect(mock).toHaveBeenCalledWith('POST', '/auth/sign_in', { email: 'test@example.com' });
expect(mock).toHaveRequestCount(3);
```

## Complete Test Example

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { createMockTransport, fixtures, assertRequestBody } from '@23blocks/testing';
import { createAuthenticationBlock } from '@23blocks/block-authentication';

describe('AuthenticationService', () => {
  let mock: MockTransport;
  let auth: ReturnType<typeof createAuthenticationBlock>;

  beforeEach(() => {
    mock = createMockTransport();
    auth = createAuthenticationBlock(mock, { apiKey: 'test-key' });
  });

  it('should sign in successfully', async () => {
    mock.onPost('/auth/sign_in').reply(200, fixtures.auth.signInResponse({
      email: 'john@example.com',
      name: 'John Doe',
    }));

    const result = await auth.auth.signIn({
      email: 'john@example.com',
      password: 'password123',
    });

    expect(result.user.email).toBe('john@example.com');
    expect(mock.history.post).toHaveLength(1);
    assertRequestBody(mock, 'POST', '/auth/sign_in', {
      email: 'john@example.com',
      password: 'password123',
    });
  });

  it('should handle invalid credentials', async () => {
    mock.onPost('/auth/sign_in').reply(401, fixtures.auth.invalidCredentialsError());

    await expect(
      auth.auth.signIn({ email: 'wrong@example.com', password: 'wrong' })
    ).rejects.toThrow('Invalid email or password');
  });

  it('should get current user', async () => {
    mock.onGet('/users/me').reply(200, fixtures.auth.currentUserResponse({
      name: 'Jane Doe',
    }));

    const user = await auth.users.getCurrentUser();

    expect(user.name).toBe('Jane Doe');
  });
});
```

## React Testing Example

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMockTransport, fixtures } from '@23blocks/testing';
import { Provider } from '@23blocks/react';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('should submit login form', async () => {
    const mock = createMockTransport();
    mock.onPost('/auth/sign_in').reply(200, fixtures.auth.signInResponse());

    render(
      <Provider transport={mock} authentication={{ apiKey: 'test' }}>
        <LoginForm />
      </Provider>
    );

    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password');
    await userEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
    });
  });
});
```

## Angular Testing Example

```typescript
import { TestBed } from '@angular/core/testing';
import { createMockTransport, fixtures } from '@23blocks/testing';
import { AuthenticationService, provide23Blocks } from '@23blocks/angular';

describe('AuthenticationService', () => {
  let mock: MockTransport;
  let auth: AuthenticationService;

  beforeEach(() => {
    mock = createMockTransport();

    TestBed.configureTestingModule({
      providers: [
        provide23Blocks({
          transport: mock,
          authentication: { apiKey: 'test' },
        }),
      ],
    });

    auth = TestBed.inject(AuthenticationService);
  });

  it('should sign in', (done) => {
    mock.onPost('/auth/sign_in').reply(200, fixtures.auth.signInResponse());

    auth.signIn({ email: 'test@example.com', password: 'password' }).subscribe({
      next: (result) => {
        expect(result.user.email).toBeDefined();
        expect(mock.history.post).toHaveLength(1);
        done();
      },
    });
  });
});
```

## API Reference

### MockTransport

| Method | Description |
|--------|-------------|
| `onGet(path)` | Register GET handler |
| `onPost(path)` | Register POST handler |
| `onPut(path)` | Register PUT handler |
| `onPatch(path)` | Register PATCH handler |
| `onDelete(path)` | Register DELETE handler |
| `onAny(path)` | Register handler for any method |
| `reset()` | Clear all handlers |
| `resetHistory()` | Clear request history |
| `resetAll()` | Clear handlers and history |
| `wasCalled(method, path)` | Check if path was called |
| `getCallCount(method, path)` | Get number of calls |
| `getLastRequest()` | Get last recorded request |
| `getLastRequestFor(method)` | Get last request for method |

### RequestMatcher

| Method | Description |
|--------|-------------|
| `reply(status, data, options?)` | Set response |
| `replyWithError(code, message, status?)` | Set error response |
| `replyWith(handler)` | Set dynamic response handler |
| `once()` | Only respond once |
| `twice()` | Only respond twice |
| `times(n)` | Only respond n times |

### Fixtures

| Export | Description |
|--------|-------------|
| `fixtures.auth` | Authentication fixtures |
| `fixtures.products` | Product fixtures |
| `fixtures.search` | Search fixtures |
| `fixtures.generic` | Generic response fixtures |
| `createUser()` | Create user fixture |
| `createProduct()` | Create product fixture |
| `jsonApiResponse()` | Wrap in JSON:API format |
| `jsonApiError()` | Create JSON:API error |

## Related Packages

- [`@23blocks/contracts`](https://www.npmjs.com/package/@23blocks/contracts) - Core types
- [`@23blocks/sdk`](https://www.npmjs.com/package/@23blocks/sdk) - Full SDK
- [`@23blocks/react`](https://www.npmjs.com/package/@23blocks/react) - React bindings
- [`@23blocks/angular`](https://www.npmjs.com/package/@23blocks/angular) - Angular bindings

## License

MIT - Copyright (c) 2024 23blocks
