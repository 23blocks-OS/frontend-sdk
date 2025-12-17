# @23blocks/jsonapi-codec

JSON:API v1.0 encoder/decoder for the 23blocks SDK.

[![npm version](https://img.shields.io/npm/v/@23blocks/jsonapi-codec.svg)](https://www.npmjs.com/package/@23blocks/jsonapi-codec)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @23blocks/jsonapi-codec
```

## Overview

This package provides utilities for encoding and decoding [JSON:API v1.0](https://jsonapi.org/) documents. It handles:

- **Type definitions** - Complete JSON:API type system
- **Decoding** - Parse single resources, collections, and paginated results
- **Relationship resolution** - Resolve included relationships
- **Error handling** - Convert JSON:API errors to SDK errors

## Usage

### Decoding Resources

```typescript
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type { JsonApiDocument } from '@23blocks/jsonapi-codec';

// Define a mapper for your resource type
const userMapper = (resource, included) => ({
  id: resource.id,
  email: resource.attributes?.email,
  firstName: resource.attributes?.first_name,
  lastName: resource.attributes?.last_name,
});

// Decode a single resource
const response: JsonApiDocument = await fetch('/api/users/123').then(r => r.json());
const user = decodeOne(response, userMapper);

// Decode a collection
const listResponse: JsonApiDocument = await fetch('/api/users').then(r => r.json());
const users = decodeMany(listResponse, userMapper);

// Decode paginated results
const pageResult = decodePageResult(listResponse, userMapper);
console.log(pageResult.data);       // User[]
console.log(pageResult.meta.total); // Total count
```

### Working with Relationships

```typescript
import {
  buildIncludedMap,
  resolveRelationship,
  resolveRelationshipMany,
} from '@23blocks/jsonapi-codec';

const response: JsonApiDocument = await fetch('/api/users/123?include=roles,company').then(r => r.json());
const included = buildIncludedMap(response.included || []);

// Resolve single relationship
const company = resolveRelationship(
  resource.relationships?.company,
  included,
  companyMapper
);

// Resolve many relationships
const roles = resolveRelationshipMany(
  resource.relationships?.roles,
  included,
  roleMapper
);
```

### Error Handling

```typescript
import {
  throwIfError,
  jsonApiErrorsToBlockError,
  blockErrorFromJsonApi,
} from '@23blocks/jsonapi-codec';

// Automatically throw if response contains errors
const response = await fetch('/api/users/123').then(r => r.json());
throwIfError(response); // Throws BlockErrorException if errors present

// Convert JSON:API errors to BlockError
try {
  const data = await apiCall();
} catch (err) {
  const blockError = blockErrorFromJsonApi(err);
  console.log(blockError.code, blockError.message);
}
```

### Type Guards

```typescript
import {
  isSingleResourceDocument,
  isCollectionDocument,
  isErrorDocument,
} from '@23blocks/jsonapi-codec';

const response = await fetch('/api/resource').then(r => r.json());

if (isErrorDocument(response)) {
  // Handle errors
} else if (isSingleResourceDocument(response)) {
  // Handle single resource
} else if (isCollectionDocument(response)) {
  // Handle collection
}
```

### Creating Custom Mappers

```typescript
import type { ResourceMapper, IncludedMap } from '@23blocks/jsonapi-codec';
import type { JsonApiResource } from '@23blocks/jsonapi-codec';

interface Product {
  id: string;
  name: string;
  price: number;
  category?: Category;
}

const productMapper: ResourceMapper<Product> = (
  resource: JsonApiResource,
  included: IncludedMap
): Product => ({
  id: resource.id,
  name: resource.attributes?.name ?? '',
  price: resource.attributes?.price ?? 0,
  category: resolveRelationship(
    resource.relationships?.category,
    included,
    categoryMapper
  ),
});
```

## API Reference

### Type Definitions

| Export | Type | Description |
|--------|------|-------------|
| `JsonApiDocument` | interface | Root JSON:API document |
| `JsonApiResource` | interface | Resource object |
| `JsonApiRelationship` | interface | Relationship object |
| `JsonApiResourceIdentifier` | interface | Resource identifier (type + id) |
| `JsonApiLinks` | interface | Links object |
| `JsonApiLink` | type | Link (string or object) |
| `JsonApiError` | interface | Error object |
| `JsonApiMeta` | interface | Meta object |

### Type Guards

| Export | Description |
|--------|-------------|
| `isSingleResourceDocument(doc)` | Check if document has single resource |
| `isCollectionDocument(doc)` | Check if document has resource array |
| `isErrorDocument(doc)` | Check if document has errors |

### Decoding Functions

| Export | Description |
|--------|-------------|
| `decodeOne(doc, mapper)` | Decode single resource (throws if not found) |
| `decodeOneOrNull(doc, mapper)` | Decode single resource (returns null if not found) |
| `decodeMany(doc, mapper)` | Decode resource collection |
| `decodePageResult(doc, mapper)` | Decode paginated collection |
| `extractPageMeta(doc)` | Extract pagination metadata |
| `decodeWith(mapper)` | Create decoder function with mapper |

### Relationship Resolution

| Export | Description |
|--------|-------------|
| `buildIncludedMap(included)` | Build lookup map from included resources |
| `getIncluded(map, type, id)` | Get included resource by type and id |
| `resolveRelationship(rel, map, mapper)` | Resolve single relationship |
| `resolveRelationshipMany(rel, map, mapper)` | Resolve array relationship |
| `resourceKey(type, id)` | Create lookup key |

### Error Handling

| Export | Description |
|--------|-------------|
| `jsonApiErrorToBlockError(error)` | Convert single JSON:API error |
| `jsonApiErrorsToBlockError(errors)` | Convert multiple JSON:API errors |
| `blockErrorFromJsonApi(doc)` | Extract error from document |
| `throwIfError(doc)` | Throw if document contains errors |
| `assertNotError(doc)` | Assert document is not an error |

### Types

| Export | Description |
|--------|-------------|
| `ResourceMapper<T>` | Function type for mapping resources |
| `IncludedMap` | Map type for included resources |

## TypeScript Support

This package is written in TypeScript and provides full type definitions:

```typescript
import type {
  JsonApiDocument,
  JsonApiResource,
  ResourceMapper,
  IncludedMap,
} from '@23blocks/jsonapi-codec';
```

## Related Packages

- [`@23blocks/contracts`](https://www.npmjs.com/package/@23blocks/contracts) - Core types and interfaces
- [`@23blocks/transport-http`](https://www.npmjs.com/package/@23blocks/transport-http) - HTTP transport
- [`@23blocks/sdk`](https://www.npmjs.com/package/@23blocks/sdk) - Full SDK package

## License

MIT - Copyright (c) 2024 23blocks
