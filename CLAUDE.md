# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

23blocks SDK is a modular, framework-agnostic TypeScript SDK for building applications with 23blocks backends. It uses JSON:API v1.0 specification and provides native bindings for Angular (RxJS) and React (hooks/context).

## Build & Development Commands

```bash
# Install dependencies
npm ci

# Build all packages (required before testing)
npm run build

# Build a specific package
npx nx build @23blocks/block-authentication

# Run all tests
npm run test

# Run tests for a specific package
npx nx test @23blocks/block-search

# Type checking
npm run typecheck

# Lint
npm run lint

# Clean build artifacts
npm run clean

# View dependency graph
npm run graph
```

## Release Process

Releases are automated via GitHub Actions using npm Trusted Publishing (OIDC). Push to `main` triggers:
1. `nx release` - determines versions from conventional commits, updates changelogs, creates git tags
2. `npm publish --provenance` - publishes each package with OIDC authentication

**Important:** Each package has independent versioning. Trusted Publisher is configured on npm with:
- Owner: `23blocks-OS` (case-sensitive!)
- Repository: `frontend-sdk`
- Workflow: `release.yml`

Manual release: `npm run release` or `npm run release:dry-run`

## Architecture

```
packages/
├── contracts/           # Core types: Transport, BlockConfig, errors, pagination
├── jsonapi-codec/       # JSON:API v1.0 encoder/decoder
├── transport-http/      # HTTP transport implementation
├── block-*/             # Feature blocks (18 total) - Promise-based, framework-agnostic
├── angular/             # Angular services wrapping blocks with RxJS Observables
├── react/               # React context + hooks wrapping blocks
└── sdk/                 # Meta-package re-exporting all blocks
```

### Block Pattern

Each `block-*` package follows this structure:
- `createXxxBlock(transport, config)` - Factory function returning the block instance
- `services/` - Service classes with CRUD operations
- `mappers/` - JSON:API response mappers
- `types/` - TypeScript interfaces

Example:
```typescript
import { createAuthenticationBlock } from '@23blocks/block-authentication';
const auth = createAuthenticationBlock(transport, { appId: 'xxx' });
await auth.auth.signIn({ email, password });
```

### Framework Bindings

**Angular** (`@23blocks/angular`):
- Injectable services that wrap blocks
- Use `provide23Blocks({ transport, authentication: {...} })` in app config
- Services convert Promise methods to RxJS Observables via `from()`

**React** (`@23blocks/react`):
- `<Blocks23Provider>` creates block instances from config
- Hooks like `useAuth()`, `useSearch()` access blocks from context
- Blocks are memoized to prevent recreation on re-renders

## Key Configuration Files

- `nx.json` - Nx workspace config, release settings, target defaults
- `tsconfig.base.json` - TypeScript paths for all @23blocks/* packages
- `.npmrc` - Registry config, `legacy-peer-deps=true` for Angular compatibility

## Testing Locally

```bash
# Use yalc to test in a consumer project
npm run local:publish
# Then in consumer: yalc add @23blocks/block-authentication
```

## Conventional Commits

Use these prefixes for automatic versioning:
- `feat:` - Minor version bump
- `fix:` - Patch version bump
- `feat!:` or `BREAKING CHANGE:` - Major version bump
