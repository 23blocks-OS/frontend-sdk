## 4.1.0 (2026-03-08)

### 🚀 Features

- **@23blocks/block-conversations:** add inline message actions and MessageActionsService ([f9f6172](https://github.com/23blocks-OS/frontend-sdk/commit/f9f6172))

### ❤️ Thank You

- Claude Opus 4.6
- Juan Pelaez

## 4.0.1 (2026-03-03)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.3.2
- Updated @23blocks/contracts to 2.3.2

# 4.0.0 (2026-02-20)

### 🩹 Fixes

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

## 3.5.0 (2026-02-17)

### 🚀 Features

- add health() method to all 18 blocks for service connectivity checks ([73514a3](https://github.com/23blocks-OS/frontend-sdk/commit/73514a3))

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.3.0
- Updated @23blocks/contracts to 2.3.0

### ❤️ Thank You

- Claude Opus 4.6
- Juan Pelaez

## 3.4.0 (2026-02-08)

### 🚀 Features

- add comprehensive JSDoc documentation and llms.txt for AI agent consumption ([fd97df2](https://github.com/23blocks-OS/frontend-sdk/commit/fd97df2))

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.2.0
- Updated @23blocks/contracts to 2.2.0

### ❤️ Thank You

- Claude Opus 4.6
- Juan Pelaez

## 3.3.5 (2026-02-07)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.1.3
- Updated @23blocks/contracts to 2.1.3

## 3.3.4 (2026-02-06)

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.1.2
- Updated @23blocks/contracts to 2.1.2

## 3.3.3 (2026-01-20)

### 🩹 Fixes

- resolve TypeScript errors and add PostTemplate validation support ([250d284](https://github.com/23blocks-OS/frontend-sdk/commit/250d284))

### 🧱 Updated Dependencies

- Updated @23blocks/jsonapi-codec to 3.1.1
- Updated @23blocks/contracts to 2.1.1

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 3.3.2 (2026-01-16)

### 🩹 Fixes

- **mappers:** remove dangerous uniqueId fallback to resource.id ([e96c555](https://github.com/23blocks-OS/frontend-sdk/commit/e96c555))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 3.3.1 (2026-01-05)

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

## 3.3.0 (2026-01-04)

### 🚀 Features

- add remaining MEDIUM priority services across SDK blocks ([4fdfc56](https://github.com/23blocks-OS/frontend-sdk/commit/4fdfc56))

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 3.2.0 (2026-01-04)

### 🚀 Features

- implement HIGH priority missing services ([ab6141f](https://github.com/23blocks-OS/frontend-sdk/commit/ab6141f))

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