# SDK vs Backend API Audit Report

**Date:** 2026-01-04
**Purpose:** Identify missing services and models in the SDK compared to backend APIs

## Executive Summary

After comparing all 18 backend API `routes.rb` files with their corresponding SDK blocks, the following gaps were identified. Priority is based on likelihood of consumer usage.

---

## 1. block-authentication (gateway API)

**SDK Services (12):** auth, avatars, api-keys, apps, geography, guests, mfa, oauth, roles, subscriptions, tenants, users

### Missing Services (HIGH PRIORITY)

| Service | Backend Routes | Priority |
|---------|---------------|----------|
| **PermissionsService** | `GET/POST/PUT/DELETE /permissions` | HIGH |
| **MagicLinksService** | `POST /companies/:url_id/magic_links`, validate, send, destroy | HIGH |
| **CompaniesService** | Full CRUD for companies, blocks, keys, exchange, storage, domains | MEDIUM |
| **MailTemplatesService** | `GET/POST/PUT /mailtemplates`, mandrill integration | MEDIUM |
| **SubscriptionModelsService** | `GET/POST/PUT /subscription_models` | MEDIUM |
| **JwksService** | `.well-known/jwks.json`, company/app JWKS | LOW |
| **OidcService** | OpenID Connect discovery, authorize, token, userinfo | LOW |
| **AdminRsaKeysService** | Admin namespace for RSA key rotation | LOW |

### Missing Models/Types
- `Permission`, `CreatePermissionRequest`, `UpdatePermissionRequest`
- `MagicLink`, `CreateMagicLinkRequest`, `MagicLinkLog`
- `Company` (full model with blocks, keys, exchange settings)
- `SubscriptionModel`, `CreateSubscriptionModelRequest`

---

## 2. block-company (company API)

**SDK Services (5):** companies, departments, quarters, team-members, teams

### Missing Services (MEDIUM PRIORITY)

| Service | Backend Routes | Priority |
|---------|---------------|----------|
| **PositionsService** | `GET/POST/PUT/DELETE /positions` | MEDIUM |
| **EmployeeAssignmentsService** | `GET/POST/PUT/DELETE /employee_assignments` | MEDIUM |

### Missing Models/Types
- `Position`, `CreatePositionRequest`, `UpdatePositionRequest`
- `EmployeeAssignment`, `CreateEmployeeAssignmentRequest`

---

## 3. block-conversations (conversations API)

**SDK Services (12):** availabilities, conversations, contexts, draft-messages, groups, message-files, messages, notification-settings, notifications, sources, users, websocket-tokens

### Missing Services (MEDIUM PRIORITY)

| Service | Backend Routes | Priority |
|---------|---------------|----------|
| **GroupInvitesService** | `GET/POST/DELETE /groups/:id/invites`, join, QR code | HIGH |
| **MeetingsService** | `POST /meetings/:id`, create session | MEDIUM |
| **WebNotificationsService** | `POST /web_notifications` | MEDIUM |
| **MailTemplatesService** | Standard mail template endpoints | LOW |
| **EntitiesService** | `GET /entities/:id/notifications` | LOW |

### Missing Models/Types
- `GroupInvite`, `CreateGroupInviteRequest`, `JoinGroupRequest`
- `Meeting` (conversations version), `CreateMeetingSessionRequest`

---

## 4. block-content (content API)

**SDK Services:** posts, comments, tags, categories, users

### Missing Services (LOW PRIORITY)

| Service | Backend Routes | Priority |
|---------|---------------|----------|
| **ActivityService** | `GET /identities/:id/activities`, `GET /identities/:id/comments` | MEDIUM |
| **ModerationService** | `DELETE /posts/:id/comments/:id/moderate` | LOW |

### Missing Features in Existing Services
- Posts: `like`, `dislike`, `follow`, `unfollow`, `save`, `unsave`, `change_owner`, `publish` (version)
- Comments: `like`, `dislike`, `reply`, `follow`, `unfollow`, `save`, `unsave`
- Users: User tags (`add_tag`, `remove_tag`), social features (followers, following, follow/unfollow users)

---

## 5. block-files (files API)

**SDK Services:** storage-files, entity-files, file-schemas, user-files

### Missing Services (MEDIUM PRIORITY)

| Service | Backend Routes | Priority |
|---------|---------------|----------|
| **CategoriesService** | `GET/POST/PUT /categories` | MEDIUM |
| **TagsService** | `GET/POST/PUT /tags` | MEDIUM |
| **FileTagsService** | `POST/DELETE /users/:id/files/:id/tags` | MEDIUM |
| **DelegationsService** | `GET/POST/DELETE /users/:id/delegations` | MEDIUM |
| **FileAccessService** | `POST/DELETE /users/:id/files/:id/access/*` | MEDIUM |
| **FileAccessRequestsService** | Access request management | LOW |

### Missing Models/Types
- `FileCategory`, `FileTag`
- `AccessDelegation`, `CreateDelegationRequest`
- `FileAccessRequest`

---

## 6. block-geolocation (geolocation API)

**SDK Services:** locations, addresses, premises, areas, regions, routes, bookings, location-hours, location-images, location-slots, location-taxes, location-groups, geo-identities

### Missing Services (MEDIUM PRIORITY)

| Service | Backend Routes | Priority |
|---------|---------------|----------|
| **PremiseEventsService** | `GET/POST /locations/:id/premises/:id/events` | MEDIUM |
| **RouteTrackerService** | `POST /users/:id/routes/:id/tracker/location` | MEDIUM |
| **LocationIdentitiesService** | `POST/DELETE /locations/:id/identities` | MEDIUM |
| **GeoCountriesService** | `GET /countries/:code/locations` | LOW |
| **GeoStatesService** | `GET /states/:code/locations` | LOW |
| **GeoCitiesService** | `GET /cities/:code/locations` | LOW |

---

## 7. block-products (products API)

**SDK Services (22):** products, categories, brands, vendors, warehouses, channels, collections, product-sets, cart, my-carts, shopping-lists, product-promotions, product-prices, product-filters, product-images, product-variations, product-reviews, stock, product-suggestions, addons, remarketing, visitors

### Missing Services (MEDIUM PRIORITY)

| Service | Backend Routes | Priority |
|---------|---------------|----------|
| **CartDetailsService** | `PUT /carts/:id/details/:id/*` (order, accept, ship, etc.) | HIGH |
| **ProductVariationReviewsService** | `GET/POST/PUT/DELETE /products/:id/variations/:id/reviews` | MEDIUM |
| **CatalogsService** | `GET/POST/PUT/DELETE /catalogs` | MEDIUM |
| **ProductVendorsService** | `GET /products/:id/vendors` | LOW |

### Missing Features in Existing Services
- Stock: `eval_rules` for stock rule evaluation
- Products: `recover` method for trashed products

---

## 8. block-rewards (rewards API)

**SDK Services:** rewards, coupons, loyalty, badges, coupon-configurations, offer-codes, expiration-rules, rewards-customers

### Missing Services (LOW PRIORITY)

| Service | Backend Routes | Priority |
|---------|---------------|----------|
| **CategoriesService** | `GET/POST /categories` for badge categories | LOW |
| **MoneyRulesService** | `POST/PUT /loyalties/:id/rules/money` | LOW |
| **ProductRulesService** | `POST/PUT/DELETE /loyalties/:id/rules/products` | LOW |
| **EventRulesService** | `POST/PUT /loyalties/:id/rules/events` | LOW |

---

## 9. block-search (search API)

**SDK Services:** search, search-history, favorites, entities, identities

### Missing Services (MEDIUM PRIORITY)

| Service | Backend Routes | Priority |
|---------|---------------|----------|
| **EntityTypesService** | `GET /entity_types`, `GET /entity_types/:type` (schema) | HIGH |
| **CloudSearchService** | `POST /cloud` (AWS CloudSearch) | MEDIUM |
| **JarvisSearchService** | `POST /jarvis/entities/search` | LOW |

---

## 10. block-university (university API)

**SDK Services:** courses, subjects, lessons, enrollments, assignments, submissions, coaching-sessions, content-tests, course-groups, students, teachers

### Missing Services (HIGH PRIORITY)

| Service | Backend Routes | Priority |
|---------|---------------|----------|
| **PlacementsService** | Full placement test CRUD, sections, questions, rules | HIGH |
| **CalendarsService** | Teacher/student availability, events | HIGH |
| **MatchesService** | Coaching matches, availability evaluation | HIGH |
| **AttendanceService** | `GET/POST` student/teacher attendance | MEDIUM |
| **NotesService** | `GET/POST /notes` | MEDIUM |
| **RegistrationTokensService** | `GET/PUT/DELETE /tokens` | LOW |

### Missing Models/Types
- `PlacementTest`, `PlacementSection`, `PlacementQuestion`, `PlacementRule`
- `CalendarEvent`, `Availability`
- `Match`, `MatchEvaluation`
- `Attendance`, `AttendanceRecord`
- `Note`, `RegistrationToken`

---

## 11. block-sales (sales API)

**SDK Services:** orders, order-details, payments, subscriptions, subscription-models, entities, users, customers, flexible-orders, stripe, mercadopago, vendor-payments, order-taxes

### Status: MOSTLY COMPLETE

Minor missing features:
- Company subscriptions (separate from user subscriptions)
- Entity subscriptions
- Provider/vendor reports

---

## 12. block-wallet (wallet API)

**SDK Services:** wallets, transactions, authorization-codes, webhooks

### Status: COMPLETE

All backend routes are covered.

---

## 13. block-crm (crm API)

**SDK Services:** accounts, contacts, contact-events, leads, lead-follows, opportunities, meetings, meeting-participants, meeting-billings, quotes, subscribers, referrals, touches, categories, account-categories, calendar-accounts, busy-blocks, ics-tokens, zoom-meetings, zoom-hosts, mail-templates, communications, users, billing-reports, calendar-sync

### Status: MOSTLY COMPLETE

Minor gaps:
- Account documents presign (multipart upload)
- Contact documents presign (multipart upload)
- Jarvis file upload/association

---

## 14. block-onboarding (on-boarding API)

**SDK Services:** onboardings, flows, user-journeys, user-identities, mail-templates, onboard, remarketing

### Status: MOSTLY COMPLETE

All major routes covered. Minor features:
- User journey reports

---

## 15. block-forms (forms API)

**SDK Services:** forms, form-schemas, form-schema-versions, form-instances, form-sets, landings, subscriptions, appointments, surveys, referrals, mail-templates, crm-sync, users

### Status: COMPLETE (Fixed in previous session)

---

## 16. block-campaigns (campaigns API)

**SDK Services:** campaigns, campaign-media, landing-pages, audiences, landing-templates, campaign-targets, campaign-results, campaign-markets, campaign-locations, templates, campaign-media-results, media

### Status: MOSTLY COMPLETE

Minor gaps:
- Facebook audience creation (`POST /audience/facebook`)

---

## 17. block-assets (assets API)

**SDK Services:** assets, asset-events, asset-audits, categories, tags, vendors, warehouses, entities, asset-operations, alerts, users, asset-images

### Status: MOSTLY COMPLETE

All major routes covered.

---

## 18. block-jarvis (jarvis API)

**SDK Services (17):** agent-runtime, agents, ai-models, clusters, conversations, entities, execution-comments, executions, mail-templates, marvin-chat, prompt-comments, prompts, users, workflows, workflow-instances, workflow-participants, workflow-steps

### Status: COMPREHENSIVE

This block has extensive coverage with 17 services.

---

## Priority Action Items

### HIGH Priority (User-facing, frequently used)
1. **block-authentication**: Add PermissionsService, MagicLinksService
2. **block-university**: Add PlacementsService, CalendarsService, MatchesService
3. **block-search**: Add EntityTypesService
4. **block-products**: Add CartDetailsService
5. **block-conversations**: Add GroupInvitesService

### MEDIUM Priority (Feature completeness)
1. **block-company**: Add PositionsService, EmployeeAssignmentsService
2. **block-files**: Add CategoriesService, TagsService, DelegationsService
3. **block-geolocation**: Add PremiseEventsService, RouteTrackerService
4. **block-content**: Add ActivityService, social features to Posts/Comments

### LOW Priority (Specialized use cases)
1. JWKS/OIDC services in authentication
2. Admin RSA key management
3. Cloud search integration
4. Badge categories in rewards

---

## Recommendations

1. **Start with HIGH priority items** - These are commonly used features that consumers will expect
2. **Add missing models/types first** - Types can be added without breaking changes
3. **Consider feature flags** - Some features (OIDC, CloudSearch) may be optional
4. **Document API differences** - Some backend features may be intentionally excluded
