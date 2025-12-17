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

## Quick Start

```bash
npm install @23blocks/sdk
```

```typescript
import { create23BlocksClient } from '@23blocks/sdk';

// Create client - that's it!
const client = create23BlocksClient({
  urls: { authentication: 'https://api.yourapp.com' },
  apiKey: 'your-api-key',
});

// Sign in - tokens are stored automatically
await client.auth.signIn({ email: 'user@example.com', password: 'password' });

// All subsequent requests include auth automatically
const products = await client.products.products.list();
const user = await client.auth.getCurrentUser();

// Sign out - tokens are cleared automatically
await client.auth.signOut();
```

> **Note:** This SDK requires a 23blocks-compatible backend API. The backend must implement the 23blocks API contract including specific resource types, endpoints, and JSON:API response formats.

See [Installation Guide](./docs/installation.md) for detailed options.

## Documentation

| Guide | Description |
|-------|-------------|
| [Installation](./docs/installation.md) | Full SDK vs individual packages |
| [Angular](./docs/angular.md) | Setup with Injectable services and RxJS |
| [Next.js / React](./docs/nextjs.md) | Setup with hooks and context |
| [Vanilla TypeScript](./docs/vanilla.md) | Framework-agnostic usage |

## Available Packages

### Core Infrastructure

| Package | Description |
|---------|-------------|
| `@23blocks/contracts` | Core types and interfaces |
| `@23blocks/jsonapi-codec` | JSON:API encoder/decoder |
| `@23blocks/transport-http` | HTTP transport layer |

### Feature Blocks

| Package | Description |
|---------|-------------|
| `@23blocks/block-authentication` | Auth, users, roles, API keys |
| `@23blocks/block-search` | Full-text search, favorites |
| `@23blocks/block-products` | Product catalog, categories, variants |
| `@23blocks/block-crm` | Contacts, organizations, deals |
| `@23blocks/block-content` | CMS content, pages, media |
| `@23blocks/block-geolocation` | Addresses, places, geocoding |
| `@23blocks/block-conversations` | Messaging, threads, notifications |
| `@23blocks/block-files` | File uploads, storage |
| `@23blocks/block-forms` | Form builder, submissions |
| `@23blocks/block-assets` | Asset management, tracking |
| `@23blocks/block-campaigns` | Marketing campaigns, audiences |
| `@23blocks/block-company` | Company settings, branding |
| `@23blocks/block-rewards` | Loyalty programs, points |
| `@23blocks/block-sales` | Orders, invoices, payments |
| `@23blocks/block-wallet` | Digital wallet, transactions |
| `@23blocks/block-jarvis` | AI assistant integration |
| `@23blocks/block-onboarding` | User onboarding flows |
| `@23blocks/block-university` | Learning management, courses |

### Framework Bindings

| Package | Description |
|---------|-------------|
| `@23blocks/angular` | Angular services with RxJS Observables |
| `@23blocks/react` | React hooks and context provider |
| `@23blocks/sdk` | Meta-package with all blocks |

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Framework Bindings                                         │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ @23blocks/angular│  │ @23blocks/react  │                │
│  │ (RxJS Observables)  │ (hooks, context) │                │
│  └────────┬─────────┘  └────────┬─────────┘                │
└───────────┼─────────────────────┼──────────────────────────┘
            │                     │
┌───────────▼─────────────────────▼──────────────────────────┐
│  Blocks (Promise-based, framework agnostic)                │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐  │
│  │ authentication │ │    search      │ │   products     │  │
│  └────────────────┘ └────────────────┘ └────────────────┘  │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐  │
│  │      crm       │ │    content     │ │    + more      │  │
│  └────────┬───────┘ └────────┬───────┘ └────────┬───────┘  │
└───────────┼──────────────────┼──────────────────┼──────────┘
            │                  │                  │
┌───────────▼──────────────────▼──────────────────▼──────────┐
│  Core Infrastructure                                        │
│  ┌────────────┐ ┌──────────────┐ ┌──────────────────┐      │
│  │ contracts  │ │jsonapi-codec │ │  transport-http  │      │
│  └────────────┘ └──────────────┘ └──────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Requirements

- Node.js >= 18.0.0
- TypeScript >= 5.0 (for TypeScript users)
- Angular >= 10 (for `@23blocks/angular`)
- React >= 18 (for `@23blocks/react`)

## Contributing

We welcome contributions! Please see our [Development Guide](./DEVELOPMENT.md) for details.

## License

[MIT](./LICENSE) - Copyright (c) 2024 23blocks
