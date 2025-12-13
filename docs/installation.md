# Installation Guide

Choose the installation approach that best fits your project needs.

## Option 1: Full SDK (Recommended for new projects)

Install the meta-package that includes all blocks:

```bash
npm install @23blocks/sdk @23blocks/transport-http
```

**When to use:**
- Starting a new project
- You need multiple blocks
- You want the simplest setup
- Bundle size is not a primary concern

```typescript
import { createHttpTransport } from '@23blocks/transport-http';
import {
  createAuthenticationBlock,
  createSearchBlock,
  createProductsBlock,
  // All blocks available
} from '@23blocks/sdk';
```

## Option 2: Individual Packages (À la carte)

Install only the blocks you need for smaller bundle sizes:

```bash
# Core (always required)
npm install @23blocks/transport-http

# Add only what you need
npm install @23blocks/block-authentication
npm install @23blocks/block-search
```

**When to use:**
- Bundle size is critical
- You only need 1-3 blocks
- Adding to an existing large application
- Micro-frontend architecture

```typescript
import { createHttpTransport } from '@23blocks/transport-http';
import { createAuthenticationBlock } from '@23blocks/block-authentication';
import { createSearchBlock } from '@23blocks/block-search';
```

## Framework Bindings

### Angular

```bash
# With full SDK
npm install @23blocks/sdk @23blocks/transport-http @23blocks/angular

# Or à la carte
npm install @23blocks/transport-http @23blocks/block-authentication @23blocks/angular
```

See [Angular Guide](./angular.md) for setup instructions.

### React / Next.js

```bash
# With full SDK
npm install @23blocks/sdk @23blocks/transport-http @23blocks/react

# Or à la carte
npm install @23blocks/transport-http @23blocks/block-authentication @23blocks/react
```

See [Next.js Guide](./nextjs.md) for setup instructions.

### Vanilla TypeScript

```bash
# With full SDK
npm install @23blocks/sdk @23blocks/transport-http

# Or à la carte
npm install @23blocks/transport-http @23blocks/block-authentication
```

See [Vanilla TypeScript Guide](./vanilla.md) for setup instructions.

## Package Dependencies

Understanding which packages depend on what:

```
@23blocks/sdk
├── @23blocks/contracts (types)
├── @23blocks/jsonapi-codec (internal)
└── @23blocks/block-* (all 18 blocks)

@23blocks/angular
├── @23blocks/contracts
└── @23blocks/block-* (peer dependencies)

@23blocks/react
├── @23blocks/contracts
└── @23blocks/block-* (peer dependencies)

@23blocks/block-*
├── @23blocks/contracts
└── @23blocks/jsonapi-codec
```

## TypeScript Configuration

The SDK is written in TypeScript and ships with full type definitions. Recommended `tsconfig.json` settings:

```json
{
  "compilerOptions": {
    "moduleResolution": "NodeNext",
    "module": "NodeNext",
    "target": "ES2022",
    "strict": true,
    "esModuleInterop": true
  }
}
```

## CommonJS vs ESM

All packages are ESM-only (ES Modules). If you're using CommonJS, you'll need to either:
1. Migrate to ESM (recommended)
2. Use dynamic imports: `const { createAuthenticationBlock } = await import('@23blocks/block-authentication')`

## Peer Dependencies

| Package | Peer Dependencies |
|---------|-------------------|
| `@23blocks/angular` | `@angular/core >=10.0.0`, `rxjs >=6.0.0` |
| `@23blocks/react` | `react >=18.0.0` |

## Version Compatibility

- Node.js >= 18.0.0
- TypeScript >= 5.0
- Angular >= 10
- React >= 18
