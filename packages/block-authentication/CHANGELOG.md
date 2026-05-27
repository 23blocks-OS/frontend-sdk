## 7.9.0 (2026-05-27)

### 🚀 Features

- **@23blocks/block-authentication:** validate path-param UUIDs at SDK entry ([b83bd93](https://github.com/23blocks-OS/frontend-sdk/commit/b83bd93))

### ❤️ Thank You

- Claude Opus 4.7 (1M context)
- Juan Pelaez

## 7.8.1 (2026-05-27)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.3.3
- Updated @23blocks/contracts to 2.4.0

## 7.8.0 (2026-05-22)

### 🚀 Features

- **@23blocks/block-authentication:** add tokenEndpoint and company fields to AgentRegistration ([8e79357](https://github.com/23blocks-OS/frontend-sdk/commit/8e79357))

### ❤️ Thank You

- Claude Opus 4.6 (1M context)
- Juan Pelaez

## 7.7.0 (2026-05-21)

### 🚀 Features

- **@23blocks/block-authentication:** add agentAuthorizationDomain to Company type ([dc5b618](https://github.com/23blocks-OS/frontend-sdk/commit/dc5b618))

### ❤️ Thank You

- Claude Opus 4.6 (1M context)
- Juan Pelaez

## 7.6.0 (2026-05-21)

### 🚀 Features

- **@23blocks/block-authentication:** expand AID registration with RFC 8628 device flow ([84f3ed6](https://github.com/23blocks-OS/frontend-sdk/commit/84f3ed6))

### ❤️ Thank You

- Claude Opus 4.6 (1M context)
- Juan Pelaez

## 7.5.0 (2026-05-19)

### 🚀 Features

- **@23blocks/block-authentication:** add reCAPTCHA v3 token support to unauthenticated auth endpoints ([5fc7dae](https://github.com/23blocks-OS/frontend-sdk/commit/5fc7dae))

### ❤️ Thank You

- Claude Opus 4.6 (1M context)
- Juan Pelaez

## 7.4.0 (2026-05-19)

### 🚀 Features

- **@23blocks/block-authentication:** add Agent Identity (AID) registration service ([117bce1](https://github.com/23blocks-OS/frontend-sdk/commit/117bce1))

### ❤️ Thank You

- Claude Opus 4.6 (1M context)
- Juan Pelaez

## 7.3.0 (2026-05-18)

### 🚀 Features

- **@23blocks/block-authentication:** add passwordless login with OTP ([6791ad8](https://github.com/23blocks-OS/frontend-sdk/commit/6791ad8))

### ❤️ Thank You

- Claude Opus 4.6 (1M context)
- Juan Pelaez

## 7.2.0 (2026-03-05)

### 🚀 Features

- **@23blocks/block-authentication:** add OTP-based password reset for mobile apps ([b8cd80b](https://github.com/23blocks-OS/frontend-sdk/commit/b8cd80b))

### ❤️ Thank You

- Claude Opus 4.6
- Juan Pelaez

## 7.1.1 (2026-03-03)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.3.2
- Updated @23blocks/contracts to 2.3.2

## 7.1.0 (2026-02-24)

### 🚀 Features

- **@23blocks/block-authentication:** add service tokens, oauthMode, and CI simplification ([3cea02d](https://github.com/23blocks-OS/frontend-sdk/commit/3cea02d))

### ❤️ Thank You

- Claude Opus 4.6
- Juan Pelaez

# 7.0.0 (2026-02-20)

### 🩹 Fixes

- align mapper tests with implementation and fix user mapper fallbacks ([1ac0b6e](https://github.com/23blocks-OS/frontend-sdk/commit/1ac0b6e))
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

## 6.5.0 (2026-02-17)

### 🚀 Features

- add health() method to all 18 blocks for service connectivity checks ([73514a3](https://github.com/23blocks-OS/frontend-sdk/commit/73514a3))

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.3.0
- Updated @23blocks/contracts to 2.3.0

### ❤️ Thank You

- Claude Opus 4.6
- Juan Pelaez

## 6.4.0 (2026-02-08)

### 🚀 Features

- add comprehensive JSDoc documentation and llms.txt for AI agent consumption ([fd97df2](https://github.com/23blocks-OS/frontend-sdk/commit/fd97df2))

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.2.0
- Updated @23blocks/contracts to 2.2.0

### ❤️ Thank You

- Claude Opus 4.6
- Juan Pelaez

## 6.3.6 (2026-02-07)

### 🩹 Fixes

- replace misleading `id` params with `uniqueId` across SDK ([6dfc65b](https://github.com/23blocks-OS/frontend-sdk/commit/6dfc65b))

### ❤️ Thank You

- Claude Opus 4.6
- Juan Pelaez

## 6.3.5 (2026-02-07)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.1.3
- Updated @23blocks/contracts to 2.1.3

## 6.3.4 (2026-02-06)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.1.2
- Updated @23blocks/contracts to 2.1.2

## 6.3.3 (2026-01-28)

### 🩹 Fixes

- **auth,search:** use simple pagination params instead of JSON:API style ([52ac9bd](https://github.com/23blocks-OS/frontend-sdk/commit/52ac9bd))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 6.3.2 (2026-01-20)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.1.1
- Updated @23blocks/contracts to 2.1.1

## 6.3.1 (2026-01-05)

### 🚀 Features

- ⚠️  **angular:** complete all Angular services with full block coverage ([e806bfc](https://github.com/23blocks-OS/frontend-sdk/commit/e806bfc))

### ⚠️  Breaking Changes

- **angular:** complete all Angular services with full block coverage  ([e806bfc](https://github.com/23blocks-OS/frontend-sdk/commit/e806bfc))
  rawBlock renamed to {serviceName}Block across all services
  Changes:
  - Rename rawBlock to proper names (authenticationBlock, searchBlock, etc.) in all 17 Angular services
  - Complete AuthenticationService with all 25 block services (permissions, apps, subscriptions, geography, guests, magic links, etc.)
  - Complete CrmService with all 22 block services (contact events, lead follows, meeting participants, zoom, calendar, etc.)
  - Complete GeolocationService with all 19 block services (premise events, route tracker, location hours/images/slots/taxes/groups, identities)
  - Complete ConversationsService with all 14 block services (draft messages, group invites, websocket tokens, contexts, availabilities, meetings, web notifications)
  - Complete FilesService with all 9 block services (user files, file categories, file tags, delegations, file access, file access requests)
  - Complete AssetsService with all 12 block services (events with images/reports, audits, operations, alerts, users)
  - Complete CampaignsService with all 12 block services (campaign media, landing pages, audiences, templates, media results)
  - Complete CompanyService with positions and employee assignments
  - Complete RewardsService with fixed method signatures for loyalty rules
  - Complete SalesService with Stripe and MercadoPago payment services
  - Complete JarvisService with AI models, entities, clusters, workflows, agent runtime
  - Complete OnboardingService with onboard flow, mail templates, remarketing
  - Complete UniversityService with placements, calendars, matches, attendance, notes
  - Export missing types from block packages
  🤖 Generated with [Claude Code](https://claude.com/claude-code)
  Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 6.3.0 (2026-01-04)

### 🚀 Features

- implement LOW priority services across SDK blocks ([9296d12](https://github.com/23blocks-OS/frontend-sdk/commit/9296d12))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

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