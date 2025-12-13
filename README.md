# 23blocks SDK

A modular, framework-agnostic TypeScript SDK for building applications with [23blocks](https://23blocks.com) backends.

[![CI](https://github.com/23blocks-OS/frontend-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/23blocks-OS/frontend-sdk/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **Modular architecture** - Install only the blocks you need
- **Framework agnostic** - Core packages work with any JavaScript framework
- **First-class TypeScript** - Full type safety with comprehensive type definitions
- **Angular & React bindings** - Native integrations with RxJS Observables and React hooks
- **JSON:API compliant** - Built on the [JSON:API v1.0](https://jsonapi.org/) specification

## Packages

| Package | Description |
|---------|-------------|
| `@23blocks/contracts` | Core types and interfaces |
| `@23blocks/jsonapi-codec` | JSON:API encoder/decoder |
| `@23blocks/transport-http` | HTTP transport layer |
| `@23blocks/block-authentication` | Auth, users, roles, API keys |
| `@23blocks/block-search` | Full-text search, favorites |
| `@23blocks/angular` | Angular services (RxJS) |
| `@23blocks/react` | React hooks & context |

## Quick Start

### Installation

```bash
# Core packages
npm install @23blocks/contracts @23blocks/transport-http

# Add blocks you need
npm install @23blocks/block-authentication
npm install @23blocks/block-search

# Framework bindings (choose one)
npm install @23blocks/react
npm install @23blocks/angular
```

### Basic Usage (Framework Agnostic)

```typescript
import { createHttpTransport } from '@23blocks/transport-http';
import { createAuthenticationBlock } from '@23blocks/block-authentication';

// Create transport
const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
  headers: () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  }),
});

// Create authentication block
const auth = createAuthenticationBlock(transport, {
  appId: 'your-app-id',
});

// Use it
const { user, accessToken } = await auth.auth.signIn({
  email: 'user@example.com',
  password: 'password',
});

console.log('Welcome', user.email);
```

### React

```tsx
import { Blocks23Provider, useAuth } from '@23blocks/react';
import { createHttpTransport } from '@23blocks/transport-http';

const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
});

function App() {
  return (
    <Blocks23Provider
      transport={transport}
      authentication={{ appId: 'your-app-id' }}
    >
      <LoginForm />
    </Blocks23Provider>
  );
}

function LoginForm() {
  const { signIn, isLoading, error, user } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await signIn({ email, password });
  };

  if (user) {
    return <p>Welcome, {user.email}!</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error">{error.message}</p>}
      <button disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
```

### Angular

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provide23Blocks } from '@23blocks/angular';
import { createHttpTransport } from '@23blocks/transport-http';

const transport = createHttpTransport({
  baseUrl: 'https://api.yourapp.com',
});

export const appConfig: ApplicationConfig = {
  providers: [
    provide23Blocks({
      transport,
      authentication: { appId: 'your-app-id' },
    }),
  ],
};

// login.component.ts
import { Component } from '@angular/core';
import { AuthenticationService } from '@23blocks/angular';

@Component({
  selector: 'app-login',
  template: `<button (click)="login()">Sign In</button>`,
})
export class LoginComponent {
  constructor(private auth: AuthenticationService) {}

  login() {
    this.auth.signIn({ email: 'user@example.com', password: 'password' })
      .subscribe({
        next: (response) => console.log('Welcome', response.user.email),
        error: (err) => console.error(err),
      });
  }
}
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Framework Bindings                                     │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │ @23blocks/angular│  │ @23blocks/react  │            │
│  │ (RxJS Observables)  │ (hooks, context) │            │
│  └────────┬─────────┘  └────────┬─────────┘            │
└───────────┼─────────────────────┼──────────────────────┘
            │                     │
┌───────────▼─────────────────────▼──────────────────────┐
│  Blocks (Promise-based, framework agnostic)            │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │block-authentication│ │  block-search   │  + more    │
│  └────────┬─────────┘  └────────┬─────────┘            │
└───────────┼─────────────────────┼──────────────────────┘
            │                     │
┌───────────▼─────────────────────▼──────────────────────┐
│  Core Infrastructure                                   │
│  ┌────────────┐ ┌──────────────┐ ┌──────────────────┐  │
│  │ contracts  │ │jsonapi-codec │ │  transport-http  │  │
│  └────────────┘ └──────────────┘ └──────────────────┘  │
└────────────────────────────────────────────────────────┘
```

## Requirements

- Node.js >= 18.0.0
- TypeScript >= 5.0 (for TypeScript users)
- Angular >= 17 (for `@23blocks/angular`)
- React >= 18 (for `@23blocks/react`)

## Documentation

- [Development Guide](./DEVELOPMENT.md) - Contributing, local testing, releasing

## Contributing

We welcome contributions! Please see our [Development Guide](./DEVELOPMENT.md) for details on:

- Setting up the development environment
- Running tests locally
- Testing changes without publishing to npm
- Submitting pull requests

## License

[MIT](./LICENSE) - Copyright (c) 2024 23blocks
