# SDK Developer Experience Improvements

## Current State Assessment

### What We Have
| Feature | Status |
|---------|--------|
| Type-safe interfaces | ✅ Solid TypeScript |
| Error handling | ✅ `BlockErrorException` with codes |
| Framework bindings | ✅ Angular (RxJS) + React (hooks) |
| Pagination | ✅ JSON:API compliant |
| Timeout handling | ✅ Per-request + global |
| Abort signals | ✅ Supported |

### Implemented Features

| Feature | Status | Description |
|---------|--------|-------------|
| **Logging/Debug mode** | ✅ Done | `debug` flag enables console logging |
| **Request tracing** | ✅ Done | Auto-generated `X-Request-ID` header |
| **Retries** | ✅ Done | Exponential backoff with jitter |
| **Interceptors** | ✅ Done | `onRequest`, `onResponse`, `onError` hooks |
| **Request ID in errors** | ✅ Done | `requestId` and `duration` in errors |
| **Response time tracking** | ✅ Done | `duration` field in all errors |
| **Mock utilities** | ✅ Done | `@23blocks/testing` package |

---

## Implementation Plan

### Phase 1: Debug Logging + Request Tracing (High Priority)

#### 1.1 Logger Interface
```typescript
export interface Logger {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
}

export const consoleLogger: Logger = {
  debug: (msg, meta) => console.debug(`[23blocks] ${msg}`, meta || ''),
  info: (msg, meta) => console.info(`[23blocks] ${msg}`, meta || ''),
  warn: (msg, meta) => console.warn(`[23blocks] ${msg}`, meta || ''),
  error: (msg, meta) => console.error(`[23blocks] ${msg}`, meta || ''),
};

export const noopLogger: Logger = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
};
```

#### 1.2 Transport Config Updates
```typescript
export interface TransportConfig {
  baseUrl: string;
  headers?: Record<string, string> | HeadersProvider;
  timeout?: number;
  retry?: RetryConfig;
  credentials?: 'include' | 'same-origin' | 'omit';

  // NEW
  debug?: boolean;
  logger?: Logger;
  generateRequestId?: () => string;
}
```

#### 1.3 Request ID in Errors
```typescript
export interface BlockError {
  code: string;
  message: string;
  status: number;
  source?: string;
  meta?: Record<string, unknown>;

  // NEW
  requestId?: string;
  duration?: number;
}
```

### Phase 2: Interceptors (Medium Priority)

```typescript
export interface Interceptors {
  onRequest?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
  onResponse?: <T>(response: T, config: RequestConfig) => T | Promise<T>;
  onError?: (error: BlockErrorException, config: RequestConfig) => never | Promise<never>;
}

export interface TransportConfig {
  // ... existing
  interceptors?: Interceptors;
}
```

### Phase 3: Retry Implementation (Medium Priority)

Implement exponential backoff with jitter:
```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig,
  logger: Logger
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (!shouldRetry(error, config)) {
        throw error;
      }

      const delay = calculateDelay(attempt, config);
      logger.warn(`Request failed, retrying in ${delay}ms`, { attempt });
      await sleep(delay);
    }
  }

  throw lastError;
}
```

### Phase 4: Testing Utilities (Medium Priority)

Create `@23blocks/testing` package:
```typescript
import { createMockTransport } from '@23blocks/testing';

const mock = createMockTransport();
mock.onPost('/auth/sign_in').reply(200, { data: {...} });
mock.onGet('/users').reply(404, { errors: [...] });

const auth = createAuthenticationBlock(mock, config);
```

---

## Console Output Examples

### Debug Mode Enabled
```
[23blocks] POST /auth/sign_in [req_abc123]
[23blocks] → Headers: { x-api-key: "***", content-type: "application/json" }
[23blocks] → Body: { email: "user@example.com", password: "***" }
[23blocks] ← 200 OK (145ms) [req_abc123]
[23blocks] ← Body: { data: { type: "user", id: "123", ... } }
```

### Error with Request ID
```
[23blocks] POST /auth/sign_in [req_xyz789]
[23blocks] → Body: { email: "user@example.com", password: "***" }
[23blocks] ✗ 401 Unauthorized (89ms) [req_xyz789]
[23blocks] ✗ Error: Invalid credentials

BlockErrorException {
  code: 'invalid_credentials',
  message: 'Invalid credentials',
  status: 401,
  requestId: 'req_xyz789',  // <-- For support tickets
  duration: 89,              // <-- Performance tracking
}
```

---

## Migration Guide

### Before (v6.x)
```typescript
const transport = createHttpTransport({
  baseUrl: 'https://api.23blocks.com',
  headers: { 'x-api-key': 'xxx' },
});
```

### After (v7.x)
```typescript
const transport = createHttpTransport({
  baseUrl: 'https://api.23blocks.com',
  headers: { 'x-api-key': 'xxx' },

  // Optional new features
  debug: process.env.NODE_ENV === 'development',
  logger: customLogger, // or use default consoleLogger
  retry: {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
    retryableStatuses: [429, 502, 503, 504],
  },
  interceptors: {
    onError: (error) => {
      Sentry.captureException(error);
      throw error;
    },
  },
});
```

---

## Success Metrics

- Reduced support tickets due to better error context
- Faster debugging with request IDs
- Easier performance profiling with duration tracking
- Better testability with mock utilities
