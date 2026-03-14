## 5.3.0 (2026-03-14)

### 🚀 Features

- **@23blocks/block-jarvis:** add prompt tests, agent tests, templates, company keys, LLM providers services ([c8c0cfd](https://github.com/23blocks-OS/frontend-sdk/commit/c8c0cfd))

### ❤️ Thank You

- Claude Opus 4.6
- Juan Pelaez

## 5.2.0 (2026-03-14)

### 🚀 Features

- **@23blocks/block-jarvis:** export missing types, services, and mappers for tools, conditions, and transitions ([7733d1a](https://github.com/23blocks-OS/frontend-sdk/commit/7733d1a))

### ❤️ Thank You

- Claude Opus 4.6
- Juan Pelaez

## 5.1.0 (2026-03-05)

### 🚀 Features

- **@23blocks/block-jarvis:** add analytics service with 8 dashboard endpoints ([3738d58](https://github.com/23blocks-OS/frontend-sdk/commit/3738d58))

### ❤️ Thank You

- Claude Opus 4.6
- Juan Pelaez

## 5.0.1 (2026-03-03)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.3.2
- Updated @23blocks/contracts to 2.3.2

# 5.0.0 (2026-02-20)

### 🚀 Features

- ⚠️  **@23blocks/block-jarvis:** add SSE streaming support with dedicated domain routing ([748482b](https://github.com/23blocks-OS/frontend-sdk/commit/748482b))

### 🩹 Fixes

- ⚠️  replace appId with apiKey across all block configs to align with BlockConfig contract ([f81626d](https://github.com/23blocks-OS/frontend-sdk/commit/f81626d))
- resolve typecheck errors across all block packages ([6089324](https://github.com/23blocks-OS/frontend-sdk/commit/6089324))

### ⚠️  Breaking Changes

- replace appId with apiKey across all block configs to align with BlockConfig contract  ([f81626d](https://github.com/23blocks-OS/frontend-sdk/commit/f81626d))
  Block config no longer accepts appId. Use apiKey instead.
  Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
- **@23blocks/block-jarvis:** add SSE streaming support with dedicated domain routing  ([748482b](https://github.com/23blocks-OS/frontend-sdk/commit/748482b))
  entities.sendMessageStream() now returns
  Promise<ReadableStream<string>> instead of Promise<unknown>
  Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.3.1
- Updated @23blocks/contracts to 2.3.1

### ❤️ Thank You

- Claude Opus 4.6
- Juan Pelaez

# 4.0.0 (2026-02-18)

### 🚀 Features

- ⚠️  **@23blocks/block-jarvis:** rewrite all types, services, and mappers to match API strong params 1:1 ([de37ab1](https://github.com/23blocks-OS/frontend-sdk/commit/de37ab1))

### ⚠️  Breaking Changes

- **@23blocks/block-jarvis:** rewrite all types, services, and mappers to match API strong params 1:1  ([de37ab1](https://github.com/23blocks-OS/frontend-sdk/commit/de37ab1))
  Every type, mapper, and service in block-jarvis has been
  rewritten to match the Rails API strong params exactly. This removes
  fabricated fields (payload, IdentityCore, EntityStatus), adds missing
  fields, fixes request body shapes, and adds 5 new services (tools,
  agent-tools, agent-tool-assignments, conditions, step-transitions).
  Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>

### ❤️ Thank You

- Claude Opus 4.6
- Juan Pelaez

## 3.3.0 (2026-02-17)

### 🚀 Features

- add health() method to all 18 blocks for service connectivity checks ([73514a3](https://github.com/23blocks-OS/frontend-sdk/commit/73514a3))

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.3.0
- Updated @23blocks/contracts to 2.3.0

### ❤️ Thank You

- Claude Opus 4.6
- Juan Pelaez

## 3.2.0 (2026-02-08)

### 🚀 Features

- add comprehensive JSDoc documentation and llms.txt for AI agent consumption ([fd97df2](https://github.com/23blocks-OS/frontend-sdk/commit/fd97df2))

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.2.0
- Updated @23blocks/contracts to 2.2.0

### ❤️ Thank You

- Claude Opus 4.6
- Juan Pelaez

## 3.1.7 (2026-02-07)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.1.3
- Updated @23blocks/contracts to 2.1.3

## 3.1.6 (2026-02-06)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.1.2
- Updated @23blocks/contracts to 2.1.2

## 3.1.5 (2026-01-20)

### 🩹 Fixes

- resolve TypeScript errors and add PostTemplate validation support ([250d284](https://github.com/23blocks-OS/frontend-sdk/commit/250d284))

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.1.1
- Updated @23blocks/contracts to 2.1.1

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 3.1.4 (2026-01-18)

### 🚀 Features

- **jarvis:** add nested placeholder support and pipe transforms for prompt rendering ([e1b1999](https://github.com/23blocks-OS/frontend-sdk/commit/e1b1999))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 3.1.3 (2026-01-16)

### 🚀 Features

- **jarvis:** add prompt template system and render endpoint ([22fa1a4](https://github.com/23blocks-OS/frontend-sdk/commit/22fa1a4))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 3.1.2 (2026-01-16)

### 🚀 Features

- **jarvis:** expand Prompt type with all API fields ([da90f89](https://github.com/23blocks-OS/frontend-sdk/commit/da90f89))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 3.1.1 (2026-01-16)

### 🩹 Fixes

- **mappers:** remove dangerous uniqueId fallback to resource.id ([e96c555](https://github.com/23blocks-OS/frontend-sdk/commit/e96c555))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 3.1.0 (2026-01-01)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.1.0
- Updated @23blocks/contracts to 2.1.0

## 3.0.1 (2025-12-17)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.0.1
- Updated @23blocks/contracts to 2.0.1

# 3.0.0 (2025-12-17)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.0.0
- Updated @23blocks/contracts to 2.0.0

## 2.1.0 (2025-12-15)

### 🚀 Features

- add missing API services across 6 blocks ([cae5b8c](https://github.com/23blocks-OS/frontend-sdk/commit/cae5b8c))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

# 2.0.0 (2025-12-15)

### 🩹 Fixes

- ⚠️  wrap all API request parameters with correct Rails object keys ([192ad70](https://github.com/23blocks-OS/frontend-sdk/commit/192ad70))

### ⚠️  Breaking Changes

- wrap all API request parameters with correct Rails object keys  ([192ad70](https://github.com/23blocks-OS/frontend-sdk/commit/192ad70))
  All service methods now correctly wrap request bodies
  with Rails-expected parameter keys (e.g., `user:`, `contact:`, `order:`).
  This fixes the critical issue where API requests were failing validation
  because parameters were sent flat instead of wrapped.
  Affected blocks:
  - block-authentication: auth, users, guests, apps, subscriptions, api-keys, roles
  - block-crm: contacts, accounts, leads, opportunities, meetings, quotes
  - block-company: companies, departments, teams, team-members, quarters
  - block-content: posts, comments, categories, tags
  - block-products: products, cart, catalog
  - block-sales: orders, order-details, payments, subscriptions
  - block-conversations: messages, groups, draft-messages, notifications
  - block-wallet: wallets, authorization-codes
  - block-files: storage-files, entity-files, file-schemas
  - block-forms: forms, form-schemas, form-sets, form-instances
  - block-assets: assets, asset-events, asset-audits
  - block-campaigns: campaigns, campaign-media, audiences, landing-pages
  - block-geolocation: locations, addresses, areas, regions, routes, bookings, premises
  - block-rewards: rewards, coupons, loyalty, badges
  - block-onboarding: onboardings, flows, user-journeys, user-identities
  - block-university: courses, lessons, enrollments, assignments, submissions
  - block-jarvis: agents, prompts, workflows, conversations
  Consumer API remains unchanged - this is an internal fix.
  🤖 Generated with [Claude Code](https://claude.com/claude-code)
  Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 2.0.0

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 1.0.4 (2025-12-14)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 1.0.4
- Updated @23blocks/contracts to 1.0.4

## 1.0.3 (2025-12-14)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 1.0.3
- Updated @23blocks/contracts to 1.0.3

## 1.0.2 (2025-12-14)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 1.0.2
- Updated @23blocks/contracts to 1.0.2

## 1.0.1 (2025-12-14)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 1.0.1
- Updated @23blocks/contracts to 1.0.1

# 1.0.0 (2025-12-13)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 1.0.0
- Updated @23blocks/contracts to 1.0.0

## 0.2.1 (2025-12-13)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 0.1.2
- Updated @23blocks/contracts to 0.1.2

## 0.2.0 (2025-12-13)

### 🚀 Features

- add all block packages with React and Angular bindings ([bbeecf7](https://github.com/23blocks-OS/frontend-sdk/commit/bbeecf7))

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 0.1.1
- Updated @23blocks/contracts to 0.1.1

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez