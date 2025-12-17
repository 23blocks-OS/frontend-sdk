# @23blocks/block-search

Search block for the 23blocks SDK - full-text search, suggestions, and favorites.

[![npm version](https://img.shields.io/npm/v/@23blocks/block-search.svg)](https://www.npmjs.com/package/@23blocks/block-search)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @23blocks/block-search @23blocks/transport-http
```

## Overview

This package provides comprehensive search functionality including:

- **Search** - Full-text search with filtering and pagination
- **Suggestions** - Autocomplete and typeahead
- **Search History** - Recent searches and query management
- **Favorites** - Save and manage favorite entities

## Quick Start

```typescript
import { createHttpTransport } from '@23blocks/transport-http';
import { createSearchBlock } from '@23blocks/block-search';

// Create transport
const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  headers: () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});

// Create block
const search = createSearchBlock(transport, {
  apiKey: 'your-api-key',
});

// Execute search
const { results, totalRecords } = await search.search.search({
  query: 'hello world',
  limit: 20,
});

results.forEach((result) => {
  console.log(result.title, result.score);
});
```

## Services

### search - Full-text Search

```typescript
// Basic search
const { results, query, totalRecords, elapsedTime } = await search.search.search({
  query: 'laptop',
  limit: 20,
  offset: 0,
});

// Search with entity type filtering
const { results } = await search.search.search({
  query: 'john',
  entityTypes: ['users', 'contacts'],
  limit: 10,
});

// Search with include/exclude terms
const { results } = await search.search.search({
  query: 'programming',
  include: ['javascript', 'typescript'],
  exclude: ['java'],
});

// Get search suggestions (autocomplete)
const suggestions = await search.search.suggest('lap', 5);
suggestions.forEach((s) => console.log(s.title));

// Get available entity types
const entityTypes = await search.search.entityTypes();
entityTypes.forEach((type) => {
  console.log(type.name, type.count);
});
```

### history - Search History

```typescript
// Get recent searches
const recentSearches = await search.history.recent(20);
recentSearches.forEach((q) => {
  console.log(q.query, q.totalRecords);
});

// Get specific query details
const queryDetails = await search.history.get('query-id');

// Clear all search history
await search.history.clear();

// Delete specific query from history
await search.history.delete('query-id');
```

### favorites - Favorites Management

```typescript
// List favorites with pagination
const { data: favorites, meta } = await search.favorites.list({
  page: 1,
  perPage: 20,
});

favorites.forEach((fav) => {
  console.log(fav.entityAlias, fav.entityType);
});

// Get a specific favorite
const favorite = await search.favorites.get('favorite-id');

// Add to favorites
const newFavorite = await search.favorites.add({
  entityUniqueId: 'product-123',
  entityType: 'Product',
  entityAlias: 'MacBook Pro',
  entityUrl: '/products/product-123',
  entityAvatarUrl: 'https://example.com/image.jpg',
});

// Remove from favorites
await search.favorites.remove('favorite-id');

// Check if entity is favorited
const isFavorited = await search.favorites.isFavorite('product-123');
if (isFavorited) {
  console.log('This item is in your favorites');
}
```

## Types

```typescript
import type {
  // Search types
  SearchResult,
  SearchQuery,
  SearchRequest,
  SearchResponse,

  // History types
  LastQuery,

  // Favorites types
  FavoriteEntity,
  AddFavoriteRequest,

  // Entity types
  EntityType,
} from '@23blocks/block-search';
```

### SearchRequest

| Property | Type | Description |
|----------|------|-------------|
| `query` | `string` | Search query text |
| `entityTypes` | `string[]` | Filter by entity types |
| `include` | `string[]` | Terms to include |
| `exclude` | `string[]` | Terms to exclude |
| `limit` | `number` | Max results to return |
| `offset` | `number` | Pagination offset |

### SearchResponse

| Property | Type | Description |
|----------|------|-------------|
| `results` | `SearchResult[]` | Search results |
| `query` | `SearchQuery` | Query details |
| `totalRecords` | `number` | Total matching records |
| `elapsedTime` | `number` | Search duration (ms) |

### SearchResult

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Result ID |
| `uniqueId` | `string` | Unique identifier |
| `title` | `string` | Display title |
| `description` | `string` | Description text |
| `entityType` | `string` | Type of entity |
| `entityUniqueId` | `string` | Entity unique ID |
| `score` | `number` | Relevance score |
| `url` | `string` | Entity URL |
| `avatarUrl` | `string` | Avatar/image URL |

### FavoriteEntity

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Favorite ID |
| `uniqueId` | `string` | Unique identifier |
| `entityUniqueId` | `string` | Favorited entity ID |
| `entityType` | `string` | Type of favorited entity |
| `entityAlias` | `string` | Display name |
| `entityUrl` | `string` | Entity URL |
| `entityAvatarUrl` | `string` | Entity image URL |
| `createdAt` | `Date` | When favorited |

## Error Handling

```typescript
import { isBlockErrorException, ErrorCodes } from '@23blocks/contracts';

try {
  const results = await search.search.search({ query: '' });
} catch (error) {
  if (isBlockErrorException(error)) {
    switch (error.code) {
      case ErrorCodes.VALIDATION_ERROR:
        console.log('Invalid search query');
        break;
      case ErrorCodes.UNAUTHORIZED:
        console.log('Please sign in to search');
        break;
    }
  }
}
```

## Advanced Usage

### Building a Search Component

```typescript
import { createSearchBlock } from '@23blocks/block-search';

// Debounced search with suggestions
let debounceTimer: NodeJS.Timeout;

async function handleSearchInput(query: string) {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(async () => {
    if (query.length < 2) return;

    // Get suggestions for autocomplete
    const suggestions = await search.search.suggest(query, 5);
    updateSuggestions(suggestions);
  }, 300);
}

async function executeSearch(query: string) {
  const { results, totalRecords } = await search.search.search({
    query,
    limit: 20,
  });

  updateResults(results);
  updateResultCount(totalRecords);
}
```

### Favorites Toggle

```typescript
async function toggleFavorite(entityId: string, entityType: string, entityName: string) {
  const isFavorited = await search.favorites.isFavorite(entityId);

  if (isFavorited) {
    // Find and remove the favorite
    const { data: favorites } = await search.favorites.list({
      filter: { entity_unique_id: entityId },
    });
    if (favorites.length > 0) {
      await search.favorites.remove(favorites[0].id);
    }
  } else {
    await search.favorites.add({
      entityUniqueId: entityId,
      entityType,
      entityAlias: entityName,
    });
  }
}
```

## Related Packages

- [`@23blocks/angular`](https://www.npmjs.com/package/@23blocks/angular) - Angular integration
- [`@23blocks/react`](https://www.npmjs.com/package/@23blocks/react) - React integration
- [`@23blocks/sdk`](https://www.npmjs.com/package/@23blocks/sdk) - Full SDK package

## License

MIT - Copyright (c) 2024 23blocks
