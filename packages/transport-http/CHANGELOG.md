## 2.0.2 (2025-12-15)

### 🩹 Fixes

- add confirmSuccessUrl to SignUpRequest and improve error handling ([bf1ad46](https://github.com/23blocks-OS/frontend-sdk/commit/bf1ad46))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 2.0.1 (2025-12-15)

### 🩹 Fixes

- use application/json Content-Type for Rails compatibility ([e81794a](https://github.com/23blocks-OS/frontend-sdk/commit/e81794a))

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

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 1.0.4 (2025-12-14)

### 🧱 Updated Dependencies

- Updated @23blocks/contracts to 1.0.4

## 1.0.3 (2025-12-14)

### 🧱 Updated Dependencies

- Updated @23blocks/contracts to 1.0.3

## 1.0.2 (2025-12-14)

### 🧱 Updated Dependencies

- Updated @23blocks/contracts to 1.0.2

## 1.0.1 (2025-12-14)

### 🧱 Updated Dependencies

- Updated @23blocks/contracts to 1.0.1

# 1.0.0 (2025-12-13)

### 🚀 Features

- ⚠️  add simplified client API with automatic token management ([0b910c6](https://github.com/23blocks-OS/frontend-sdk/commit/0b910c6))

### ⚠️  Breaking Changes

- add simplified client API with automatic token management  ([0b910c6](https://github.com/23blocks-OS/frontend-sdk/commit/0b910c6))
  None - new APIs are additive, existing APIs unchanged
  🤖 Generated with [Claude Code](https://claude.com/claude-code)
  Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>

### 🧱 Updated Dependencies

- Updated @23blocks/contracts to 1.0.0

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 0.1.2 (2025-12-13)

### 🧱 Updated Dependencies

- Updated @23blocks/contracts to 0.1.2

## 0.1.1 (2025-12-13)

### 🧱 Updated Dependencies

- Updated @23blocks/contracts to 0.1.1

## 0.1.0 (2025-12-13)

### 🚀 Features

- 23blocks SDK initial release ([ab53789](https://github.com/23blocks-OS/frontend-sdk/commit/ab53789))

### 🧱 Updated Dependencies

- Updated @23blocks/contracts to 0.1.0

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez