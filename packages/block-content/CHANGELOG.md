## 3.3.5 (2026-01-20)

### 🩹 Fixes

- resolve TypeScript errors and add PostTemplate validation support ([250d284](https://github.com/23blocks-OS/frontend-sdk/commit/250d284))

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.1.1
- Updated @23blocks/contracts to 2.1.1

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 3.3.4 (2026-01-19)

### 🚀 Features

- **content:** add series association to post create/update endpoints ([a4c4ccd](https://github.com/23blocks-OS/frontend-sdk/commit/a4c4ccd))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 3.3.3 (2026-01-16)

### 🚀 Features

- **content:** add Series feature with 16 API endpoints ([e5f54df](https://github.com/23blocks-OS/frontend-sdk/commit/e5f54df))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 3.3.2 (2026-01-16)

### 🚀 Features

- **content:** align SDK with Content API serializers and routes ([16002aa](https://github.com/23blocks-OS/frontend-sdk/commit/16002aa))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 3.3.1 (2026-01-16)

### 🩹 Fixes

- **mappers:** remove dangerous uniqueId fallback to resource.id ([e96c555](https://github.com/23blocks-OS/frontend-sdk/commit/e96c555))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 3.3.0 (2026-01-04)

### 🚀 Features

- implement LOW priority services across SDK blocks ([9296d12](https://github.com/23blocks-OS/frontend-sdk/commit/9296d12))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 3.2.0 (2026-01-04)

### 🚀 Features

- implement MEDIUM priority missing services ([9654f3b](https://github.com/23blocks-OS/frontend-sdk/commit/9654f3b))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 3.1.1 (2026-01-04)

### 🩹 Fixes

- export all types, services, and mappers from blocks ([82cc41a](https://github.com/23blocks-OS/frontend-sdk/commit/82cc41a))

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

- expand SDK API coverage for Content, Files, Forms, Geolocation blocks ([8e5c709](https://github.com/23blocks-OS/frontend-sdk/commit/8e5c709))

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

## 1.0.5 (2025-12-14)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 1.0.4
- Updated @23blocks/contracts to 1.0.4

## 1.0.4 (2025-12-14)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 1.0.3
- Updated @23blocks/contracts to 1.0.3

## 1.0.3 (2025-12-14)

### 🩹 Fixes

- **block-content:** add repository field for npm provenance ([e84e4b2](https://github.com/23blocks-OS/frontend-sdk/commit/e84e4b2))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

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

## 0.1.0 (2025-12-13)

### 🚀 Features

- 23blocks SDK initial release ([ab53789](https://github.com/23blocks-OS/frontend-sdk/commit/ab53789))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez