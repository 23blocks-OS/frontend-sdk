# Vanilla TypeScript Guide

Framework-agnostic usage of the 23blocks SDK. Works with any JavaScript environment.

## Installation

```bash
npm install @23blocks/transport-http

# Plus the blocks you need
npm install @23blocks/block-authentication @23blocks/block-search
```

Or with the full SDK:

```bash
npm install @23blocks/sdk @23blocks/transport-http
```

## Basic Setup

### 1. Create the transport

```typescript
import { createHttpTransport } from '@23blocks/transport-http';

const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  headers: () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});
```

### 2. Create blocks

```typescript
import { createAuthenticationBlock } from '@23blocks/block-authentication';
import { createSearchBlock } from '@23blocks/block-search';

const auth = createAuthenticationBlock(transport, {
  appId: 'your-app-id',
});

const search = createSearchBlock(transport, {
  appId: 'your-app-id',
});
```

### 3. Use the blocks

```typescript
// Sign in
const { user, accessToken } = await auth.auth.signIn({
  email: 'user@example.com',
  password: 'password',
});

localStorage.setItem('access_token', accessToken);
console.log('Welcome', user.email);

// Search
const results = await search.search.search({
  query: 'hello world',
  limit: 10,
});

console.log(results.data);
```

## Transport Configuration

### Basic Configuration

```typescript
const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
});
```

### With Authentication Headers

```typescript
const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  headers: () => ({
    Authorization: `Bearer ${getAccessToken()}`,
    'X-Custom-Header': 'value',
  }),
});
```

### With Retry Configuration

```typescript
const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  retry: {
    maxRetries: 3,
    retryDelay: 1000,
    retryOn: [500, 502, 503, 504],
  },
});
```

### With Timeout

```typescript
const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  timeout: 30000, // 30 seconds
});
```

## Authentication Examples

### Sign In

```typescript
const auth = createAuthenticationBlock(transport, { appId: 'your-app-id' });

try {
  const { user, accessToken, refreshToken } = await auth.auth.signIn({
    email: 'user@example.com',
    password: 'password',
  });

  // Store tokens
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);

  console.log('Signed in as', user.email);
} catch (error) {
  if (isBlockErrorException(error)) {
    console.error('Sign in failed:', error.message);
  }
}
```

### Sign Up

```typescript
const { user, accessToken } = await auth.auth.signUp({
  email: 'newuser@example.com',
  password: 'securepassword',
  firstName: 'John',
  lastName: 'Doe',
});
```

### Password Reset

```typescript
// Request reset
await auth.auth.requestPasswordReset({
  email: 'user@example.com',
});

// Complete reset (with token from email)
await auth.auth.resetPassword({
  token: 'reset-token-from-email',
  password: 'newpassword',
});
```

### Token Refresh

```typescript
const refreshToken = localStorage.getItem('refresh_token');

const { accessToken, refreshToken: newRefreshToken } = await auth.auth.refreshToken({
  refreshToken,
});

localStorage.setItem('access_token', accessToken);
localStorage.setItem('refresh_token', newRefreshToken);
```

### Get Current User

```typescript
const user = await auth.users.me();
console.log(user.email, user.firstName, user.lastName);
```

## Search Examples

### Basic Search

```typescript
const search = createSearchBlock(transport, { appId: 'your-app-id' });

const results = await search.search.search({
  query: 'product name',
  limit: 20,
  offset: 0,
});

results.data.forEach((item) => {
  console.log(item.id, item.title, item.score);
});
```

### Search with Filters

```typescript
const results = await search.search.search({
  query: 'laptop',
  filters: {
    category: 'electronics',
    priceMin: 500,
    priceMax: 2000,
  },
  sort: { field: 'price', direction: 'asc' },
  limit: 10,
});
```

### Favorites

```typescript
// Add favorite
await search.favorites.create({
  favoriteableId: 'product-123',
  favoriteableType: 'Product',
});

// List favorites
const favorites = await search.favorites.list({ limit: 50 });

// Remove favorite
await search.favorites.delete('favorite-id');
```

## Products Examples

```typescript
import { createProductsBlock } from '@23blocks/block-products';

const products = createProductsBlock(transport, { appId: 'your-app-id' });

// List products
const { data, meta } = await products.products.list({
  limit: 20,
  sort: { field: 'createdAt', direction: 'desc' },
});

console.log(`Found ${meta.total} products`);

// Get single product
const product = await products.products.get('product-id');

// List categories
const categories = await products.categories.list();

// Get product variants
const variants = await products.variants.listByProduct('product-id');
```

## Error Handling

```typescript
import { BlockErrorException, isBlockErrorException, ErrorCodes } from '@23blocks/contracts';

try {
  await auth.auth.signIn({ email, password });
} catch (error) {
  if (isBlockErrorException(error)) {
    // Typed error with code, message, and optional details
    console.error('Error code:', error.code);
    console.error('Message:', error.message);

    switch (error.code) {
      case ErrorCodes.INVALID_CREDENTIALS:
        showError('Invalid email or password');
        break;
      case ErrorCodes.ACCOUNT_LOCKED:
        showError('Account locked. Contact support.');
        break;
      case ErrorCodes.NETWORK_ERROR:
        showError('Network error. Please try again.');
        break;
      default:
        showError(error.message);
    }
  } else {
    // Unknown error
    throw error;
  }
}
```

## Pagination

```typescript
import type { PageResult, ListParams } from '@23blocks/contracts';

async function fetchAllProducts(): Promise<Product[]> {
  const allProducts: Product[] = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const { data, meta } = await products.products.list({ limit, offset });
    allProducts.push(...data);

    if (allProducts.length >= meta.total) {
      break;
    }

    offset += limit;
  }

  return allProducts;
}
```

## Creating a Service Layer

For larger applications, wrap blocks in a service layer:

```typescript
// services/api.ts
import { createHttpTransport } from '@23blocks/transport-http';
import { createAuthenticationBlock } from '@23blocks/block-authentication';
import { createSearchBlock } from '@23blocks/block-search';
import { createProductsBlock } from '@23blocks/block-products';

const transport = createHttpTransport({
  baseUrl: import.meta.env.VITE_API_URL,
  headers: () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
});

const config = { appId: import.meta.env.VITE_APP_ID };

export const api = {
  auth: createAuthenticationBlock(transport, config),
  search: createSearchBlock(transport, config),
  products: createProductsBlock(transport, config),
};

// Usage
import { api } from './services/api';

await api.auth.auth.signIn({ email, password });
const results = await api.search.search.search({ query: 'test' });
```

## TypeScript Types

All types are exported from each package:

```typescript
import type {
  User,
  SignInRequest,
  SignInResponse,
  Company,
  ApiKey,
} from '@23blocks/block-authentication';

import type {
  SearchResult,
  Favorite,
} from '@23blocks/block-search';

import type {
  Product,
  Category,
  Variant,
} from '@23blocks/block-products';

import type {
  Transport,
  BlockError,
  PageResult,
  ListParams,
} from '@23blocks/contracts';
```

## Node.js / Server Usage

The SDK works in Node.js environments:

```typescript
// server.ts
import { createHttpTransport } from '@23blocks/transport-http';
import { createAuthenticationBlock } from '@23blocks/block-authentication';

const transport = createHttpTransport({
  baseUrl: process.env.API_URL!,
  headers: () => ({
    'X-Api-Key': process.env.API_KEY!,
  }),
});

const auth = createAuthenticationBlock(transport, {
  appId: process.env.APP_ID!,
});

// Use in your server routes
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await auth.auth.signIn({ email, password });
  res.json(result);
});
```
