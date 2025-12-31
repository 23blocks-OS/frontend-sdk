## 6.0.1 (2025-12-31)

### 🧱 Updated Dependencies

- Updated @23blocks/block-authentication to 6.0.1
- Updated @23blocks/block-forms to 3.0.2

# 6.0.0 (2025-12-17)

### 🩹 Fixes

- ⚠️  use x-api-key header for API standards compliance ([8206652](https://github.com/23blocks-OS/frontend-sdk/commit/8206652))

### ⚠️  Breaking Changes

- use x-api-key header for API standards compliance  ([8206652](https://github.com/23blocks-OS/frontend-sdk/commit/8206652))
  The HTTP header sent with API requests changed from
  'api-key' to 'x-api-key'. Backend services need to accept 'x-api-key' header.
  🤖 Generated with [Claude Code](https://claude.com/claude-code)
  Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>

### 🧱 Updated Dependencies

- Updated @23blocks/block-authentication to 6.0.0

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 5.0.1 (2025-12-17)

### 🧱 Updated Dependencies

- Updated @23blocks/block-authentication to 5.0.1
- Updated @23blocks/block-conversations to 3.0.1
- Updated @23blocks/block-geolocation to 3.0.1
- Updated @23blocks/block-onboarding to 3.0.1
- Updated @23blocks/block-university to 3.0.1
- Updated @23blocks/block-campaigns to 3.0.1
- Updated @23blocks/block-products to 3.0.1
- Updated @23blocks/transport-http to 3.0.1
- Updated @23blocks/block-company to 3.0.1
- Updated @23blocks/block-content to 3.0.1
- Updated @23blocks/block-rewards to 3.0.1
- Updated @23blocks/block-assets to 3.0.1
- Updated @23blocks/block-jarvis to 3.0.1
- Updated @23blocks/block-search to 4.0.1
- Updated @23blocks/block-wallet to 3.0.1
- Updated @23blocks/block-files to 3.0.1
- Updated @23blocks/block-forms to 3.0.1
- Updated @23blocks/block-sales to 3.0.1
- Updated @23blocks/block-crm to 3.0.1
- Updated @23blocks/contracts to 2.0.1

# 5.0.0 (2025-12-17)

### 🚀 Features

- ⚠️  rename appId to apiKey and add test infrastructure ([fb02c62](https://github.com/23blocks-OS/frontend-sdk/commit/fb02c62))

### ⚠️  Breaking Changes

- rename appId to apiKey and add test infrastructure  ([fb02c62](https://github.com/23blocks-OS/frontend-sdk/commit/fb02c62))
  The configuration property 'appId' has been renamed to 'apiKey' across all packages. The HTTP header sent to the API changed from 'appid' to 'api-key'.
  - Rename appId to apiKey in BlockConfig interface
  - Update SDK client, Angular providers, and React context
  - Update all documentation with new apiKey examples
  - Add comprehensive test infrastructure:
    - Vitest workspace configuration (unit/integration/workflows)
    - Docker compose for API testing
    - Unit tests for mappers (32 tests passing)
    - Integration test templates for Auth and Search blocks
    - CI workflows for tiered testing (pr-checks, merge-tests, full-tests)
  - Add BACKLOG.md tracking test prerequisites and pending work
  - Add TEST_SUITE_STRATEGY.md documenting tiered testing approach
  🤖 Generated with [Claude Code](https://claude.com/claude-code)
  Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>

### 🧱 Updated Dependencies

- Updated @23blocks/block-authentication to 5.0.0
- Updated @23blocks/block-conversations to 3.0.0
- Updated @23blocks/block-geolocation to 3.0.0
- Updated @23blocks/block-onboarding to 3.0.0
- Updated @23blocks/block-university to 3.0.0
- Updated @23blocks/block-campaigns to 3.0.0
- Updated @23blocks/block-products to 3.0.0
- Updated @23blocks/transport-http to 3.0.0
- Updated @23blocks/block-company to 3.0.0
- Updated @23blocks/block-content to 3.0.0
- Updated @23blocks/block-rewards to 3.0.0
- Updated @23blocks/block-assets to 3.0.0
- Updated @23blocks/block-jarvis to 3.0.0
- Updated @23blocks/block-search to 4.0.0
- Updated @23blocks/block-wallet to 3.0.0
- Updated @23blocks/block-files to 3.0.0
- Updated @23blocks/block-forms to 3.0.0
- Updated @23blocks/block-sales to 3.0.0
- Updated @23blocks/block-crm to 3.0.0
- Updated @23blocks/contracts to 2.0.0

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 4.4.0 (2025-12-15)

### 🚀 Features

- achieve full Angular/React parity across all SDK blocks ([7debcce](https://github.com/23blocks-OS/frontend-sdk/commit/7debcce))

### 🧱 Updated Dependencies

- Updated @23blocks/block-campaigns to 2.1.0
- Updated @23blocks/block-products to 2.2.0
- Updated @23blocks/block-assets to 2.2.0
- Updated @23blocks/block-wallet to 2.1.0
- Updated @23blocks/block-sales to 2.2.0

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 4.3.0 (2025-12-15)

### 🧱 Updated Dependencies

- Updated @23blocks/block-university to 2.1.0
- Updated @23blocks/block-products to 2.1.0
- Updated @23blocks/block-rewards to 2.1.0
- Updated @23blocks/block-search to 3.1.0

## 4.2.0 (2025-12-15)

### 🧱 Updated Dependencies

- Updated @23blocks/block-geolocation to 2.1.0
- Updated @23blocks/block-content to 2.1.0
- Updated @23blocks/block-files to 2.1.0
- Updated @23blocks/block-forms to 2.1.0

## 4.1.0 (2025-12-15)

### 🧱 Updated Dependencies

- Updated @23blocks/block-conversations to 2.1.0
- Updated @23blocks/block-onboarding to 2.1.0
- Updated @23blocks/block-assets to 2.1.0
- Updated @23blocks/block-jarvis to 2.1.0
- Updated @23blocks/block-sales to 2.1.0
- Updated @23blocks/block-crm to 2.2.0

# 4.0.0 (2025-12-15)

### 🧱 Updated Dependencies

- Updated @23blocks/block-authentication to 4.0.0

## 3.1.1 (2025-12-15)

### 🧱 Updated Dependencies

- Updated @23blocks/block-authentication to 3.1.1

## 3.1.0 (2025-12-15)

### 🚀 Features

- add validateEmail, MFA, OAuth, Avatars, Tenants to Auth block and expand CRM block ([48b980f](https://github.com/23blocks-OS/frontend-sdk/commit/48b980f))

### 🧱 Updated Dependencies

- Updated @23blocks/block-authentication to 3.1.0
- Updated @23blocks/block-crm to 2.1.0

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

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

### 🚀 Features

- ⚠️  change appid header to x-api-key for API standards compliance ([bcaf889](https://github.com/23blocks-OS/frontend-sdk/commit/bcaf889))

### ⚠️  Breaking Changes

- change appid header to x-api-key for API standards compliance  ([bcaf889](https://github.com/23blocks-OS/frontend-sdk/commit/bcaf889))
  The header sent with requests changed from 'appid' to 'x-api-key'. Backend services need to accept 'x-api-key' header.
  🤖 Generated with [Claude Code](https://claude.com/claude-code)
  Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>

### 🧱 Updated Dependencies

- Updated @23blocks/block-authentication to 2.0.0
- Updated @23blocks/block-search to 2.0.0

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

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
- Updated @23blocks/block-company to 0.2.1
- Updated @23blocks/block-content to 0.2.1
- Updated @23blocks/block-rewards to 0.2.1
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

### 🩹 Fixes

- support Angular 10+ by using legacy-peer-deps ([21adc88](https://github.com/23blocks-OS/frontend-sdk/commit/21adc88))

### 🧱 Updated Dependencies

- Updated @23blocks/block-authentication to 0.1.1
- Updated @23blocks/block-conversations to 0.2.0
- Updated @23blocks/block-geolocation to 0.2.0
- Updated @23blocks/block-onboarding to 0.2.0
- Updated @23blocks/block-university to 0.2.0
- Updated @23blocks/block-campaigns to 0.2.0
- Updated @23blocks/block-products to 0.2.0
- Updated @23blocks/block-company to 0.2.0
- Updated @23blocks/block-content to 0.2.0
- Updated @23blocks/block-rewards to 0.2.0
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

### 🧱 Updated Dependencies

- Updated @23blocks/block-authentication to 0.1.0
- Updated @23blocks/block-search to 0.1.0
- Updated @23blocks/contracts to 0.1.0

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez