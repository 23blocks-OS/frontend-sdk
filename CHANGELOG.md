# Changelog

All notable changes to the 23blocks SDK monorepo.

Format follows [Keep a Changelog](https://keepachangelog.com/). Per-package versioning via [Conventional Commits](https://www.conventionalcommits.org/) + [nx release](https://nx.dev/recipes/nx-release). Per-package details live in each package's own `CHANGELOG.md`; this file is a higher-level index of what shipped when.

---

## Current published versions (as of 2026-06-06)

| Package | Version |
|---|---|
| `@23blocks/sdk` | 18.1.5 |
| `@23blocks/react` | 19.1.5 |
| `@23blocks/angular` | 15.2.18 |
| `@23blocks/contracts` | 2.5.0 |
| `@23blocks/transport-http` | 3.4.0 |
| `@23blocks/jsonapi-codec` | 3.3.5 |
| `@23blocks/block-authentication` | 8.0.1 |
| `@23blocks/block-jarvis` | 7.0.0 |
| `@23blocks/block-conversations` | 5.0.0 |
| `@23blocks/block-files` | 6.1.3 |
| `@23blocks/block-products` | 6.1.2 |
| `@23blocks/block-onboarding` | 7.0.0 |
| `@23blocks/block-crm` | 5.0.6 |
| `@23blocks/block-assets` | 4.1.1 |
| `@23blocks/block-sales` | 8.0.5 |

---

## 2026-05 / 2026-06 sprint — what changed

This sprint covered a comprehensive API-contract audit triggered by a single consumer-reported bug (`file_name` vs `filename` in user-files presignUpload). Findings cascaded into ~30 endpoints fixed, 23 dead methods removed, ~445 UUID validation sites added, and several mapper rewrites across 5 blocks.

### Features

- **`@23blocks/contracts`** — `isUuid()` and `assertUuid()` exported for client-side RFC 4122 UUID validation. The SDK uses `assertUuid` internally on every path-param `*UniqueId` that the backing API team confirmed strictly requires UUID format. Coverage: `block-conversations` (all path params), `block-jarvis` (all except OpenAI-format `threadId`/`runId`/`msg_*`), `block-files` (all except base64url `:url_id`), `block-authentication` (users / roles / permissions / agent_registrations / service_tokens / mailtemplates / subscription_models / mfa).
- **`@23blocks/contracts`** — `RequestOptions.body` for DELETE-with-body endpoints (`@23blocks/transport-http` wires it through). Required for some Rails routes that read params from a DELETE body.
- **`@23blocks/block-files`** — comprehensive route corrections per the files API team:
  - `storageFiles` methods now take `urlId` (company tenant id) and use `/storage/:url_id/files`
  - `entityFiles` methods now take `entityUniqueId` and use `/entities/:unique_id/files`; added `listEntities` / `getEntity` / `registerEntity`, `presignUpload`/`multipartPresign`/`multipartComplete`, `associate`/`disassociate`
  - `fileSchemas` routes corrected: `/file_schemas/*` → `/schemas/*`
  - File mappers rewritten to read all attributes declared on their types — especially the RAG/AI fields (`schema_model`, `structured_content`, `file_structure`, `metadata`, `raw_content`, `content`) that were previously silently dropped
- **`@23blocks/block-conversations`** — new `tasks` sub-service for the persistent action items the realtime API auto-creates from AI summaries: `listForConversation`, `listForUser` (cross-conversation digest), `create`, `update`, `complete`, `dismiss`, `reopen`, `delete`. Plus `ConversationSummary` and `Task` exposed via `Conversation.summary` / `Conversation.tasks` (populated from JSON:API `included[]` when consumers pass `include: ['summary', 'tasks']` on `conversations.get()`).
- **`@23blocks/block-conversations`** — `ConversationsService` gained `archive(uniqueId)`, `rename(uniqueId, name)`, `restore(uniqueId)` (closes GitHub issue #6).
- **`@23blocks/block-products`** — new `userSubmissions` and `adminSubmissions` sub-services for the Product Submissions API (9 endpoints — user create/list/get and admin list/get/assign/approve/reject/update). `ProductSubmission`, `ProductSubmissionStatus`, `ProductSubmissionImage`, `ProductSubmissionHistoryRecord` types exported.
- **`@23blocks/block-jarvis`** — `prompts.create()` and `prompts.update()` now return `Promise<Prompt | PromptVersion>` (discriminate via the `resourceType` field) to tolerate the API team's mid-rollout change of those endpoints from returning the parent `Prompt` to returning the newly-created `PromptVersion`.
- **`@23blocks/block-jarvis`** — `agentRuntime.createContext()` now exposes `contextUniqueId` via the returned `conversation` slot so consumers can drive `sendMessageStream` without inspecting raw transport state (closes GitHub issue #4).

### Fixes (silent-failure bugs found via the audit + consumer reports)

- **`@23blocks/block-files`** — file mappers stopped silently dropping every populated RAG/AI attribute (closes GitHub issues #1 and #2). `userFileMapper` went from reading 14 attributes to reading all 32 declared on `UserFile`.
- **`@23blocks/block-files`** — `userFiles.presignUpload` / `multipartPresign` / `multipartComplete` request `serialization=jsonapi` and parse `data.attributes` (was reading flat top-level fields that didn't exist, returning `undefined` for everything).
- **`@23blocks/block-files`** — every internal `@23blocks/*` dep changed from `"*"` wildcard to caret ranges (`"^2.4.0"`) so consumers' lockfiles correctly upgrade `contracts` when block code needs a newer `assertUuid` (closes GitHub issue #3, the `TypeError: assertUuid is not a function` regression). Same fix applied across all 20 internal-dep declarations in the repo.
- **`@23blocks/block-jarvis`** — `parseAgentThread` now reads JSON:API `data.attributes.payload.thread_id` / `payload.agent_unique_id` / `attributes.unique_id` shape (was reading flat fields, returning `undefined` for every field on a successful create).
- **`@23blocks/block-jarvis`** — JSON:API parser fixes on `prompts.execute`, `marvinChat.sendMessage`, `agentRuntime.initiateHandoff` / `getHandoffStatus`. Removed dead `marvinChat.getContext` / `marvinChat.createContext` (routes never existed).
- **`@23blocks/block-jarvis`** — `Conversation.title` → `Conversation.name` plus mapper switched to read `attributes.name` (the field never existed in the Conversations API; SDK was reading empty strings).
- **`@23blocks/block-jarvis`** — `conversations.listByUser` now hits `/identities/:uid/conversations` (was 404'ing on `/users/:uid/conversations` — closes GitHub issue #5).
- **`@23blocks/block-jarvis`** — `parseAgentMessage` accepts both JSON:API `included[]` shape (with `source_alias` → `role` translation) and the legacy flat OpenAI message shape. `getMessages` / `getConversation` route messages through it.
- **`@23blocks/block-assets`** — 13 methods across `entities`, `assetImages`, `assetEvents`, `categories`, `users`, `assets` now parse JSON:API correctly (were silently dropping fields on resource-creation endpoints).
- **`@23blocks/block-assets`** — `UserOwnership` surfaces the full `asset` via the JSON:API `included[]` array on `listOwnership`, saving an N+1 round-trip.
- **`@23blocks/block-onboarding`** — remarketing endpoint split into 3 CQRS-clean methods: `listAbandonedJourneys` (read-only), `triggerRemarketing` (bulk POST), `triggerRemarketingForJourney` (single POST). Old `triggerRun` removed. `getMandrillStats` returns `MandrillTimeSeriesPoint[]` with correct field set (was a single stats object with fields that didn't exist).
- **`@23blocks/block-authentication`** — 10 methods removed that pointed to non-existent backend routes (MagicLinks/RefreshTokens/UserDevices/TenantUsers resource lookups, plus `AdminRsaKeys/:keyId`). 9 path-param renames to clarify intent (`apps uniqueId→appUrlId`, `blocks uniqueId→blockCode`, `services uniqueId→id`, `companySubscriptions companyUniqueId→companyUrlId`). `currencies.get()` is the one geography endpoint that takes a UUID.
- **`@23blocks/block-products`** — `products.search()` no longer sends a redundant `?search=` query string alongside the body's `{search: {search_by}}`. The Rails param-merge collision between string (query) and hash (body) was silently returning 0 rows for every search (closes GitHub issue #8).
- **`@23blocks/block-products`** — `visitors.create()` now parses JSON:API (was reading flat fields) and uses the real `GuestSerializer` field set.
- **`@23blocks/block-crm`** — all 6 search methods (`accounts`, `contacts`, `leads`, `opportunities`, `meetings`, `quotes`) now use `GET /<resource>?search=<q>` instead of `POST /<resource>/search` to a non-existent route. Search was 404'ing across the entire block.
- **`@23blocks/block-conversations`** — `groups.search()` removed. The backing endpoint never existed (404'd since release); the realtime API team confirmed no consumer ever complained, so there's no demand to spec a new endpoint. Consumers wanting search-by-name can list and client-filter.

### Breaking changes summary

| Package | Breaking change |
|---|---|
| `@23blocks/block-files` | `storageFiles` + `entityFiles` method signatures now take a positional id (urlId / entityUniqueId). `userFiles` upload response shape changed. Mapper field names corrected. |
| `@23blocks/block-jarvis` | `prompts.create()`/`update()` return `Prompt \| PromptVersion`. `Conversation.title` → `.name`. Dead `marvinChat.getContext` / `createContext` removed. |
| `@23blocks/block-conversations` | `groups.search()` removed. |
| `@23blocks/block-onboarding` | `triggerRun()` → `triggerRemarketing()`/`triggerRemarketingForJourney()`. `getMandrillStats` return shape changed. |
| `@23blocks/block-authentication` | 10 dead methods removed; 9 param renames. |
| `@23blocks/block-products` | `ShoppingListsService` rewritten (all methods take `userUniqueId` positionally; item ops switched to `/products` sub-resource with delta semantics; `updateItemQuantity` removed). |
| `@23blocks/block-crm` | search methods changed verb POST→GET and dropped the body. |

### Resolved GitHub issues

| # | Title | Resolved in |
|---|---|---|
| #1 | block-files: userFileMapper drops RAG/AI content fields | `block-files@6.1.0` |
| #2 | block-files: userFileMapper reads attributes['file_name'] but backend returns 'name' | `block-files@6.1.0` |
| #3 | CRITICAL: block-files@6.1.1 imports assertUuid from contracts | `block-files@6.1.2` + caret-pinning across all internal deps |
| #4 | block-jarvis: agentRuntime.createContext response parser doesn't read JSON:API shape | `block-jarvis@5.9.1` |
| #5 | block-jarvis: conversations.listByUser hits /users/:uid/conversations, returns 404 | `block-jarvis@5.9.4` |
| #6 | block-jarvis: ConversationsService missing archive/rename/restore methods | `block-jarvis@5.9.4` |
| #7 | block-products: ShoppingListsService hits /shopping_lists/ which returns 404 | `block-products@6.0.0` |
| #8 | block-products: products.search() returns 0 results — redundant ?search= query param | `block-products@6.0.1` |

---

## Older entries (historical — for the per-package version numbers from when these sections were written, see each package's own `CHANGELOG.md`)

## @23blocks/block-authentication

### 14.0.0

#### Added
- **reCAPTCHA v3 support** — optional `recaptchaToken` field on `SignInRequest`, `SignUpRequest`, `PasswordResetRequest`, `PasswordOtpRequest`, `PasswordlessRequest`. Sent as `recaptcha_token`. No-op when tenant enforcement is disabled.
- **Agent Identity (AID) registration** — new `AgentRegistrationsService` for agent self-registration without admin JWT:
  - `request(data)` — `POST /agent_registrations/request` (API key only, 202 Accepted)
  - `approve(uid, data?)` — `POST /agent_registrations/:id/approve` (admin JWT required)
  - `reject(uid)` — `POST /agent_registrations/:id/reject` (admin JWT required)
  - `status(uid, { fingerprint })` — `POST /agent_registrations/:id/status` (fingerprint proof)
  - Types: `AgentRegistration`, `RequestAgentRegistrationData`, `ApproveAgentRegistrationData`, `AgentRegistrationStatusRequest`
- **Passwordless login** — OTP-based login without password:
  - `auth.requestPasswordlessCode({ email })` — `POST /auth/passwordless/request` (anti-enumeration, always 200)
  - `auth.verifyPasswordlessCode({ email, code, mfaCode?, backupCode? })` — `POST /auth/passwordless/verify` (full-scope JWT, MFA support)
  - Types: `PasswordlessRequest`, `PasswordlessResponse`, `PasswordlessVerifyRequest`

---

## @23blocks/block-jarvis

### 14.0.0

#### Added
- **Generic vendor model discovery** — `aiModels.vendorModels(vendor)` fetches models from any vendor (openai, mistral, etc.)
- **Mistral provider support** — `vendorModels('mistral')` for Mistral model discovery
- **`VendorModel` type** — replaces `OpenAIModel` (backward-compatible alias kept)
- **`CreateCompanyKeyRequest`** — added `apiSecret` and `baseUrl` for Mistral and self-hosted providers
- **`provider` field** on `Prompt`, `Agent`, `CreatePromptRequest`, `CreateAgentRequest` — values: openai, anthropic, google, perplexity, mistral, openai_compatible, custom
- **Strong params audit fields**:
  - Agent: `code`, `status` on create/update
  - WorkflowStep: `stepType`, `gatewayType`, `isEntryPoint`, `isExitPoint`
  - Entity: `instructions`, `createdBy`, `updatedBy`
  - AIModel: `inputTokenCostCurrency`, `outputTokenCostCurrency`
- **Supervisor handoff**:
  - `Agent.supervisorUserUid` field
  - `agentRuntime.initiateHandoff(agentUid, contextUid)` — `POST /agents/:uid/context/:ctx/handoff`
  - `agentRuntime.getHandoffStatus(agentUid, contextUid)` — `GET /agents/:uid/context/:ctx/handoff`
  - `agentRuntime.revokeHandoff(agentUid, contextUid, delegationUid)` — `DELETE /agents/:uid/context/:ctx/handoff/:delegation_uid`
  - Type: `HandoffStatus`
- **Delegations CRUD** — new `DelegationsService` under `/identities/:uid/delegations/`:
  - `list`, `get`, `create`, `update`, `revoke`
  - Types: `Delegation`, `CreateDelegationRequest`, `UpdateDelegationRequest`, `ListDelegationsParams`

#### Fixed
- **Agent executions** (`listExecutions`, `getExecution`) — now decoded via JSON:API codec with `runExecutionMapper` instead of manual mapping
- **OpenAI models** (`openaiAvailable`) — now decoded via JSON:API codec with `openaiModelMapper`
- **Workflow instance details** (`getDetails`) — instance decoded via JSON:API codec

#### Deprecated
- `openaiAvailable()` — use `vendorModels('openai')` instead
- `OpenAIModel` type — use `VendorModel` instead

---

## @23blocks/block-conversations

### 14.0.0

#### Added
- **Batch messaging** — `messages.batch(data)` sends per-item messages to multiple conversations in one call:
  - `POST /messages/batch` (max 2000 items, requires `conversations:batch` scope)
  - Per-item `conversationUniqueId`, `notificationUrl`, `notifyRoles`, `idempotencyKey`
  - Types: `BatchMessageItem`, `BatchMessagesRequest`, `BatchMessagesResult`, `BatchFailedItem`
- **AI conversation summaries**:
  - `conversations.summary(contextId)` — `POST /conversations/:id/summary` (incremental, cached, rate-limited 1/60s)
  - `conversations.digest({ contextUniqueIds, promptId? })` — `POST /conversations/digest` (up to 50 conversations)
  - Types: `ConversationSummary`, `ConversationSummaryContent`, `DigestRequest`
- **Unread summary with payload grouping**:
  - `users.getUnreadSummary(uid, params?)` — `GET /users/:uid/unread-summary`
  - Supports `groupBy` including `payload:<key_name>` for JSONB grouping
  - Supports `custom` filters for multi-level drill-down
  - Types: `UnreadSummary`, `UnreadSummaryBucket`, `UnreadSummaryParams`

---

## @23blocks/block-crm

### 5.0.2

#### Fixed
- **Billing reports** (revenue, aging, participant) — now decoded via JSON:API codec with new mappers (`revenueReportMapper`, `agingReportMapper`, `participantBillingReportMapper`)
- **Mandrill stats** — now decoded via JSON:API codec with `mandrillStatsMapper`

---

## @23blocks/block-sales

### 8.0.2

#### Fixed
- **Vendor payment report list** — now decoded via JSON:API codec using `vendorPaymentMapper`
- **Provider report list** — now decoded via JSON:API codec using `orderDetailVendorMapper`

---

## @23blocks/block-onboarding

### 5.0.2

#### Fixed
- **User journey report list** — now decoded via JSON:API codec using `userJourneyMapper` instead of manual mapping

---

## @23blocks/angular

### 14.0.0

#### Added
- `agentRegistrations` getter on `AuthenticationService`
- `requestPasswordlessCode()` and `verifyPasswordlessCode()` Observable wrappers on `AuthenticationService` with automatic token storage
- `delegations` getter on `JarvisService`

---

## @23blocks/sdk

### 13.0.0

Rebuilt with all block changes above. Note: the meta-package depends on each `@23blocks/block-*` as a regular npm package with caret ranges — consumers receive block fixes via dep resolution on next install, no meta-package republish required for block-internal patches.

---

## @23blocks/react

### 14.0.0

Rebuilt with all block changes above. All new features accessible via block hooks (`useAuthenticationBlock()`, `useJarvisBlock()`, `useConversationsBlock()`).
