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