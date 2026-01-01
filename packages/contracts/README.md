# @23blocks/contracts

Core type definitions and interfaces for the 23blocks SDK.

[![npm version](https://img.shields.io/npm/v/@23blocks/contracts.svg)](https://www.npmjs.com/package/@23blocks/contracts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @23blocks/contracts
```

## Overview

This package provides the foundational types and interfaces used throughout the 23blocks SDK ecosystem. It includes:

- **Transport interfaces** - Abstract communication layer
- **Error handling** - Standardized error types and codes
- **Pagination** - Common pagination types and utilities
- **Identity** - Base entity interfaces
- **Block configuration** - Standard block configuration types
- **Logging** - Logger interface and utilities for debugging

## Usage

### Error Handling

```typescript
import {
  BlockErrorException,
  isBlockErrorException,
  ErrorCodes,
  type BlockError,
} from '@23blocks/contracts';

try {
  await someOperation();
} catch (error) {
  if (isBlockErrorException(error)) {
    console.log('Error code:', error.code);
    console.log('Message:', error.message);
    console.log('Request ID:', error.requestId);  // For support tickets
    console.log('Duration:', error.duration);      // Request timing

    switch (error.code) {
      case ErrorCodes.INVALID_CREDENTIALS:
        // Handle invalid credentials
        break;
      case ErrorCodes.NOT_FOUND:
        // Handle not found
        break;
      case ErrorCodes.NETWORK_ERROR:
        // Handle network error
        break;
    }
  }
}
```

### Logging

The package provides a standard `Logger` interface and implementations:

```typescript
import {
  type Logger,
  consoleLogger,
  noopLogger,
  generateRequestId,
  maskSensitiveData,
} from '@23blocks/contracts';

// Use the built-in console logger
consoleLogger.info('User signed in', { userId: '123' });
// Output: [23blocks] User signed in { userId: '123' }

// Use noopLogger in production to silence logs
const logger = process.env.NODE_ENV === 'production' ? noopLogger : consoleLogger;

// Generate unique request IDs
const requestId = generateRequestId();
// Output: "req_m5abc_xyz123"

// Mask sensitive data before logging
const safeData = maskSensitiveData({
  email: 'user@example.com',
  password: 'secret123',
  apiKey: 'sk-xxx',
});
// Output: { email: 'user@example.com', password: '***', apiKey: '***' }
```

### Custom Logger

Implement the `Logger` interface for custom logging solutions:

```typescript
import type { Logger } from '@23blocks/contracts';

const customLogger: Logger = {
  debug: (message, meta) => winston.debug(message, meta),
  info: (message, meta) => winston.info(message, meta),
  warn: (message, meta) => winston.warn(message, meta),
  error: (message, meta) => winston.error(message, meta),
};
```

### Pagination

```typescript
import type { PageResult, ListParams, PageMeta } from '@23blocks/contracts';
import { emptyPageResult } from '@23blocks/contracts';

// Define list parameters
const params: ListParams = {
  limit: 20,
  offset: 0,
  sort: { field: 'createdAt', direction: 'desc' },
};

// Handle paginated results
function handleResults<T>(result: PageResult<T>) {
  console.log('Items:', result.data);
  console.log('Total:', result.meta.total);
  console.log('Has more:', result.meta.hasMore);
}

// Create empty result
const empty = emptyPageResult<MyType>();
```

### Transport Interface

```typescript
import type { Transport, TransportConfig, Interceptors } from '@23blocks/contracts';

// Configure transport with new options
const config: TransportConfig = {
  baseUrl: 'https://api.example.com',
  timeout: 30000,
  debug: true,  // Enable debug logging
  retry: {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
  },
  interceptors: {
    onError: (error, context) => {
      console.error(`Request ${context.requestId} failed`);
      throw error;
    },
  },
};
```

### Block Configuration

```typescript
import type { BlockConfig } from '@23blocks/contracts';

const config: BlockConfig = {
  apiKey: 'your-api-key',
  tenantId: 'optional-tenant-id',
};
```

## API Reference

### Error Types

| Export | Type | Description |
|--------|------|-------------|
| `BlockError` | interface | Error object structure |
| `BlockErrorException` | class | Throwable error with code and message |
| `isBlockError` | function | Type guard for BlockError |
| `isBlockErrorException` | function | Type guard for BlockErrorException |
| `ErrorCodes` | const | Standard error code constants |
| `ErrorCode` | type | Union type of all error codes |

#### BlockError Properties

| Property | Type | Description |
|----------|------|-------------|
| `code` | `string` | Error code identifier |
| `message` | `string` | Human-readable error message |
| `status` | `number` | HTTP status code |
| `source` | `string?` | Source pointer (e.g., '/data/attributes/email') |
| `meta` | `Record<string, unknown>?` | Additional metadata |
| `requestId` | `string?` | Unique request ID for tracing |
| `duration` | `number?` | Request duration in milliseconds |

### Logger Types

| Export | Type | Description |
|--------|------|-------------|
| `Logger` | interface | Logger interface with debug/info/warn/error |
| `consoleLogger` | const | Console logger with [23blocks] prefix |
| `noopLogger` | const | Silent no-op logger |
| `generateRequestId` | function | Generate unique request IDs |
| `maskSensitiveData` | function | Mask sensitive values in objects |

### Pagination Types

| Export | Type | Description |
|--------|------|-------------|
| `PageMeta` | interface | Pagination metadata (total, hasMore, etc.) |
| `PageResult<T>` | interface | Paginated response with data and meta |
| `PaginationParams` | interface | Basic pagination parameters |
| `ListParams` | interface | Extended params with sorting |
| `SortParam` | interface | Sort field and direction |
| `SortDirection` | type | 'asc' \| 'desc' |
| `emptyPageResult` | function | Creates empty PageResult |

### Identity Types

| Export | Type | Description |
|--------|------|-------------|
| `IdentityCore` | interface | Base entity with id |
| `EntityStatus` | type | 'active' \| 'inactive' \| 'pending' |
| `Timestamps` | interface | createdAt, updatedAt fields |
| `SoftDeletable` | interface | deletedAt field |
| `Auditable` | interface | createdBy, updatedBy fields |

### Transport Types

| Export | Type | Description |
|--------|------|-------------|
| `Transport` | interface | Abstract transport interface |
| `RequestConfig` | interface | Request configuration |
| `RequestOptions` | interface | Additional request options |
| `HeadersProvider` | type | Function returning headers |
| `TransportConfig` | interface | Transport configuration |
| `RetryConfig` | interface | Retry configuration |
| `Interceptors` | interface | Request/response interceptors |

### Block Types

| Export | Type | Description |
|--------|------|-------------|
| `BlockConfig` | interface | Standard block configuration |
| `BlockFactory` | type | Factory function type |
| `BlockMetadata` | interface | Block metadata |
| `BlockRegistration` | interface | Block registration info |

## TypeScript Support

This package is written in TypeScript and provides full type definitions. All types are exported and can be used directly:

```typescript
import type {
  Transport,
  TransportConfig,
  BlockConfig,
  PageResult,
  BlockError,
  Logger,
  Interceptors,
} from '@23blocks/contracts';
```

## Related Packages

- [`@23blocks/transport-http`](https://www.npmjs.com/package/@23blocks/transport-http) - HTTP transport implementation
- [`@23blocks/jsonapi-codec`](https://www.npmjs.com/package/@23blocks/jsonapi-codec) - JSON:API encoder/decoder
- [`@23blocks/sdk`](https://www.npmjs.com/package/@23blocks/sdk) - Full SDK package

## License

MIT - Copyright (c) 2024 23blocks
