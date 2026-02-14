# 5.0.0 (2026-02-14)

### 🩹 Fixes

- ⚠️  **@23blocks/block-sales:** remove amount from payment intent, require orderUniqueId, strip server-managed params ([338b81d](https://github.com/23blocks-OS/frontend-sdk/commit/338b81d))

### ⚠️  Breaking Changes

- **@23blocks/block-sales:** remove amount from payment intent, require orderUniqueId, strip server-managed params  ([338b81d](https://github.com/23blocks-OS/frontend-sdk/commit/338b81d))

### ❤️ Thank You

- Claude Opus 4.6
- Juan Pelaez

# 4.0.0 (2026-02-14)

### 🩹 Fixes

- ⚠️  **@23blocks/block-sales:** align user subscription create/update params with API permitted fields ([94c8e6e](https://github.com/23blocks-OS/frontend-sdk/commit/94c8e6e))

### ⚠️  Breaking Changes

- **@23blocks/block-sales:** align user subscription create/update params with API permitted fields  ([94c8e6e](https://github.com/23blocks-OS/frontend-sdk/commit/94c8e6e))
  CreateUserSubscriptionRequest and UpdateUserSubscriptionRequest
  fields changed. subscriptionModelUniqueId is now required, data param on
  createSubscription is no longer optional.
  Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>

### ❤️ Thank You

- Claude Opus 4.6
- Juan Pelaez

## 3.6.0 (2026-02-14)

### 🚀 Features

- **@23blocks/block-sales:** add typed groupBy unions for report summary endpoints ([fc87364](https://github.com/23blocks-OS/frontend-sdk/commit/fc87364))

### ❤️ Thank You

- Claude Opus 4.6
- Juan Pelaez

## 3.5.0 (2026-02-14)

### 🚀 Features

- **@23blocks/block-sales:** add subscription maxItems/consumption and entity payment fields ([ef7d538](https://github.com/23blocks-OS/frontend-sdk/commit/ef7d538))

### ❤️ Thank You

- Claude Opus 4.6
- Juan Pelaez

## 3.4.0 (2026-02-14)

### 🚀 Features

- **@23blocks/block-sales:** add purchases service and refine customer identity types ([ca9a2c8](https://github.com/23blocks-OS/frontend-sdk/commit/ca9a2c8))

### ❤️ Thank You

- Claude Opus 4.6
- Juan Pelaez

## 3.3.2 (2026-02-13)

### 🩹 Fixes

- **@23blocks/block-sales:** use discriminated union for CreateStripeCustomerRequest identity types ([c3b73db](https://github.com/23blocks-OS/frontend-sdk/commit/c3b73db))

### ❤️ Thank You

- Claude Opus 4.6
- Juan Pelaez

## 3.3.1 (2026-02-13)

### 🩹 Fixes

- **@23blocks/block-sales:** nest Stripe request params under resource keys for Rails strong parameters ([752f3bb](https://github.com/23blocks-OS/frontend-sdk/commit/752f3bb))

### ❤️ Thank You

- Claude Opus 4.6
- Juan Pelaez

## 3.3.0 (2026-02-13)

### 🚀 Features

- **@23blocks/block-sales:** add Stripe checkout session verification, coupons, and promotion codes ([b479098](https://github.com/23blocks-OS/frontend-sdk/commit/b479098))

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

## 3.1.5 (2026-02-07)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.1.3
- Updated @23blocks/contracts to 2.1.3

## 3.1.4 (2026-02-06)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.1.2
- Updated @23blocks/contracts to 2.1.2

## 3.1.3 (2026-01-20)

### 🩹 Fixes

- resolve TypeScript errors and add PostTemplate validation support ([250d284](https://github.com/23blocks-OS/frontend-sdk/commit/250d284))

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.1.1
- Updated @23blocks/contracts to 2.1.1

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 3.1.2 (2026-01-16)

### 🩹 Fixes

- **mappers:** remove dangerous uniqueId fallback to resource.id ([e96c555](https://github.com/23blocks-OS/frontend-sdk/commit/e96c555))

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

## 2.2.0 (2025-12-15)

### 🚀 Features

- achieve full Angular/React parity across all SDK blocks ([7debcce](https://github.com/23blocks-OS/frontend-sdk/commit/7debcce))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

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