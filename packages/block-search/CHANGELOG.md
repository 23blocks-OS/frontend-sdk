## 6.0.3 (2026-05-27)

### 🩹 Fixes

- **@23blocks/block-search:** pin internal deps to caret ranges (no more wildcards) ([#3](https://github.com/23blocks-OS/frontend-sdk/issues/3))

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.3.4

### ❤️ Thank You

- Claude Opus 4.7 (1M context)
- Juan Pelaez

## 6.0.2 (2026-05-27)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.3.3
- Updated @23blocks/contracts to 2.4.0

## 6.0.1 (2026-03-03)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.3.2
- Updated @23blocks/contracts to 2.3.2

# 6.0.0 (2026-03-02)

This was a version bump only for @23blocks/block-search to align it with other projects, there were no code changes.

# 5.0.0 (2026-02-20)

### 🩹 Fixes

- update remaining appId references in ARCHITECTURE.md and search block JSDoc ([f64f7b8](https://github.com/23blocks-OS/frontend-sdk/commit/f64f7b8))
- ⚠️  replace appId with apiKey across all block configs to align with BlockConfig contract ([f81626d](https://github.com/23blocks-OS/frontend-sdk/commit/f81626d))
- resolve typecheck errors across all block packages ([6089324](https://github.com/23blocks-OS/frontend-sdk/commit/6089324))

### ⚠️  Breaking Changes

- replace appId with apiKey across all block configs to align with BlockConfig contract  ([f81626d](https://github.com/23blocks-OS/frontend-sdk/commit/f81626d))
  Block config no longer accepts appId. Use apiKey instead.
  Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.3.1
- Updated @23blocks/contracts to 2.3.1

### ❤️ Thank You

- Claude Opus 4.6
- Juan Pelaez

## 4.4.0 (2026-02-17)

### 🚀 Features

- add health() method to all 18 blocks for service connectivity checks ([73514a3](https://github.com/23blocks-OS/frontend-sdk/commit/73514a3))

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.3.0
- Updated @23blocks/contracts to 2.3.0

### ❤️ Thank You

- Claude Opus 4.6
- Juan Pelaez

## 4.3.0 (2026-02-08)

### 🚀 Features

- add comprehensive JSDoc documentation and llms.txt for AI agent consumption ([fd97df2](https://github.com/23blocks-OS/frontend-sdk/commit/fd97df2))

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.2.0
- Updated @23blocks/contracts to 2.2.0

### ❤️ Thank You

- Claude Opus 4.6
- Juan Pelaez

## 4.2.5 (2026-02-07)

### 🩹 Fixes

- replace misleading `id` params with `uniqueId` across SDK ([6dfc65b](https://github.com/23blocks-OS/frontend-sdk/commit/6dfc65b))

### ❤️ Thank You

- Claude Opus 4.6
- Juan Pelaez

## 4.2.4 (2026-02-07)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.1.3
- Updated @23blocks/contracts to 2.1.3

## 4.2.3 (2026-02-06)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.1.2
- Updated @23blocks/contracts to 2.1.2

## 4.2.2 (2026-01-28)

### 🩹 Fixes

- **auth,search:** use simple pagination params instead of JSON:API style ([52ac9bd](https://github.com/23blocks-OS/frontend-sdk/commit/52ac9bd))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 4.2.1 (2026-01-20)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.1.1
- Updated @23blocks/contracts to 2.1.1

## 4.2.0 (2026-01-04)

### 🚀 Features

- implement LOW priority services across SDK blocks ([9296d12](https://github.com/23blocks-OS/frontend-sdk/commit/9296d12))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 4.1.1 (2026-01-04)

### 🩹 Fixes

- export all types, services, and mappers from blocks ([82cc41a](https://github.com/23blocks-OS/frontend-sdk/commit/82cc41a))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 4.1.0 (2026-01-01)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.1.0
- Updated @23blocks/contracts to 2.1.0

## 4.0.1 (2025-12-17)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.0.1
- Updated @23blocks/contracts to 2.0.1

# 4.0.0 (2025-12-17)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.0.0
- Updated @23blocks/contracts to 2.0.0

## 3.1.0 (2025-12-15)

### 🚀 Features

- expand Products, Rewards, Search, University blocks with missing services ([47b250e](https://github.com/23blocks-OS/frontend-sdk/commit/47b250e))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

# 3.0.0 (2025-12-15)

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

# 2.0.0 (2025-12-14)

### 🚀 Features

- ⚠️  change appid header to x-api-key for API standards compliance ([bcaf889](https://github.com/23blocks-OS/frontend-sdk/commit/bcaf889))

### ⚠️  Breaking Changes

- change appid header to x-api-key for API standards compliance  ([bcaf889](https://github.com/23blocks-OS/frontend-sdk/commit/bcaf889))
  The header sent with requests changed from 'appid' to 'x-api-key'. Backend services need to accept 'x-api-key' header.
  🤖 Generated with [Claude Code](https://claude.com/claude-code)
  Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>

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

## 0.1.2 (2025-12-13)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 0.1.2
- Updated @23blocks/contracts to 0.1.2

## 0.1.1 (2025-12-13)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 0.1.1
- Updated @23blocks/contracts to 0.1.1

## 0.1.0 (2025-12-13)

### 🚀 Features

- 23blocks SDK initial release ([ab53789](https://github.com/23blocks-OS/frontend-sdk/commit/ab53789))

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 0.1.0
- Updated @23blocks/contracts to 0.1.0

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez