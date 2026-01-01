# @23blocks/react

React bindings for the 23blocks SDK - hooks and context providers.

[![npm version](https://img.shields.io/npm/v/@23blocks/react.svg)](https://www.npmjs.com/package/@23blocks/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @23blocks/react
```

## Overview

This package provides React-specific bindings for the 23blocks SDK:

- **Context Providers** - Configure blocks at the app level
- **Hooks** - React hooks for all SDK functionality
- **Token Management** - Automatic token storage and refresh
- **TypeScript** - Full type safety

## Quick Start

### 1. Wrap your app

```tsx
// app/layout.tsx (Next.js App Router)
'use client';

import { Provider } from '@23blocks/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider
          apiKey={process.env.NEXT_PUBLIC_API_KEY!}
          urls={{
            authentication: process.env.NEXT_PUBLIC_AUTH_URL!,
            // Add other service URLs as needed
            // products: process.env.NEXT_PUBLIC_PRODUCTS_URL,
          }}
        >
          {children}
        </Provider>
      </body>
    </html>
  );
}
```

### 2. Use the hooks

```tsx
'use client';

import { useAuth } from '@23blocks/react';
import { useState } from 'react';

export function LoginForm() {
  const { signIn, signOut, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

import { useClient } from '@23blocks/react';
import { useEffect, useState } from 'react';

export function ProductList() {
  const client = useClient();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    client.products.products.list({ limit: 20 })
      .then((response) => setProducts(response.data));
  }, [client]);

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

## Configuration Options

### Provider Props

```tsx
<Provider
  // Required: Your API key
  apiKey="your-api-key"

  // Required: Service URLs (only configure what you need)
  urls={{
    authentication: 'https://auth.yourapp.com',
    products: 'https://products.yourapp.com',
    crm: 'https://crm.yourapp.com',
  }}

  // Optional: Tenant ID for multi-tenant setups
  tenantId="tenant-123"

  // Optional: Authentication mode (default: 'token')
  authMode="token" // 'token' | 'cookie'

  // Optional: Token storage (default: 'localStorage')
  storage="localStorage" // 'localStorage' | 'sessionStorage' | 'memory'

  // Optional: Enable debug logging
  debug={process.env.NODE_ENV === 'development'}
>
```

### Token Mode (Default)

```tsx
<Provider
  apiKey="your-api-key"
  urls={{ authentication: 'https://auth.yourapp.com' }}
  authMode="token"        // default
  storage="localStorage"  // default
>
```

### Cookie Mode (Recommended for Security)

```tsx
<Provider
  apiKey="your-api-key"
  urls={{ authentication: 'https://auth.yourapp.com' }}
  authMode="cookie"
>
```

### Multi-Tenant Setup

```tsx
<Provider
  apiKey="your-api-key"
  urls={{ authentication: 'https://auth.yourapp.com' }}
  tenantId="tenant-123"
>
```

## Available Hooks

### Main Hooks

| Hook | Description |
|------|-------------|
| `useAuth()` | Authentication - sign in, sign up, sign out |
| `useClient()` | Access to all blocks via client |

### Block-Specific Hooks

| Hook | Description |
|------|-------------|
| `useAuthenticationBlock()` | Authentication block instance |
| `useSearchBlock()` | Search block instance |
| `useProductsBlock()` | Products block instance |
| `useCrmBlock()` | CRM block instance |
| `useContentBlock()` | Content block instance |
| `useGeolocationBlock()` | Geolocation block instance |
| `useConversationsBlock()` | Conversations block instance |
| `useFilesBlock()` | Files block instance |
| `useFormsBlock()` | Forms block instance |
| `useAssetsBlock()` | Assets block instance |
| `useCampaignsBlock()` | Campaigns block instance |
| `useCompanyBlock()` | Company block instance |
| `useRewardsBlock()` | Rewards block instance |
| `useSalesBlock()` | Sales block instance |
| `useWalletBlock()` | Wallet block instance |
| `useJarvisBlock()` | Jarvis AI block instance |
| `useOnboardingBlock()` | Onboarding block instance |
| `useUniversityBlock()` | University block instance |

### Feature Hooks

| Hook | Description |
|------|-------------|
| `useSearch()` | Search with state management |
| `useFavorites()` | Favorites management |
| `useUsers()` | User management (admin) |
| `useMfa()` | Multi-factor authentication |
| `useOAuth()` | OAuth operations |
| `useAvatars()` | User avatar management |
| `useTenants()` | Tenant management |

## Authentication Examples

### useAuth - Sign In

```tsx
'use client';

import { useAuth } from '@23blocks/react';

export function LoginForm() {
  const { signIn, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Required: email, password
      const { user, accessToken } = await signIn({ email, password });
      console.log('Welcome', user.email);
    } catch (err) {
      setError(err.message);
    }
  };

  // ...
}
```

### useAuth - Sign Up (Registration)

```tsx
'use client';

import { useAuth } from '@23blocks/react';

export function RegisterForm() {
  const { signUp } = useAuth();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Sign up with required fields only
    const { user, accessToken, message } = await signUp({
      email: 'new@example.com',         // Required
      password: 'password',              // Required
      passwordConfirmation: 'password',  // Required - must match password
    });

    // accessToken may be undefined if email confirmation is enabled
    if (accessToken) {
      console.log('Logged in as', user.email);
    } else {
      console.log(message); // "Confirmation email sent"
    }
  };

  // Sign up with optional fields
  const handleFullSignUp = async () => {
    const { user } = await signUp({
      // Required
      email: 'new@example.com',
      password: 'securePassword123',
      passwordConfirmation: 'securePassword123',

      // Optional
      name: 'John Doe',
      username: 'johndoe',
      roleId: 'role-uuid',
      confirmSuccessUrl: 'https://yourapp.com/confirmed',  // Redirect after email confirmation
      timeZone: 'America/New_York',
      preferredLanguage: 'en',
      payload: { referralCode: 'ABC123' },
      subscription: 'premium-plan',
    });
  };
}
```

### useAuth - Sign Out

```tsx
const { signOut } = useAuth();

const handleSignOut = async () => {
  await signOut();
  // Tokens are automatically cleared
};
```

### useAuth - Full Example

```tsx
'use client';

import { useAuth } from '@23blocks/react';

export function AuthComponent() {
  const {
    signIn,
    signUp,
    signOut,
    isAuthenticated,
    getAccessToken,
    getCurrentUser,
  } = useAuth();

  // Check authentication
  if (isAuthenticated()) {
    return (
      <div>
        <button onClick={signOut}>Sign Out</button>
      </div>
    );
  }

  return <LoginForm />;
}
```

### Email Confirmation

```tsx
import { useAuth } from '@23blocks/react';

export function EmailConfirmation() {
  const { confirmEmail, resendConfirmation } = useAuth();

  // Confirm email with token from URL
  const handleConfirm = async (token: string) => {
    const user = await confirmEmail(token);
    console.log('Email confirmed for', user.email);
  };

  // Resend confirmation email
  const handleResend = async (email: string) => {
    await resendConfirmation({
      email,
      confirmSuccessUrl: 'https://yourapp.com/confirmed',  // Optional
    });
    console.log('Confirmation email sent');
  };
}
```

### useSearch

```tsx
'use client';

import { useSearchBlock } from '@23blocks/react';
import { useState, useEffect } from 'react';

export function SearchComponent() {
  const search = useSearchBlock();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query.length < 2) return;

    const timer = setTimeout(async () => {
      const response = await search.search.search({ query, limit: 10 });
      setResults(response.results);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, search]);

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
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

export function FavoriteButton({ itemId, itemType }: Props) {
  const { favorites, addFavorite, removeFavorite, isLoading } = useFavorites();

  const isFavorited = favorites.some(
    (f) => f.entityUniqueId === itemId && f.entityType === itemType
  );

  const handleToggle = async () => {
    if (isFavorited) {
      const fav = favorites.find((f) => f.entityUniqueId === itemId);
      if (fav) await removeFavorite(fav.id);
    } else {
      await addFavorite({ entityUniqueId: itemId, entityType: itemType });
    }
  };

  return (
    <button onClick={handleToggle} disabled={isLoading}>
      {isFavorited ? 'Favorited' : 'Add to Favorites'}
    </button>
  );
}
```

## Server-Side Rendering (SSR)

### Handling Client-Only Code

```tsx
'use client';

import { useAuth } from '@23blocks/react';
import { useState, useEffect } from 'react';

// This component only renders on the client
export function UserProfile() {
  const { getCurrentUser, isAuthenticated } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isAuthenticated()) {
      getCurrentUser().then(setUser);
    }
  }, []);

  if (!user) return <p>Loading...</p>;
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

```tsx
// app/products/page.tsx
import { createHttpTransport } from '@23blocks/transport-http';
import { createProductsBlock } from '@23blocks/block-products';

async function getProducts() {
  const transport = createHttpTransport({
    baseUrl: process.env.PRODUCTS_URL!,
    headers: () => ({ 'x-api-key': process.env.API_KEY! }),
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

Every error includes a unique request ID for easy debugging and support:

```tsx
import { isBlockErrorException, ErrorCodes } from '@23blocks/contracts';

const handleSubmit = async () => {
  try {
    await signIn({ email, password });
  } catch (err) {
    if (isBlockErrorException(err)) {
      // Request tracing for debugging
      console.log('Request ID:', err.requestId);  // "req_m5abc_xyz123"
      console.log('Duration:', err.duration);      // 145 (ms)

      switch (err.code) {
        case ErrorCodes.INVALID_CREDENTIALS:
          setError('Invalid email or password');
          break;
        case ErrorCodes.UNAUTHORIZED:
          setError('Session expired');
          break;
        case ErrorCodes.VALIDATION_ERROR:
          setError(err.message);
          break;
        default:
          setError(err.message);
      }

      // Send request ID to support for debugging
      // "Please check request req_m5abc_xyz123"
    }
  }
};
```

## Advanced Setup (Custom Transport)

```tsx
'use client';

import { Blocks23Provider } from '@23blocks/react';
import { createHttpTransport } from '@23blocks/transport-http';
import { useMemo } from 'react';

export function BlocksProvider({ children }: { children: React.ReactNode }) {
  const transport = useMemo(() => createHttpTransport({
    baseUrl: process.env.NEXT_PUBLIC_AUTH_URL!,
    headers: () => {
      if (typeof window === 'undefined') return {};
      const token = localStorage.getItem('access_token');
      return {
        'x-api-key': process.env.NEXT_PUBLIC_API_KEY!,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
    },
  }), []);

  return (
    <Blocks23Provider
      transport={transport}
      authentication={{ apiKey: process.env.NEXT_PUBLIC_API_KEY! }}
      search={{ apiKey: process.env.NEXT_PUBLIC_API_KEY! }}
    >
      {children}
    </Blocks23Provider>
  );
}
```

## Environment Variables

```env
# .env.local

# Service URLs
NEXT_PUBLIC_AUTH_URL=https://auth.yourapp.com
NEXT_PUBLIC_PRODUCTS_URL=https://products.yourapp.com
NEXT_PUBLIC_CRM_URL=https://crm.yourapp.com

# Client-side API key
NEXT_PUBLIC_API_KEY=your-api-key

# Server-side only
API_KEY=your-secret-api-key
```

## TypeScript

All hooks and contexts are fully typed:

```typescript
import type { User, SignInResponse, SignUpResponse } from '@23blocks/block-authentication';

const handleSignIn = async (): Promise<SignInResponse | null> => {
  return await signIn({ email, password });
};

// SignUpResponse.accessToken is optional
const handleSignUp = async (): Promise<void> => {
  const { user, accessToken, message } = await signUp({
    email,
    password,
    passwordConfirmation: password,
  });

  if (accessToken) {
    // User is logged in
  } else {
    // Email confirmation required
    alert(message);
  }
};
```

## Related Packages

- [`@23blocks/sdk`](https://www.npmjs.com/package/@23blocks/sdk) - Full SDK package
- [`@23blocks/angular`](https://www.npmjs.com/package/@23blocks/angular) - Angular integration

## License

MIT - Copyright (c) 2024 23blocks
