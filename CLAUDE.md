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

### SDK Feature Deployment Checklist

**Follow this exact checklist when adding a new feature to any `block-*` package. Do NOT skip steps. Do NOT spend time verifying the release pipeline — it works automatically.**

#### Step 1: Implement the feature in `block-*`
- Create types in `types/` with proper interfaces
- Create mapper in `mappers/` with `ResourceMapper<T>`
- Create service in `services/` with CRUD methods (PUT for updates, never PATCH)
- Wire into block factory (`*.block.ts`) — add to interface, factory return, and `resourceTypes`
- Update barrel exports: `types/index.ts`, `services/index.ts`, `mappers/index.ts`
- Update `src/index.ts` with new public exports
- **Build & verify:** `npx nx build @23blocks/block-xxx --skip-nx-cache`

#### Step 2: Update meta-packages (ALL THREE — mandatory)
Meta-packages bundle block code at build time. Publishing a new block version does NOT deliver fixes to meta-package consumers. You MUST rebuild all three:

- **Angular** (`packages/angular/`): Add getter to the relevant service (e.g., `get evaluations() { return this.ensureConfigured().evaluations; }`)
- **SDK** (`packages/sdk/src/lib/sdk.ts`): Make a real file change (update JSDoc comment) — `--allow-empty` commits do NOT work with nx release
- **React** (`packages/react/src/lib/index.ts`): Make a real file change (update JSDoc comment)
- **Build all:** `npm run build`

#### Step 3: Update documentation
- Update `llms.txt` (root) — add new sub-services to the relevant block section
- Update `packages/sdk/llms.txt` — same additions

#### Step 4: Commit with correct scopes
Commit scope MUST match the nx project name exactly (e.g., `@23blocks/block-rag`, NOT `block-rag`):

```bash
git commit -m "feat(@23blocks/block-xxx): description"
git commit -m "feat(@23blocks/angular): add xxx getter to YyyService"
git commit -m "feat(@23blocks/sdk): rebuild with xxx feature"
git commit -m "feat(@23blocks/react): rebuild with xxx feature"
git commit -m "docs: add xxx to sub-service list in llms.txt"
```

#### Step 5: Push and verify (< 2 minutes)
```bash
git push origin main
```
Then check: `gh run list --workflow=release.yml --limit 1` — confirm status is "completed" + "success". **That's it. Done. Do not dig into logs, do not download tarballs, do not inspect bundles.**

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
const auth = createAuthenticationBlock(transport, { apiKey: 'xxx' });
await auth.auth.signIn({ email, password });
```

### Framework Bindings

**Angular** (`@23blocks/angular`):
- Injectable services that expose block sub-services via typed getters (delegation pattern)
- Use `provideBlocks23({ apiKey, urls: { authentication: '...' } })` in app config
- Sub-services return Promises - use `from()` to convert to Observables if needed
- AuthenticationService is hybrid: auth-flow methods (signIn, signUp, signOut, OAuth) return Observables with token management via `tap()`, all other sub-services are delegated getters
- Built with ng-packagr (Ivy AOT partial compilation), strict mode enabled

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

## API Rules

**IMPORTANT: No PATCH HTTP method allowed.** The 23blocks backend does not support PATCH requests. Always use PUT for update operations. This applies to all services across all blocks.

```typescript
// ✗ WRONG - PATCH is not allowed
const response = await transport.patch(`/users/${id}`, { ... });

// ✓ CORRECT - Use PUT for updates
const response = await transport.put(`/users/${id}`, { ... });
```

## Conventional Commits

Use these prefixes for automatic versioning:
- `feat:` - Minor version bump
- `fix:` - Patch version bump
- `feat!:` or `BREAKING CHANGE:` - Major version bump
