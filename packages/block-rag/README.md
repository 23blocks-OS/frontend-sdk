# @23blocks/block-rag

TypeScript SDK for the 23blocks RAG (Retrieval-Augmented Generation) API. Provides vector-based document processing, semantic search, image search, and product identification.

## Installation

```bash
npm install @23blocks/block-rag
```

## Quick Start

```typescript
import { createRagBlock } from '@23blocks/block-rag';
import { createHttpTransport } from '@23blocks/transport-http';

const transport = createHttpTransport({
  baseUrl: 'https://rag.your-domain.com',
  headers: () => ({
    Authorization: `Bearer ${getToken()}`,
    'x-api-key': 'your-api-key',
  }),
});

const rag = createRagBlock(transport, { apiKey: 'your-api-key' });
```

## Services

### Scope — Document Processing & Querying

Process files and query documents within scoped contexts (entities, accounts, contacts, users, storage, products).

```typescript
// Process a file for vector indexing
const job = await rag.scope.process('entities', entityId, fileId, 'ocr_text');

// Query documents with semantic search
const { results, meta } = await rag.scope.query('entities', entityId, {
  query: 'What is the quarterly revenue?',
  minScore: 0.7,
  page: 1,
  records: 10,
});

// Get file metadata
const metadata = await rag.scope.getFileMetadata('entities', entityId, fileId);
```

**Processing modes:** `ocr_text` | `face_similarity` | `visual_general`

**Scopes:** `entities` | `accounts` | `contacts` | `users` | `storage` | `products`

### Files — Generic File Processing

```typescript
const job = await rag.files.process('file-unique-id', {
  fileUrl: 'https://storage.example.com/doc.pdf',
  fileType: 'pdf',
});
```

### Jobs — Processing Status

Track async document processing jobs with detailed progress.

```typescript
const status = await rag.jobs.get(job.jobId);
// status.progressPercentage, status.totalChunks, status.processingTimeSeconds, etc.
```

### Images — Upload & Search

Upload images for vector indexing and search by text, image URL, or base64.

```typescript
// Upload an image
const result = await rag.images.upload({
  file: imageBlob,
  entityType: 'product',
  entityId: 'prod-123',
  checkDuplicates: true,
});

// Search images (text, image URL, or base64)
const results = await rag.images.search({
  query: {
    text: 'red sneakers',
    limit: 10,
    similarityThreshold: 0.8,
  },
});
```

### Products — Identification & Search

Identify products from images and search the product catalog.

```typescript
// Identify a product from a photo
const match = await rag.products.identify({
  file: photoBlob,
  confidenceThreshold: 0.85,
  categoryHint: 'electronics',
});
// match.identified, match.confidence, match.productMetadata

// Search products
const results = await rag.products.search({
  query: { text: 'wireless headphones', limit: 5 },
});
```

## Framework Integration

### React

```tsx
import { Blocks23Provider, useRagBlock } from '@23blocks/react';

function App() {
  return (
    <Blocks23Provider
      apiKey="your-key"
      rag={{ apiKey: 'your-key', baseUrl: 'https://rag.example.com' }}
    >
      <SearchComponent />
    </Blocks23Provider>
  );
}

function SearchComponent() {
  const rag = useRagBlock();
  // rag.scope.query(...), rag.images.search(...), etc.
}
```

### Angular

```typescript
import { provideBlocks23 } from '@23blocks/angular';

// app.config.ts
export const appConfig = {
  providers: [
    provideBlocks23({
      apiKey: 'your-key',
      urls: { rag: 'https://rag.example.com' },
    }),
  ],
};

// component.ts
import { RagService } from '@23blocks/angular';

@Component({ ... })
export class SearchComponent {
  private rag = inject(RagService);

  async search(query: string) {
    const results = await this.rag.scope.query('entities', entityId, { query });
  }
}
```

### Vanilla (SDK)

```typescript
import { rag } from '@23blocks/sdk';
// rag.createRagBlock, rag.RagBlock, rag.RagBlockConfig, etc.
```

## API Reference

| Service | Method | Endpoint |
|---------|--------|----------|
| `scope` | `process(scope, scopeId, fileId, mode?)` | `POST /{scope}/{scopeId}/files/{fileId}/process` |
| `scope` | `getFileMetadata(scope, scopeId, fileId)` | `GET /{scope}/{scopeId}/files/{fileId}` |
| `scope` | `query(scope, scopeId, data)` | `POST /{scope}/{scopeId}/query` |
| `files` | `process(fileUniqueId, data?)` | `POST /files/{fileUniqueId}/process` |
| `jobs` | `get(jobId)` | `GET /jobs/{jobId}` |
| `images` | `upload(data)` | `POST /images/upload` |
| `images` | `search(data)` | `POST /images/search` |
| `products` | `identify(data)` | `POST /products/identify` |
| `products` | `search(data)` | `POST /products/search` |
| — | `health()` | `GET /health` |

## Types

All types are exported from the package:

```typescript
import type {
  RagBlock, RagBlockConfig,
  RagScope, ProcessingMode,
  QueryRequest, QueryResponse, QueryResultChunk, QueryMeta,
  ProcessResponse, FileMetadata,
  JobStatus,
  ImageUploadRequest, ImageUploadResponse, ImageSearchRequest,
  UnifiedSearchQuery,
  ProductIdentifyRequest, ProductIdentifyResponse, ProductSearchRequest,
} from '@23blocks/block-rag';
```

## License

MIT
