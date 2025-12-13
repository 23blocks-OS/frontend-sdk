// JSON:API Types
export {
  type JsonApiResource,
  type JsonApiRelationship,
  type JsonApiResourceIdentifier,
  type JsonApiLinks,
  type JsonApiLink,
  type JsonApiError,
  type JsonApiDocument,
  type JsonApiMeta,
  isSingleResourceDocument,
  isCollectionDocument,
  isErrorDocument,
} from './lib/types.js';

// Resource Mapper
export {
  type IncludedMap,
  type ResourceMapper,
  resourceKey,
  buildIncludedMap,
  getIncluded,
  resolveRelationship,
  resolveRelationshipMany,
} from './lib/mapper.js';

// Decoding
export {
  decodeOne,
  decodeOneOrNull,
  decodeMany,
  extractPageMeta,
  decodePageResult,
  decodeWith,
} from './lib/decode.js';

// Error Handling
export {
  jsonApiErrorToBlockError,
  jsonApiErrorsToBlockError,
  blockErrorFromJsonApi,
  throwIfError,
  assertNotError,
} from './lib/errors.js';
