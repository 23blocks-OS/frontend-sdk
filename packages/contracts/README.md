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
import type { Transport, RequestConfig, RequestOptions } from '@23blocks/contracts';

// Implement custom transport
const myTransport: Transport = {
  request: async <T>(config: RequestConfig, options?: RequestOptions): Promise<T> => {
    // Custom implementation
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
  BlockConfig,
  PageResult,
  BlockError,
} from '@23blocks/contracts';
```

## Related Packages

- [`@23blocks/transport-http`](https://www.npmjs.com/package/@23blocks/transport-http) - HTTP transport implementation
- [`@23blocks/jsonapi-codec`](https://www.npmjs.com/package/@23blocks/jsonapi-codec) - JSON:API encoder/decoder
- [`@23blocks/sdk`](https://www.npmjs.com/package/@23blocks/sdk) - Full SDK package

## License

MIT - Copyright (c) 2024 23blocks
