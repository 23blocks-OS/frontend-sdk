<div align="center">
  <h1>23blocks SDK</h1>
  <p><strong>Build full-stack apps 10x faster with modular backend blocks</strong></p>
  <p>A type-safe TypeScript SDK for <a href="https://23blocks.com">23blocks</a> backend-as-a-service. Authentication, payments, CRM, e-commerce, and 15+ more blocks ready to use.</p>

  <!-- Status Badges -->
  <p>
    <a href="https://www.npmjs.com/package/@23blocks/sdk"><img src="https://img.shields.io/npm/v/@23blocks/sdk.svg?style=flat-square&color=blue" alt="npm version"></a>
    <a href="https://www.npmjs.com/package/@23blocks/sdk"><img src="https://img.shields.io/npm/dm/@23blocks/sdk.svg?style=flat-square&color=green" alt="npm downloads"></a>
    <a href="https://github.com/23blocks-OS/frontend-sdk/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/23blocks-OS/frontend-sdk/ci.yml?style=flat-square" alt="CI"></a>
    <a href="https://github.com/23blocks-OS/frontend-sdk/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="MIT License"></a>
  </p>

  <!-- Tech Stack Badges -->
  <p>
    <img src="https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
    <img src="https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React">
    <img src="https://img.shields.io/badge/Angular-16+-DD0031?style=flat-square&logo=angular&logoColor=white" alt="Angular">
    <img src="https://img.shields.io/badge/Next.js-14+-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js">
    <img src="https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js">
  </p>

  <p>
    <a href="https://23blocks.com/docs">Documentation</a> &bull;
    <a href="https://23blocks.com">Website</a> &bull;
    <a href="https://github.com/23blocks-OS/frontend-sdk/issues">Issues</a>
  </p>
</div>

<br/>

## Features

- **Modular architecture** - Install only the blocks you need
- **Framework agnostic** - Core packages work with any JavaScript framework
- **First-class TypeScript** - Full type safety with comprehensive type definitions
- **Angular & React bindings** - Native integrations with RxJS Observables and React hooks
- **JSON:API compliant** - Built on the [JSON:API v1.0](https://jsonapi.org/) specification
- **Debug logging** - Built-in request/response logging for development
- **Request tracing** - Automatic request IDs for debugging and support
- **Automatic retries** - Exponential backoff with jitter for transient failures
- **Interceptors** - Hook into request/response lifecycle for cross-cutting concerns

## Why 23blocks?

Stop rebuilding the same backend features for every project. 23blocks provides production-ready building blocks:

| Challenge | 23blocks Solution |
|-----------|------------------|
| Building auth from scratch | Ready-to-use authentication with MFA, OAuth, roles, API keys |
| Weeks on CRUD operations | Pre-built blocks for CRM, products, content, forms |
| Complex payment integrations | Wallet and sales blocks with transaction support |
| Framework lock-in | Works with React, Angular, Next.js, Vue, or vanilla JS |
| Inconsistent API responses | JSON:API v1.0 compliant, predictable data structures |
| Debugging production issues | Built-in request tracing with unique IDs |

**Perfect for building:** SaaS applications &bull; E-commerce platforms &bull; Marketplaces &bull; Internal tools &bull; Mobile app backends &bull; Multi-tenant systems

## Comparison

| Feature | 23blocks | Firebase | Supabase | Custom Backend |
|---------|:--------:|:--------:|:--------:|:--------------:|
| Type-safe SDK | ✅ | ⚠️ Partial | ✅ | ❌ Build yourself |
| Modular architecture | ✅ 18+ blocks | ❌ Monolithic | ⚠️ Limited | ❌ Build yourself |
| React hooks | ✅ Native | ⚠️ Community | ✅ | ❌ Build yourself |
| Angular services | ✅ Native RxJS | ⚠️ Community | ❌ | ❌ Build yourself |
| JSON:API compliant | ✅ | ❌ | ❌ | ❌ Build yourself |
| Request tracing | ✅ Built-in | ❌ | ❌ | ❌ Build yourself |
| Self-hostable | ✅ | ❌ | ✅ | ✅ |
| Open source SDK | ✅ MIT | ✅ | ✅ | N/A |

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

## Debug Mode

Enable debug logging to see all requests and responses in your console:

```typescript
import { create23BlocksClient } from '@23blocks/sdk';

const client = create23BlocksClient({
  urls: { authentication: 'https://api.yourapp.com' },
  apiKey: 'your-api-key',
  debug: true,  // Enable debug logging
});
```

Console output:
```
[23blocks] POST /auth/sign_in [req_m5abc_xyz123]
[23blocks] → Headers: { "x-api-key": "***", "content-type": "application/json" }
[23blocks] → Body: { "email": "user@example.com", "password": "***" }
[23blocks] ← 200 OK (145ms) [req_m5abc_xyz123]
```

## Error Handling with Request Tracing

Every error includes a unique request ID for easy debugging:

```typescript
import { isBlockErrorException } from '@23blocks/contracts';

try {
  await client.auth.signIn({ email: 'user@example.com', password: 'wrong' });
} catch (error) {
  if (isBlockErrorException(error)) {
    console.log('Request ID:', error.requestId);  // "req_m5abc_xyz123"
    console.log('Duration:', error.duration);      // 145 (ms)
    console.log('Message:', error.message);        // "Invalid credentials"

    // Send to support: "Please check request req_m5abc_xyz123"
  }
}
```

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

### Testing

| Package | Description |
|---------|-------------|
| `@23blocks/testing` | Mock transport, fixtures, and assertion helpers |

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

## Support the Project

If 23blocks SDK helps you build faster, consider giving us a star! It helps others discover the project and motivates us to keep improving.

<p align="center">
  <a href="https://github.com/23blocks-OS/frontend-sdk/stargazers">
    <img src="https://img.shields.io/github/stars/23blocks-OS/frontend-sdk?style=social" alt="GitHub stars">
  </a>
</p>

## License

[MIT](./LICENSE) - Copyright (c) 2024 23blocks
