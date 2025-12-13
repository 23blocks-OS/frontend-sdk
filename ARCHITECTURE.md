# 23blocks SDK Architecture

> A modular, framework-agnostic SDK for building applications with JSON:API backends.

## Table of Contents

- [Overview](#overview)
- [Design Principles](#design-principles)
- [Package Structure](#package-structure)
- [Core Packages](#core-packages)
- [Block Packages](#block-packages)
- [Framework Adapters](#framework-adapters)
- [Data Flow](#data-flow)
- [JSON:API Conventions](#jsonapi-conventions)
- [Block Independence](#block-independence)
- [Migration Strategy](#migration-strategy)
- [Provider Compatibility](#provider-compatibility)

---

## Overview

The 23blocks SDK is a **modern TypeScript SDK** designed to provide a clean, type-safe interface for applications consuming JSON:API backends. It follows a **block-based architecture** where each domain (auth, CRM, content, etc.) is an independent, composable unit.

### Key Goals

1. **Framework Agnostic** - Core SDK works with any JavaScript runtime
2. **Type Safety** - Full TypeScript support with typed domain objects
3. **Block Independence** - Each block can be used standalone or composed
4. **Provider Swappable** - Switch backends without changing application code
5. **Modern Standards** - ES2022+, Tree-shakeable, ESM-first

---

## Design Principles

### 1. JSON:API at the Edge Only

```
┌─────────────────────────────────────────────────────────────┐
│                      Your Application                        │
│                                                             │
│   Uses: User, Post, Contact (typed objects)                 │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ Typed Objects Only
                              │
┌─────────────────────────────────────────────────────────────┐
│                       23blocks SDK                          │
│                                                             │
│   Transforms JSON:API ←→ Typed Objects                      │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │ JSON:API Wire Format
                              │
┌─────────────────────────────────────────────────────────────┐
│                      Backend APIs                           │
│                                                             │
│   23blocks Rails APIs (JSON:API v1.0)                       │
└─────────────────────────────────────────────────────────────┘
```

**Rule:** Application code NEVER sees JSON:API structures. Only typed domain objects.

### 2. Promise-Based Core

The core SDK uses **Promises** for all async operations:

```typescript
// Core block - returns Promise
const user = await gateway.auth.signIn({ email, password });

// Angular adapter - converts to Observable
gatewayService.signIn({ email, password }).subscribe(user => ...);

// React hook - manages Promise lifecycle
const { data: user, loading } = useSignIn({ email, password });
```

### 3. No Framework Coupling in Core

```
❌ Core packages NEVER import:
   - @angular/*
   - react / react-dom
   - rxjs (in core)
   - @ngrx/*
   - redux

✅ Core packages ONLY use:
   - Native Promises
   - Standard TypeScript
   - @23blocks/* packages
```

### 4. Transport Abstraction

```typescript
// The SDK doesn't know HOW requests are made
interface Transport {
  request<T>(config: RequestConfig): Promise<T>;
}

// Implementations can vary
const httpTransport = createHttpTransport({ baseUrl, headers });
const mockTransport = createMockTransport(fixtures);
const graphqlTransport = createGraphQLTransport({ endpoint });
```

---

## Package Structure

```
@23blocks/
├── contracts           # Shared types, interfaces, errors
├── jsonapi-codec       # JSON:API encoding/decoding
├── transport-http      # HTTP transport implementation
│
├── block-gateway       # Auth, users, roles, companies
├── block-content       # Posts, comments, tags, categories
├── block-crm           # Contacts, accounts, opportunities
├── block-forms         # Forms, submissions, surveys
├── block-products      # Products, catalogs, inventory
├── block-search        # Entity search, indexing
├── block-files         # File uploads, attachments
├── block-rewards       # Loyalty, badges, coupons
├── block-assets        # Asset management
├── block-wallet        # Digital wallet, transactions
├── block-jarvis        # AI/RAG services
│
├── angular             # Angular adapters (Observable-based)
├── react               # React adapters (hooks-based)
│
└── sdk                 # Unified SDK entry point
```

---

## Core Packages

### @23blocks/contracts

The **smallest, most stable** package. Contains shared types used across all packages.

```typescript
// Error handling
export interface BlockError {
  code: string;
  message: string;
  status: number;
  source?: string;
  meta?: Record<string, unknown>;
}

// Pagination
export interface PageMeta {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  perPage: number;
}

export interface PageResult<T> {
  data: T[];
  meta: PageMeta;
}

// Base identity (optional)
export interface IdentityCore {
  id: string;
  uniqueId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Rules:**
- This package should RARELY change
- No JSON:API types here
- No implementation, only interfaces

### @23blocks/jsonapi-codec

The **heart of the system**. Handles all JSON:API serialization/deserialization.

```typescript
// Wire types (internal)
interface JsonApiDocument<T = unknown> {
  data: JsonApiResource<T> | JsonApiResource<T>[];
  included?: JsonApiResource[];
  meta?: JsonApiMeta;
  errors?: JsonApiError[];
}

// Decoding
function decodeOne<T>(doc: JsonApiDocument, mapper: ResourceMapper<T>): T;
function decodeMany<T>(doc: JsonApiDocument, mapper: ResourceMapper<T>): T[];
function decodePageResult<T>(doc: JsonApiDocument, mapper: ResourceMapper<T>): PageResult<T>;

// Error mapping
function blockErrorFromJsonApi(errors: JsonApiError[]): BlockError;

// Resource mappers (per block)
interface ResourceMapper<T> {
  type: string;
  map(resource: JsonApiResource, included: Map<string, JsonApiResource>): T;
}
```

**Rules:**
- ALL JSON:API knowledge lives here
- No HTTP, no blocks, no Angular/React
- Provides base utilities, blocks provide mappers

### @23blocks/transport-http

Minimal HTTP transport layer.

```typescript
interface TransportConfig {
  baseUrl: string;
  headers?: HeadersProvider;
  timeout?: number;
  interceptors?: Interceptor[];
}

interface HeadersProvider {
  (): Promise<Record<string, string>> | Record<string, string>;
}

function createHttpTransport(config: TransportConfig): Transport;

// Transport interface
interface Transport {
  get<T>(path: string, options?: RequestOptions): Promise<T>;
  post<T>(path: string, body: unknown, options?: RequestOptions): Promise<T>;
  patch<T>(path: string, body: unknown, options?: RequestOptions): Promise<T>;
  delete<T>(path: string, options?: RequestOptions): Promise<T>;
}
```

**Rules:**
- Uses native `fetch` or configurable client
- Handles baseUrl, headers, errors
- Maps non-2xx to BlockError
- NO knowledge of blocks or models

---

## Block Packages

Each block follows the same structure:

```
packages/block-gateway/
├── src/
│   ├── index.ts              # Public exports
│   ├── gateway.block.ts      # Block factory
│   ├── types/                # Domain types
│   │   ├── user.ts
│   │   ├── company.ts
│   │   └── auth.ts
│   ├── mappers/              # JSON:API → Domain mappers
│   │   ├── user.mapper.ts
│   │   └── company.mapper.ts
│   └── services/             # Domain operations
│       ├── auth.service.ts
│       └── users.service.ts
├── package.json
└── tsconfig.json
```

### Block Factory Pattern

```typescript
// packages/block-gateway/src/gateway.block.ts
import { Transport } from '@23blocks/transport-http';
import { createAuthService } from './services/auth.service';
import { createUsersService } from './services/users.service';

export interface GatewayBlockConfig {
  appId: string;
  tenantId?: string;
}

export function createGatewayBlock(transport: Transport, config: GatewayBlockConfig) {
  return {
    auth: createAuthService(transport, config),
    users: createUsersService(transport, config),
    roles: createRolesService(transport, config),
    companies: createCompaniesService(transport, config),
  };
}

export type GatewayBlock = ReturnType<typeof createGatewayBlock>;
```

### Service Pattern

```typescript
// packages/block-gateway/src/services/auth.service.ts
import { Transport } from '@23blocks/transport-http';
import { decodeOne } from '@23blocks/jsonapi-codec';
import { User, SignInRequest, SignInResponse } from '../types';
import { userMapper } from '../mappers/user.mapper';

export function createAuthService(transport: Transport, config: GatewayBlockConfig) {
  return {
    async signIn(request: SignInRequest): Promise<SignInResponse> {
      const response = await transport.post('/auth/sign_in', request);
      return {
        user: decodeOne(response, userMapper),
        token: response.meta?.token,
      };
    },

    async signUp(request: SignUpRequest): Promise<User> {
      const response = await transport.post('/auth', request);
      return decodeOne(response, userMapper);
    },

    async signOut(): Promise<void> {
      await transport.delete('/auth/sign_out');
    },

    async getCurrentUser(): Promise<User> {
      const response = await transport.get('/auth/validate_token');
      return decodeOne(response, userMapper);
    },
  };
}
```

### Mapper Pattern

```typescript
// packages/block-gateway/src/mappers/user.mapper.ts
import { ResourceMapper, JsonApiResource } from '@23blocks/jsonapi-codec';
import { User } from '../types';

export const userMapper: ResourceMapper<User> = {
  type: 'User',

  map(resource: JsonApiResource, included: Map<string, JsonApiResource>): User {
    const attrs = resource.attributes;

    return {
      id: resource.id,
      email: attrs.email,
      name: attrs.name,
      username: attrs.username,
      uniqueId: attrs.unique_id,
      status: attrs.status,
      roleId: attrs.role_id,
      lastSignInAt: attrs.last_sign_in_at ? new Date(attrs.last_sign_in_at) : null,
      confirmedAt: attrs.confirmed_at ? new Date(attrs.confirmed_at) : null,
      createdAt: new Date(attrs.created_at),
      updatedAt: new Date(attrs.updated_at),

      // Relationships (resolved from included)
      role: resolveRelationship(resource, 'role', included, roleMapper),
      avatar: resolveRelationship(resource, 'user_avatar', included, avatarMapper),
      profile: resolveRelationship(resource, 'user_profile', included, profileMapper),
    };
  },
};
```

---

## Framework Adapters

### @23blocks/angular

Provides Angular-specific integration:

```typescript
// Angular module with DI
@NgModule({
  providers: [
    {
      provide: GATEWAY_BLOCK,
      useFactory: (http: HttpClient) => {
        const transport = createAngularTransport(http);
        return createGatewayBlock(transport, config);
      },
      deps: [HttpClient],
    },
  ],
})
export class GatewayModule {}

// Service wrapper (Observable-based)
@Injectable({ providedIn: 'root' })
export class GatewayService {
  constructor(@Inject(GATEWAY_BLOCK) private block: GatewayBlock) {}

  signIn(request: SignInRequest): Observable<SignInResponse> {
    return from(this.block.auth.signIn(request));
  }

  // ... other methods
}
```

### @23blocks/react

Provides React-specific integration:

```typescript
// Context provider
export function GatewayProvider({ children, config }: GatewayProviderProps) {
  const block = useMemo(() => {
    const transport = createHttpTransport(config.transport);
    return createGatewayBlock(transport, config.block);
  }, [config]);

  return (
    <GatewayContext.Provider value={block}>
      {children}
    </GatewayContext.Provider>
  );
}

// Hooks
export function useSignIn() {
  const block = useGatewayBlock();
  return useMutation({
    mutationFn: (request: SignInRequest) => block.auth.signIn(request),
  });
}

export function useCurrentUser() {
  const block = useGatewayBlock();
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => block.auth.getCurrentUser(),
  });
}
```

---

## Data Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                         Application                               │
│                                                                  │
│   const { data: user } = useSignIn({ email, password });         │
│                          ▲                                        │
│                          │ User (typed object)                    │
└──────────────────────────┼───────────────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────────┐
│                    Framework Adapter                              │
│                                                                  │
│   Observable<User> / useQuery<User>                               │
│                          ▲                                        │
│                          │ Promise<User>                          │
└──────────────────────────┼───────────────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────────┐
│                      Block Service                                │
│                                                                  │
│   signIn(request) → decodeOne(response, userMapper)              │
│                          ▲                                        │
│                          │ JsonApiDocument                        │
└──────────────────────────┼───────────────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────────┐
│                       Transport                                   │
│                                                                  │
│   POST /auth/sign_in → JSON:API Response                         │
│                          ▲                                        │
│                          │ HTTP                                   │
└──────────────────────────┼───────────────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────────┐
│                     Backend API                                   │
│                                                                  │
│   Rails + FastJsonapi / JSONAPI::Serializer                      │
└──────────────────────────────────────────────────────────────────┘
```

---

## JSON:API Conventions

The SDK expects backends to follow these JSON:API conventions:

### Resource Types

| Block    | Resource Types                                         |
|----------|-------------------------------------------------------|
| Gateway  | User, Role, Company, CompanyBlock, ApiKey, Permission |
| Content  | Post, Comment, Tag, Category, PostVersion             |
| CRM      | Contact, Account, Lead, Opportunity, Meeting          |
| Forms    | Form, FormSubmission, Survey, FormInstance            |
| Products | Product, Category, Brand, Catalog, Cart               |
| Search   | Entity, SearchResult                                  |
| Files    | File, Attachment, Folder                              |
| Rewards  | Badge, Coupon, LoyaltyTier, Reward                    |

### Pagination

```json
{
  "data": [...],
  "meta": {
    "current_page": 1,
    "total_pages": 10,
    "total_count": 100,
    "per_page": 10
  }
}
```

### Filtering

```
GET /posts?filter[status]=published&filter[user_id]=123
```

### Sorting

```
GET /posts?sort=-created_at,title
```

### Including Relationships

```
GET /users/1?include=role,user_avatar,user_profile
```

### Error Format

```json
{
  "errors": [
    {
      "code": "validation_error",
      "status": "422",
      "title": "Invalid Attribute",
      "detail": "Email has already been taken",
      "source": { "pointer": "/data/attributes/email" }
    }
  ]
}
```

---

## Block Independence

**Each block is fully independent and can be used standalone.**

### Standalone Usage

```typescript
// Use only the CRM block
import { createCrmBlock } from '@23blocks/block-crm';
import { createHttpTransport } from '@23blocks/transport-http';

const transport = createHttpTransport({
  baseUrl: 'https://api.example.com/crm',
  headers: () => ({ Authorization: `Bearer ${token}` }),
});

const crm = createCrmBlock(transport, { appId: 'my-app' });

// Use CRM independently
const contacts = await crm.contacts.list({ page: 1 });
```

### Composed Usage

```typescript
// Use multiple blocks together
import { createSdk } from '@23blocks/sdk';

const sdk = createSdk({
  transport: { baseUrl: 'https://api.example.com' },
  blocks: {
    gateway: { appId: 'my-app' },
    crm: { appId: 'my-app' },
    content: { appId: 'my-app' },
  },
});

// Unified access
const user = await sdk.gateway.auth.getCurrentUser();
const contacts = await sdk.crm.contacts.list();
const posts = await sdk.content.posts.list();
```

### Block Installation

```bash
# Install only what you need
npm install @23blocks/contracts @23blocks/transport-http @23blocks/block-gateway

# Or install the full SDK
npm install @23blocks/sdk
```

---

## Migration Strategy

For existing projects using the internal Nx libraries:

### Phase 1: Install SDK Packages

```bash
npm install @23blocks/block-gateway @23blocks/angular
```

### Phase 2: Update Imports

```typescript
// Before
import { GatewayService } from '@web-container/gateway';

// After
import { GatewayService } from '@23blocks/angular/gateway';
```

### Phase 3: Remove Path Mappings

```json
// tsconfig.json - Remove these
{
  "paths": {
    "@web-container/gateway": ["libs/23blocks/gateway/src/index.ts"]
  }
}
```

### Phase 4: Remove Internal Libraries

```bash
# Once all imports are updated
nx g @nx/workspace:remove gateway
```

**Key principle:** Migrate one block at a time, not everything at once.

---

## Provider Compatibility

The SDK is designed to work with **any JSON:API compliant backend**.

### Default Provider (23blocks Rails)

```typescript
const sdk = createSdk({
  transport: {
    baseUrl: 'https://api.23blocks.com',
    headers: () => ({
      'Authorization': `Bearer ${token}`,
      'appid': appId,
    }),
  },
});
```

### Custom Provider

```typescript
const sdk = createSdk({
  transport: {
    baseUrl: 'https://api.custom-provider.com',
    headers: () => ({
      'Authorization': `Bearer ${token}`,
      'X-API-Key': apiKey,
    }),
  },
  // Override specific mappers if needed
  mappers: {
    user: customUserMapper,
  },
});
```

### Provider Compliance Testing

```bash
# Future: CLI tool to verify backend compatibility
npx @23blocks/provider-compliance --baseUrl https://api.vendor.com --blocks gateway,crm
```

---

## Summary

| Aspect | Decision |
|--------|----------|
| Wire Format | JSON:API v1.0 |
| Public API | Typed objects only |
| Async Model | Promise (core), Observable/hooks (adapters) |
| Framework | Agnostic core, Angular/React adapters |
| Transport | Abstracted, swappable |
| Blocks | Independent, composable |
| Distribution | npm, open source |

This architecture ensures:

- **Modern TypeScript** - Full type safety
- **No Redux gravity** - Clean Promise-based API
- **No Angular bleed** - Framework code in adapters only
- **No React assumptions** - Works anywhere
- **JSON:API enforced** - At the edge, invisible to apps
- **Clean replacement** - Easy migration path
- **Open-source friendly** - Clear boundaries, documented conventions
- **Future-proof** - Provider swappable, extensible

---

*This document is the source of truth for 23blocks SDK architecture decisions.*
