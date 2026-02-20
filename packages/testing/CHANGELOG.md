## 2.2.1 (2026-02-20)

### 🩹 Fixes

- resolve typecheck errors across all block packages ([6089324](https://github.com/23blocks-OS/frontend-sdk/commit/6089324))

### 🧱 Updated Dependencies

- Updated @23blocks/contracts to 2.3.1

### ❤️ Thank You

- Claude Opus 4.6
- Juan Pelaez

## 2.2.0 (2026-02-17)

### 🧱 Updated Dependencies

- Updated @23blocks/contracts to 2.3.0

## 2.1.0 (2026-02-08)

### 🧱 Updated Dependencies

- Updated @23blocks/contracts to 2.2.0

## 2.0.4 (2026-02-07)

### 🧱 Updated Dependencies

- Updated @23blocks/contracts to 2.1.3

## 2.0.3 (2026-02-06)

### 🧱 Updated Dependencies

- Updated @23blocks/contracts to 2.1.2

## 2.0.2 (2026-01-20)

### 🩹 Fixes

- resolve TypeScript errors and add PostTemplate validation support ([250d284](https://github.com/23blocks-OS/frontend-sdk/commit/250d284))

### 🧱 Updated Dependencies

- Updated @23blocks/contracts to 2.1.1

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez

## 2.0.1 (2026-01-05)

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

# 2.0.0 (2026-01-01)

### 🚀 Features

- add SDK developer experience improvements and testing package ([37db5f9](https://github.com/23blocks-OS/frontend-sdk/commit/37db5f9))

### 🧱 Updated Dependencies

- Updated @23blocks/contracts to 2.1.0

### ❤️ Thank You

- Claude Opus 4.5
- Juan Pelaez