## 3.1.0 (2025-12-15)

### 🧱 Updated Dependencies

- Updated @23blocks/block-authentication to 3.1.0
- Updated @23blocks/block-crm to 2.1.0

## 3.0.4 (2025-12-15)

### 🧱 Updated Dependencies

- Updated @23blocks/block-authentication to 3.0.3

## 3.0.3 (2025-12-15)

### 🧱 Updated Dependencies

- Updated @23blocks/block-authentication to 3.0.2

## 3.0.2 (2025-12-15)

### 🧱 Updated Dependencies

- Updated @23blocks/block-authentication to 3.0.1
- Updated @23blocks/transport-http to 2.0.2

## 3.0.1 (2025-12-15)

### 🧱 Updated Dependencies

- Updated @23blocks/transport-http to 2.0.1

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

- Updated @23blocks/block-authentication to 3.0.0
- Updated @23blocks/block-conversations to 2.0.0
- Updated @23blocks/block-geolocation to 2.0.0
- Updated @23blocks/block-onboarding to 2.0.0
- Updated @23blocks/block-university to 2.0.0
- Updated @23blocks/block-campaigns to 2.0.0
- Updated @23blocks/block-products to 2.0.0
- Updated @23blocks/transport-http to 2.0.0
- Updated @23blocks/block-company to 2.0.0
- Updated @23blocks/block-content to 2.0.0
- Updated @23blocks/block-rewards to 2.0.0
- Updated @23blocks/jsonapi-codec to 2.0.0
- Updated @23blocks/block-assets to 2.0.0
- Updated @23blocks/block-jarvis to 2.0.0
- Updated @23blocks/block-search to 3.0.0
- Updated @23blocks/block-wallet to 2.0.0
- Updated @23blocks/block-files to 2.0.0
- Updated @23blocks/block-forms to 2.0.0
- Updated @23blocks/block-sales to 2.0.0
- Updated @23blocks/block-crm to 2.0.0

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

# 2.0.0 (2025-12-14)

### 🧱 Updated Dependencies

- Updated @23blocks/block-authentication to 2.0.0
- Updated @23blocks/block-search to 2.0.0

## 1.1.3 (2025-12-14)

### 🧱 Updated Dependencies

- Updated @23blocks/block-authentication to 1.0.5
- Updated @23blocks/block-conversations to 1.0.4
- Updated @23blocks/block-geolocation to 1.0.4
- Updated @23blocks/block-onboarding to 1.0.4
- Updated @23blocks/block-university to 1.0.4
- Updated @23blocks/block-campaigns to 1.0.4
- Updated @23blocks/block-products to 1.0.4
- Updated @23blocks/transport-http to 1.0.4
- Updated @23blocks/block-company to 1.0.4
- Updated @23blocks/block-content to 1.0.5
- Updated @23blocks/block-rewards to 1.0.4
- Updated @23blocks/jsonapi-codec to 1.0.4
- Updated @23blocks/block-assets to 1.0.4
- Updated @23blocks/block-jarvis to 1.0.4
- Updated @23blocks/block-search to 1.0.4
- Updated @23blocks/block-wallet to 1.0.4
- Updated @23blocks/block-files to 1.0.4
- Updated @23blocks/block-forms to 1.0.4
- Updated @23blocks/block-sales to 1.0.4
- Updated @23blocks/block-crm to 1.0.4
- Updated @23blocks/contracts to 1.0.4

## 1.1.2 (2025-12-14)

### 🧱 Updated Dependencies

- Updated @23blocks/block-authentication to 1.0.4
- Updated @23blocks/block-conversations to 1.0.3
- Updated @23blocks/block-geolocation to 1.0.3
- Updated @23blocks/block-onboarding to 1.0.3
- Updated @23blocks/block-university to 1.0.3
- Updated @23blocks/block-campaigns to 1.0.3
- Updated @23blocks/block-products to 1.0.3
- Updated @23blocks/transport-http to 1.0.3
- Updated @23blocks/block-company to 1.0.3
- Updated @23blocks/block-content to 1.0.4
- Updated @23blocks/block-rewards to 1.0.3
- Updated @23blocks/jsonapi-codec to 1.0.3
- Updated @23blocks/block-assets to 1.0.3
- Updated @23blocks/block-jarvis to 1.0.3
- Updated @23blocks/block-search to 1.0.3
- Updated @23blocks/block-wallet to 1.0.3
- Updated @23blocks/block-files to 1.0.3
- Updated @23blocks/block-forms to 1.0.3
- Updated @23blocks/block-sales to 1.0.3
- Updated @23blocks/block-crm to 1.0.3
- Updated @23blocks/contracts to 1.0.3

## 1.1.1 (2025-12-14)

### 🧱 Updated Dependencies

- Updated @23blocks/block-content to 1.0.3

## 1.1.0 (2025-12-14)

### 🚀 Features

- per-service URL configuration with no fallback behavior ([e6cabce](https://github.com/23blocks-OS/frontend-sdk/commit/e6cabce))

### 🧱 Updated Dependencies

- Updated @23blocks/block-authentication to 1.0.3
- Updated @23blocks/block-conversations to 1.0.2
- Updated @23blocks/block-geolocation to 1.0.2
- Updated @23blocks/block-onboarding to 1.0.2
- Updated @23blocks/block-university to 1.0.2
- Updated @23blocks/block-campaigns to 1.0.2
- Updated @23blocks/block-products to 1.0.2
- Updated @23blocks/transport-http to 1.0.2
- Updated @23blocks/block-company to 1.0.2
- Updated @23blocks/block-content to 1.0.2
- Updated @23blocks/block-rewards to 1.0.2
- Updated @23blocks/jsonapi-codec to 1.0.2
- Updated @23blocks/block-assets to 1.0.2
- Updated @23blocks/block-jarvis to 1.0.2
- Updated @23blocks/block-search to 1.0.2
- Updated @23blocks/block-wallet to 1.0.2
- Updated @23blocks/block-files to 1.0.2
- Updated @23blocks/block-forms to 1.0.2
- Updated @23blocks/block-sales to 1.0.2
- Updated @23blocks/block-crm to 1.0.2
- Updated @23blocks/contracts to 1.0.2

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 1.0.3 (2025-12-14)

### 🚀 Features

- ⚠️  **sdk,react,angular:** add per-service URL support for microservices ([a0cb4f2](https://github.com/23blocks-OS/frontend-sdk/commit/a0cb4f2))

### ⚠️  Breaking Changes

- **sdk,react,angular:** add per-service URL support for microservices  ([a0cb4f2](https://github.com/23blocks-OS/frontend-sdk/commit/a0cb4f2))
  `baseUrl` replaced with `urls: { authentication: '...' }`
  🤖 Generated with [Claude Code](https://claude.com/claude-code)
  Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 1.0.2 (2025-12-14)

### 🧱 Updated Dependencies

- Updated @23blocks/block-authentication to 1.0.2
- Updated @23blocks/block-conversations to 1.0.1
- Updated @23blocks/block-geolocation to 1.0.1
- Updated @23blocks/block-onboarding to 1.0.1
- Updated @23blocks/block-university to 1.0.1
- Updated @23blocks/block-campaigns to 1.0.1
- Updated @23blocks/block-products to 1.0.1
- Updated @23blocks/transport-http to 1.0.1
- Updated @23blocks/block-company to 1.0.1
- Updated @23blocks/block-content to 1.0.1
- Updated @23blocks/block-rewards to 1.0.1
- Updated @23blocks/jsonapi-codec to 1.0.1
- Updated @23blocks/block-assets to 1.0.1
- Updated @23blocks/block-jarvis to 1.0.1
- Updated @23blocks/block-search to 1.0.1
- Updated @23blocks/block-wallet to 1.0.1
- Updated @23blocks/block-files to 1.0.1
- Updated @23blocks/block-forms to 1.0.1
- Updated @23blocks/block-sales to 1.0.1
- Updated @23blocks/block-crm to 1.0.1
- Updated @23blocks/contracts to 1.0.1

## 1.0.1 (2025-12-13)

### 🧱 Updated Dependencies

- Updated @23blocks/block-authentication to 1.0.1

# 1.0.0 (2025-12-13)

### 🚀 Features

- ⚠️  add simplified client API with automatic token management ([0b910c6](https://github.com/23blocks-OS/frontend-sdk/commit/0b910c6))

### ⚠️  Breaking Changes

- add simplified client API with automatic token management  ([0b910c6](https://github.com/23blocks-OS/frontend-sdk/commit/0b910c6))
  None - new APIs are additive, existing APIs unchanged
  🤖 Generated with [Claude Code](https://claude.com/claude-code)
  Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>

### 🧱 Updated Dependencies

- Updated @23blocks/block-authentication to 1.0.0
- Updated @23blocks/block-conversations to 1.0.0
- Updated @23blocks/block-geolocation to 1.0.0
- Updated @23blocks/block-onboarding to 1.0.0
- Updated @23blocks/block-university to 1.0.0
- Updated @23blocks/block-campaigns to 1.0.0
- Updated @23blocks/block-products to 1.0.0
- Updated @23blocks/transport-http to 1.0.0
- Updated @23blocks/block-company to 1.0.0
- Updated @23blocks/block-content to 1.0.0
- Updated @23blocks/block-rewards to 1.0.0
- Updated @23blocks/jsonapi-codec to 1.0.0
- Updated @23blocks/block-assets to 1.0.0
- Updated @23blocks/block-jarvis to 1.0.0
- Updated @23blocks/block-search to 1.0.0
- Updated @23blocks/block-wallet to 1.0.0
- Updated @23blocks/block-files to 1.0.0
- Updated @23blocks/block-forms to 1.0.0
- Updated @23blocks/block-sales to 1.0.0
- Updated @23blocks/block-crm to 1.0.0
- Updated @23blocks/contracts to 1.0.0

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 0.2.1 (2025-12-13)

### 🧱 Updated Dependencies

- Updated @23blocks/block-authentication to 0.1.2
- Updated @23blocks/block-conversations to 0.2.1
- Updated @23blocks/block-geolocation to 0.2.1
- Updated @23blocks/block-onboarding to 0.2.1
- Updated @23blocks/block-university to 0.2.1
- Updated @23blocks/block-campaigns to 0.2.1
- Updated @23blocks/block-products to 0.2.1
- Updated @23blocks/transport-http to 0.1.2
- Updated @23blocks/block-company to 0.2.1
- Updated @23blocks/block-content to 0.2.1
- Updated @23blocks/block-rewards to 0.2.1
- Updated @23blocks/jsonapi-codec to 0.1.2
- Updated @23blocks/block-assets to 0.2.1
- Updated @23blocks/block-jarvis to 0.2.1
- Updated @23blocks/block-search to 0.1.2
- Updated @23blocks/block-wallet to 0.2.1
- Updated @23blocks/block-files to 0.2.1
- Updated @23blocks/block-forms to 0.2.1
- Updated @23blocks/block-sales to 0.2.1
- Updated @23blocks/block-crm to 0.2.1
- Updated @23blocks/contracts to 0.1.2

## 0.2.0 (2025-12-13)

### 🚀 Features

- add all block packages with React and Angular bindings ([bbeecf7](https://github.com/23blocks-OS/frontend-sdk/commit/bbeecf7))

### 🧱 Updated Dependencies

- Updated @23blocks/block-authentication to 0.1.1
- Updated @23blocks/block-conversations to 0.2.0
- Updated @23blocks/block-geolocation to 0.2.0
- Updated @23blocks/block-onboarding to 0.2.0
- Updated @23blocks/block-university to 0.2.0
- Updated @23blocks/block-campaigns to 0.2.0
- Updated @23blocks/block-products to 0.2.0
- Updated @23blocks/transport-http to 0.1.1
- Updated @23blocks/block-company to 0.2.0
- Updated @23blocks/block-content to 0.2.0
- Updated @23blocks/block-rewards to 0.2.0
- Updated @23blocks/jsonapi-codec to 0.1.1
- Updated @23blocks/block-assets to 0.2.0
- Updated @23blocks/block-jarvis to 0.2.0
- Updated @23blocks/block-search to 0.1.1
- Updated @23blocks/block-wallet to 0.2.0
- Updated @23blocks/block-files to 0.2.0
- Updated @23blocks/block-forms to 0.2.0
- Updated @23blocks/block-sales to 0.2.0
- Updated @23blocks/block-crm to 0.2.0
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