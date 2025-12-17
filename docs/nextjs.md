# Next.js / React Guide

Setup and usage guide for React and Next.js applications using `@23blocks/react`.

## Installation

```bash
npm install @23blocks/react
```

## Quick Start (Recommended)

The simplest way to use the SDK with automatic token management:

### 1. Wrap your app

```tsx
// app/layout.tsx (Next.js App Router)
'use client';

import { SimpleBlocks23Provider } from '@23blocks/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SimpleBlocks23Provider
          apiKey={process.env.NEXT_PUBLIC_API_KEY!}
          urls={{ authentication: process.env.NEXT_PUBLIC_API_URL! }}
        >
          {children}
        </SimpleBlocks23Provider>
      </body>
    </html>
  );
}
```

### 2. Use the hooks

```tsx
'use client';

import { useSimpleAuth } from '@23blocks/react';
import { useState } from 'react';

export function LoginForm() {
  const { signIn, signOut, isAuthenticated, authentication } = useSimpleAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Tokens are stored automatically!
    const { user } = await signIn({ email, password });
    console.log('Welcome', user.email);
  };

  if (isAuthenticated()) {
    return (
      <div>
        <p>You're logged in!</p>
        <button onClick={signOut}>Sign Out</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Sign In</button>
    </form>
  );
}
```

### 3. Access any block

```tsx
'use client';

import { useSimpleBlocks23 } from '@23blocks/react';
import { useEffect, useState } from 'react';

export function ProductList() {
  const { products } = useSimpleBlocks23();
  const [items, setItems] = useState([]);

  useEffect(() => {
    products.products.list({ limit: 20 })
      .then((response) => setItems(response.data));
  }, [products]);

  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

## Configuration Options

### Token Mode (Default)

```tsx
<SimpleBlocks23Provider
  apiKey="your-api-key"
  urls={{ authentication: 'https://api.yourapp.com' }}
  // authMode="token" // default
  // storage="localStorage" // 'sessionStorage' | 'memory'
>
```

### Cookie Mode (Recommended for Security)

```tsx
<SimpleBlocks23Provider
  apiKey="your-api-key"
  urls={{ authentication: 'https://api.yourapp.com' }}
  authMode="cookie"
>
```

### Multi-Tenant Setup

```tsx
<SimpleBlocks23Provider
  apiKey="your-api-key"
  urls={{ authentication: 'https://api.yourapp.com' }}
  tenantId="tenant-123"
>
```

---

## Advanced Setup (Custom Transport)

For advanced use cases requiring custom transport configuration:

```bash
npm install @23blocks/transport-http @23blocks/react @23blocks/block-authentication
```

### 1. Create a provider wrapper

```tsx
// providers/blocks-provider.tsx
'use client'; // Required for Next.js App Router

import { Blocks23Provider } from '@23blocks/react';
import { createHttpTransport } from '@23blocks/transport-http';
import { ReactNode, useMemo } from 'react';

export function BlocksProvider({ children }: { children: ReactNode }) {
  const transport = useMemo(() => createHttpTransport({
    baseUrl: process.env.NEXT_PUBLIC_API_URL!,
    headers: () => {
      // Client-side only
      if (typeof window === 'undefined') return {};
      const token = localStorage.getItem('access_token');
      return token ? { Authorization: `Bearer ${token}` } : {};
    },
  }), []);

  return (
    <Blocks23Provider
      transport={transport}
      authentication={{ apiKey: process.env.NEXT_PUBLIC_API_KEY! }}
      search={{ apiKey: process.env.NEXT_PUBLIC_API_KEY! }}
      // Add more blocks as needed
    >
      {children}
    </Blocks23Provider>
  );
}
```

### 2. Wrap your app

**Next.js App Router:**

```tsx
// app/layout.tsx
import { BlocksProvider } from '@/providers/blocks-provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <BlocksProvider>
          {children}
        </BlocksProvider>
      </body>
    </html>
  );
}
```

**Next.js Pages Router:**

```tsx
// pages/_app.tsx
import { BlocksProvider } from '@/providers/blocks-provider';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <BlocksProvider>
      <Component {...pageProps} />
    </BlocksProvider>
  );
}
```

**Plain React:**

```tsx
// main.tsx
import { BlocksProvider } from './providers/blocks-provider';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <BlocksProvider>
    <App />
  </BlocksProvider>
);
```

## Using Hooks (Advanced API)

### useAuth

```tsx
'use client';

import { useAuth } from '@23blocks/react';
import { useState } from 'react';

export function LoginForm() {
  const { signIn, isLoading, error, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn({ email, password });
    if (result) {
      localStorage.setItem('access_token', result.accessToken);
    }
  };

  if (user) {
    return <p>Welcome, {user.email}!</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
      {error && <p className="error">{error.message}</p>}
    </form>
  );
}
```

### useSearch

```tsx
'use client';

import { useSearch } from '@23blocks/react';
import { useState, useEffect } from 'react';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

export function SearchBar() {
  const { search, results, isLoading } = useSearch();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      search({ query: debouncedQuery, limit: 10 });
    }
  }, [debouncedQuery, search]);

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {isLoading && <p>Loading...</p>}
      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### useFavorites

```tsx
'use client';

import { useFavorites } from '@23blocks/react';

export function FavoriteButton({ itemId, itemType }: { itemId: string; itemType: string }) {
  const { favorites, addFavorite, removeFavorite, isLoading } = useFavorites();

  const isFavorited = favorites.some(
    (f) => f.favoriteableId === itemId && f.favoriteableType === itemType
  );

  const handleToggle = async () => {
    if (isFavorited) {
      await removeFavorite(itemId, itemType);
    } else {
      await addFavorite({ favoriteableId: itemId, favoriteableType: itemType });
    }
  };

  return (
    <button onClick={handleToggle} disabled={isLoading}>
      {isFavorited ? '❤️' : '🤍'}
    </button>
  );
}
```

### Direct Block Access

For operations not covered by hooks, access blocks directly:

```tsx
'use client';

import { useBlocks23 } from '@23blocks/react';

export function ProductList() {
  const { products } = useBlocks23();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (products) {
      products.products.list({ limit: 20 })
        .then((response) => setItems(response.data));
    }
  }, [products]);

  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

## Available Hooks

| Hook | Block | Description |
|------|-------|-------------|
| `useAuth` | authentication | Sign in, sign up, user state |
| `useSearch` | search | Search with results state |
| `useFavorites` | search | Favorites management |
| `useUsers` | authentication | User management |
| `useBlocks23` | all | Direct access to all block instances |

## Server-Side Rendering (SSR)

### Handling Client-Only Code

The SDK uses browser APIs (localStorage, etc.). Wrap client-only code:

```tsx
'use client';

import { useAuth } from '@23blocks/react';

// This component only renders on the client
export function UserProfile() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <p>Loading...</p>;
  if (!user) return <p>Not logged in</p>;

  return <p>Hello, {user.email}</p>;
}
```

### Server Components with Client Boundaries

```tsx
// app/dashboard/page.tsx (Server Component)
import { UserProfile } from '@/components/user-profile'; // Client Component

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <UserProfile /> {/* Client boundary */}
    </div>
  );
}
```

### Data Fetching on Server

For server-side data fetching, use blocks directly (not hooks):

```tsx
// app/products/page.tsx
import { createHttpTransport } from '@23blocks/transport-http';
import { createProductsBlock } from '@23blocks/block-products';

async function getProducts() {
  const transport = createHttpTransport({
    baseUrl: process.env.API_URL!,
    headers: () => ({ 'X-Api-Key': process.env.API_KEY! }),
  });

  const products = createProductsBlock(transport, {
    apiKey: process.env.API_KEY!,
  });

  return products.products.list({ limit: 20 });
}

export default async function ProductsPage() {
  const { data: products } = await getProducts();

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

## Error Handling

```tsx
import { isBlockErrorException } from '@23blocks/contracts';

const handleSubmit = async () => {
  try {
    await signIn({ email, password });
  } catch (err) {
    if (isBlockErrorException(err)) {
      // Typed error
      switch (err.code) {
        case 'INVALID_CREDENTIALS':
          setError('Invalid email or password');
          break;
        case 'ACCOUNT_LOCKED':
          setError('Account is locked. Please contact support.');
          break;
        default:
          setError(err.message);
      }
    }
  }
};
```

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=https://api.yourapp.com
NEXT_PUBLIC_API_KEY=your-api-key

# Server-side only
API_KEY=your-secret-api-key
```

## TypeScript

All hooks and blocks are fully typed:

```tsx
import type { User, SignInResponse } from '@23blocks/block-authentication';

const handleSignIn = async (): Promise<SignInResponse | null> => {
  return await signIn({ email, password });
};

const user: User | null = useAuth().user;
```
