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
    'X-Api-Key': 'your-api-key',
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

### With Timeout

```typescript
const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  timeout: 60000, // 60 seconds (default is 30 seconds)
});
```

### With Credentials (Cookies)

```typescript
const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  credentials: 'include', // Include cookies in cross-origin requests
});
```

### Per-Request Options

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
| `headers` | `Record<string, string>` \| `() => Record<string, string>` \| `() => Promise<Record<string, string>>` | `{}` | Static or dynamic headers |
| `timeout` | `number` | `30000` | Default timeout in milliseconds |
| `credentials` | `RequestCredentials` | `undefined` | Fetch credentials option |

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

The transport automatically converts HTTP errors to `BlockErrorException`:

```typescript
import { BlockErrorException, ErrorCodes, isBlockErrorException } from '@23blocks/contracts';

try {
  await transport.get('/api/users/123');
} catch (error) {
  if (isBlockErrorException(error)) {
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
    console.log(error.meta?.errors);    // Full errors array
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
