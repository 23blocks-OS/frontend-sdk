// Error handling
export {
  type BlockError,
  BlockErrorException,
  isBlockError,
  isBlockErrorException,
  ErrorCodes,
  type ErrorCode,
} from './lib/errors.js';

// Pagination
export {
  type PageMeta,
  type PageResult,
  type PaginationParams,
  type SortDirection,
  type SortParam,
  type ListParams,
  emptyPageResult,
} from './lib/pagination.js';

// Identity
export {
  type IdentityCore,
  type EntityStatus,
  type Timestamps,
  type SoftDeletable,
  type Auditable,
} from './lib/identity.js';

// Transport
export {
  type RequestConfig,
  type RequestOptions,
  type Transport,
  type HeadersProvider,
  type TransportConfig,
  type RetryConfig,
  type Interceptors,
} from './lib/transport.js';

// Block
export {
  type BlockConfig,
  type BlockFactory,
  type BlockMetadata,
  type BlockRegistration,
} from './lib/block.js';

// Logger
export {
  type Logger,
  consoleLogger,
  noopLogger,
  generateRequestId,
  maskSensitiveData,
} from './lib/logger.js';
