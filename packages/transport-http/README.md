# @23blocks/transport-http

HTTP transport implementation for the 23blocks SDK.

[![npm version](https://img.shields.io/npm/v/@23blocks/transport-http.svg)](https://www.npmjs.com/package/@23blocks/transport-http)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @23blocks/transport-http
```

## Overview

This package provides the HTTP transport layer for the 23blocks SDK. It handles:

- **HTTP requests** - GET, POST, PUT, PATCH, DELETE operations
- **Error handling** - Automatic conversion to BlockErrorException
- **Timeouts** - Configurable request timeouts with AbortController
- **Dynamic headers** - Static headers or async header providers
- **Query parameters** - Automatic serialization including arrays
- **Debug logging** - Built-in request/response logging for development
- **Request tracing** - Automatic request IDs for debugging and support
- **Automatic retries** - Exponential backoff with jitter for transient failures
- **Interceptors** - Hook into request/response lifecycle

## Usage

### Basic Configuration

```typescript
import { createHttpTransport } from '@23blocks/transport-http';

const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
});

// Make requests
const data = await transport.get('/api/users');
const user = await transport.post('/api/users', { name: 'John' });
```

### With Authentication Headers

```typescript
const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  headers: {
    'x-api-key': 'your-api-key',
  },
});
```

### With Dynamic Headers

```typescript
const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  headers: () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});
```

### With Async Headers

```typescript
const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  headers: async () => {
    const token = await getTokenFromSecureStorage();
    return { Authorization: `Bearer ${token}` };
  },
});
```

## Debug Logging

Enable debug mode to log all requests and responses to the console. This is invaluable for development and troubleshooting.

```typescript
const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  debug: true, // Enable debug logging
});
```

### Console Output

When debug mode is enabled, you'll see output like this:

```
[23blocks] POST /auth/sign_in [req_m5abc_xyz123]
[23blocks] → Headers: { "content-type": "application/json", "x-api-key": "***" }
[23blocks] → Body: { "email": "user@example.com", "password": "***" }
[23blocks] ← 200 OK (145ms) [req_m5abc_xyz123]
[23blocks] ← Body: { "data": { "type": "user", "id": "123", ... } }
```

Sensitive data like passwords, tokens, and API keys are automatically masked in logs.

### Custom Logger

You can provide a custom logger implementation:

```typescript
import { createHttpTransport } from '@23blocks/transport-http';
import type { Logger } from '@23blocks/contracts';

const customLogger: Logger = {
  debug: (msg, meta) => myLoggingService.log('debug', msg, meta),
  info: (msg, meta) => myLoggingService.log('info', msg, meta),
  warn: (msg, meta) => myLoggingService.log('warn', msg, meta),
  error: (msg, meta) => myLoggingService.log('error', msg, meta),
};

const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  logger: customLogger,
  debug: true,
});
```

## Request Tracing

Every request automatically includes a unique `X-Request-ID` header. This ID is:

- Included in all error responses for easy debugging
- Passed to your backend for end-to-end tracing
- Logged in debug mode for correlation

```typescript
try {
  await transport.get('/api/users/123');
} catch (error) {
  if (isBlockErrorException(error)) {
    console.log('Request ID:', error.requestId); // "req_m5abc_xyz123"
    console.log('Duration:', error.duration);     // 145 (ms)

    // Send to support: "Please check request req_m5abc_xyz123"
  }
}
```

### Custom Request ID Generator

```typescript
const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  generateRequestId: () => `myapp-${Date.now()}-${Math.random().toString(36).slice(2)}`,
});
```

## Automatic Retries

Configure automatic retries with exponential backoff for transient failures:

```typescript
const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  retry: {
    maxRetries: 3,                        // Retry up to 3 times
    initialDelay: 1000,                   // Start with 1 second delay
    maxDelay: 10000,                      // Cap at 10 seconds
    backoffMultiplier: 2,                 // Double delay each retry
    retryableStatuses: [429, 502, 503, 504], // Which status codes to retry
  },
});
```

### Retry Behavior

- Retries only trigger for configured status codes (default: 429, 502, 503, 504)
- Uses exponential backoff with jitter to prevent thundering herd
- Network errors are also retried
- Debug mode logs each retry attempt

```
[23blocks] POST /api/data [req_m5abc_xyz123]
[23blocks] ✗ 503 Service Unavailable (89ms) [req_m5abc_xyz123]
[23blocks] Retrying in 1250ms (attempt 1/3) [req_m5abc_xyz123]
[23blocks] ✗ 503 Service Unavailable (92ms) [req_m5abc_xyz123]
[23blocks] Retrying in 2480ms (attempt 2/3) [req_m5abc_xyz123]
[23blocks] ← 200 OK (134ms) [req_m5abc_xyz123]
```

## Interceptors

Hook into the request/response lifecycle for cross-cutting concerns:

```typescript
const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  interceptors: {
    // Called before each request
    onRequest: async ({ method, path, headers, requestId }) => {
      console.log(`Starting ${method} ${path}`);
      // You could add analytics tracking here
    },

    // Called after each successful response
    onResponse: async (response, { method, path, duration, requestId }) => {
      trackMetric('api_latency', duration, { path });
      return response; // Must return response (can transform it)
    },

    // Called when an error occurs
    onError: async (error, { method, path, duration, requestId }) => {
      // Report to error tracking service
      Sentry.captureException(error, {
        extra: { requestId, path, duration },
      });
      throw error; // Must re-throw or handle
    },
  },
});
```

### Common Interceptor Patterns

#### Token Refresh

```typescript
interceptors: {
  onError: async (error, context) => {
    if (error instanceof BlockErrorException && error.code === 'token_expired') {
      await refreshAuthToken();
      // Retry logic would go here
    }
    throw error;
  },
}
```

#### Performance Monitoring

```typescript
interceptors: {
  onResponse: async (response, { path, duration }) => {
    if (duration > 1000) {
      console.warn(`Slow request: ${path} took ${duration}ms`);
    }
    return response;
  },
}
```

## Timeout Configuration

```typescript
const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  timeout: 60000, // 60 seconds (default is 30 seconds)
});
```

## Credentials (Cookies)

```typescript
const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  credentials: 'include', // Include cookies in cross-origin requests
});
```

## Per-Request Options

```typescript
const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
});

// With query parameters
const users = await transport.get('/api/users', {
  params: {
    limit: 20,
    offset: 0,
    status: 'active',
    roles: ['admin', 'user'], // Arrays become ?roles[]=admin&roles[]=user
  },
});

// With custom headers for specific request
const data = await transport.get('/api/sensitive', {
  headers: {
    'X-Custom-Header': 'value',
  },
});

// With custom timeout
const data = await transport.post('/api/long-operation', payload, {
  timeout: 120000, // 2 minutes
});

// With abort signal
const controller = new AbortController();
const data = await transport.get('/api/data', {
  signal: controller.signal,
});

// Cancel the request
controller.abort();
```

## API Reference

### createHttpTransport(config)

Creates a new HTTP transport instance.

```typescript
function createHttpTransport(config: TransportConfig): Transport;
```

### TransportConfig

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `baseUrl` | `string` | required | Base URL for all requests |
| `headers` | `Record<string, string>` \| `HeadersProvider` | `{}` | Static or dynamic headers |
| `timeout` | `number` | `30000` | Default timeout in milliseconds |
| `credentials` | `RequestCredentials` | `undefined` | Fetch credentials option |
| `debug` | `boolean` | `false` | Enable debug logging |
| `logger` | `Logger` | `consoleLogger` | Custom logger implementation |
| `generateRequestId` | `() => string` | built-in | Custom request ID generator |
| `retry` | `RetryConfig` | `undefined` | Retry configuration |
| `interceptors` | `Interceptors` | `undefined` | Request/response interceptors |

### RetryConfig

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `maxRetries` | `number` | required | Maximum number of retry attempts |
| `initialDelay` | `number` | required | Initial delay in milliseconds |
| `maxDelay` | `number` | required | Maximum delay in milliseconds |
| `backoffMultiplier` | `number` | required | Multiplier for exponential backoff |
| `retryableStatuses` | `number[]` | `[429, 502, 503, 504]` | HTTP status codes to retry |

### Interceptors

| Property | Type | Description |
|----------|------|-------------|
| `onRequest` | `(config) => void \| Promise<void>` | Called before each request |
| `onResponse` | `<T>(response, context) => T \| Promise<T>` | Called after successful response |
| `onError` | `(error, context) => never` | Called on error |

### Transport Interface

```typescript
interface Transport {
  get<T>(path: string, options?: RequestOptions): Promise<T>;
  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T>;
  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T>;
  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T>;
  delete<T>(path: string, options?: RequestOptions): Promise<T>;
}
```

### RequestOptions

| Property | Type | Description |
|----------|------|-------------|
| `params` | `Record<string, string \| number \| boolean \| string[]>` | Query parameters |
| `headers` | `Record<string, string>` | Additional headers (merged with config headers) |
| `timeout` | `number` | Override default timeout |
| `signal` | `AbortSignal` | Abort signal for cancellation |

## Error Handling

The transport automatically converts HTTP errors to `BlockErrorException` with request context:

```typescript
import { BlockErrorException, ErrorCodes, isBlockErrorException } from '@23blocks/contracts';

try {
  await transport.get('/api/users/123');
} catch (error) {
  if (isBlockErrorException(error)) {
    // Error details
    console.log('Code:', error.code);           // "not_found"
    console.log('Message:', error.message);     // "User not found"
    console.log('Status:', error.status);       // 404

    // Request context (NEW)
    console.log('Request ID:', error.requestId); // "req_m5abc_xyz123"
    console.log('Duration:', error.duration);    // 145 (ms)

    switch (error.code) {
      case ErrorCodes.UNAUTHORIZED: // 401
        // Redirect to login
        break;
      case ErrorCodes.FORBIDDEN: // 403
        // Show access denied
        break;
      case ErrorCodes.NOT_FOUND: // 404
        // Show not found
        break;
      case ErrorCodes.VALIDATION_ERROR: // 422
        // Show validation errors
        console.log(error.meta?.errors);
        break;
      case ErrorCodes.TIMEOUT:
        // Request timed out
        break;
      case ErrorCodes.NETWORK_ERROR:
        // Network error (offline, DNS, etc.)
        break;
    }
  }
}
```

### JSON:API Error Support

The transport understands JSON:API error format and extracts detailed error information:

```typescript
// Server returns:
// { "errors": [{ "code": "invalid_email", "detail": "Email is invalid", "source": { "pointer": "/data/attributes/email" } }] }

try {
  await transport.post('/api/users', { email: 'invalid' });
} catch (error) {
  if (isBlockErrorException(error)) {
    console.log(error.message);         // "Email is invalid"
    console.log(error.source);          // "/data/attributes/email"
    console.log(error.requestId);       // "req_m5abc_xyz123"
    console.log(error.meta?.errors);    // Full errors array
  }
}
```

## Complete Example

```typescript
import { createHttpTransport } from '@23blocks/transport-http';
import { isBlockErrorException } from '@23blocks/contracts';

// Production-ready configuration
const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',

  // Dynamic auth headers
  headers: async () => {
    const token = await getAuthToken();
    return {
      'Authorization': `Bearer ${token}`,
      'x-api-key': process.env.API_KEY,
    };
  },

  // Debug in development only
  debug: process.env.NODE_ENV === 'development',

  // Retry transient failures
  retry: {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
  },

  // Error tracking
  interceptors: {
    onError: async (error, { requestId, path, duration }) => {
      errorTracker.capture(error, { requestId, path, duration });
      throw error;
    },
  },
});

// Use it
try {
  const user = await transport.post('/auth/sign_in', {
    email: 'user@example.com',
    password: 'password',
  });
  console.log('Signed in:', user);
} catch (error) {
  if (isBlockErrorException(error)) {
    console.error(`Request ${error.requestId} failed: ${error.message}`);
  }
}
```

## TypeScript Support

This package is written in TypeScript and exports all types:

```typescript
import {
  createHttpTransport,
  type Transport,
  type TransportConfig,
  type RequestOptions,
} from '@23blocks/transport-http';
```

## Related Packages

- [`@23blocks/contracts`](https://www.npmjs.com/package/@23blocks/contracts) - Core types and interfaces
- [`@23blocks/jsonapi-codec`](https://www.npmjs.com/package/@23blocks/jsonapi-codec) - JSON:API encoder/decoder
- [`@23blocks/sdk`](https://www.npmjs.com/package/@23blocks/sdk) - Full SDK package

## License

MIT - Copyright (c) 2024 23blocks
