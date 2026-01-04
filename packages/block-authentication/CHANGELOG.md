## 6.2.0 (2026-01-04)

### 🚀 Features

- implement HIGH priority missing services ([ab6141f](https://github.com/23blocks-OS/frontend-sdk/commit/ab6141f))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 6.1.0 (2026-01-01)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.1.0
- Updated @23blocks/contracts to 2.1.0

## 6.0.2 (2026-01-01)

### 🩹 Fixes

- add missing fields to update request types ([2d54e25](https://github.com/23blocks-OS/frontend-sdk/commit/2d54e25))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 6.0.1 (2025-12-31)

### 🩹 Fixes

- replace PATCH with PUT across all services ([6339334](https://github.com/23blocks-OS/frontend-sdk/commit/6339334))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

# 6.0.0 (2025-12-17)

### 🩹 Fixes

- ⚠️  use x-api-key header for API standards compliance ([8206652](https://github.com/23blocks-OS/frontend-sdk/commit/8206652))

### ⚠️  Breaking Changes

- use x-api-key header for API standards compliance  ([8206652](https://github.com/23blocks-OS/frontend-sdk/commit/8206652))
  The HTTP header sent with API requests changed from
  'api-key' to 'x-api-key'. Backend services need to accept 'x-api-key' header.
  🤖 Generated with [Claude Code](https://claude.com/claude-code)
  Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 5.0.1 (2025-12-17)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.0.1
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

- Updated @23blocks/jsonapi-codec to 3.0.0
- Updated @23blocks/contracts to 2.0.0

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

# 4.0.0 (2025-12-15)

### 🩹 Fixes

- ⚠️  make confirmSuccessUrl required in SignUpRequest and ResendConfirmationRequest ([1b5fb44](https://github.com/23blocks-OS/frontend-sdk/commit/1b5fb44))

### ⚠️  Breaking Changes

- make confirmSuccessUrl required in SignUpRequest and ResendConfirmationRequest  ([1b5fb44](https://github.com/23blocks-OS/frontend-sdk/commit/1b5fb44))
  confirmSuccessUrl is now a required field.
  This field is needed for the email confirmation flow to work correctly.
  Applications must provide a redirect URL for users after they confirm their email.
  🤖 Generated with [Claude Code](https://claude.com/claude-code)
  Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 3.1.1 (2025-12-15)

### 🩹 Fixes

- add mfa, oauth, avatars, tenants services to AuthenticationBlock ([281f5d6](https://github.com/23blocks-OS/frontend-sdk/commit/281f5d6))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 3.1.0 (2025-12-15)

### 🚀 Features

- add validateEmail, MFA, OAuth, Avatars, Tenants to Auth block and expand CRM block ([48b980f](https://github.com/23blocks-OS/frontend-sdk/commit/48b980f))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 3.0.3 (2025-12-15)

### 🩹 Fixes

- add subscription field for plan assignment on registration ([b3b14b8](https://github.com/23blocks-OS/frontend-sdk/commit/b3b14b8))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 3.0.2 (2025-12-15)

### 🩹 Fixes

- add all missing registration parameters to SignUpRequest ([e1c514c](https://github.com/23blocks-OS/frontend-sdk/commit/e1c514c))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 3.0.1 (2025-12-15)

### 🩹 Fixes

- add confirmSuccessUrl to SignUpRequest and improve error handling ([bf1ad46](https://github.com/23blocks-OS/frontend-sdk/commit/bf1ad46))

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

## 1.0.5 (2025-12-14)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 1.0.4
- Updated @23blocks/contracts to 1.0.4

## 1.0.4 (2025-12-14)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 1.0.3
- Updated @23blocks/contracts to 1.0.3

## 1.0.3 (2025-12-14)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 1.0.2
- Updated @23blocks/contracts to 1.0.2

## 1.0.2 (2025-12-14)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 1.0.1
- Updated @23blocks/contracts to 1.0.1

## 1.0.1 (2025-12-13)

### 🩹 Fixes

- **block-authentication:** remove getFullName utility from public exports ([6576861](https://github.com/23blocks-OS/frontend-sdk/commit/6576861))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

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