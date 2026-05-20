# Changelog

All notable changes to the 23blocks SDK monorepo.

Format follows [Keep a Changelog](https://keepachangelog.com/). Per-package versioning via [Conventional Commits](https://www.conventionalcommits.org/) + [nx release](https://nx.dev/recipes/nx-release).

---

## @23blocks/block-authentication

### 14.0.0 (latest)

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

### 14.0.0 (latest)

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

### 14.0.0 (latest)

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

### 5.0.2 (latest)

#### Fixed
- **Billing reports** (revenue, aging, participant) — now decoded via JSON:API codec with new mappers (`revenueReportMapper`, `agingReportMapper`, `participantBillingReportMapper`)
- **Mandrill stats** — now decoded via JSON:API codec with `mandrillStatsMapper`

---

## @23blocks/block-sales

### 8.0.2 (latest)

#### Fixed
- **Vendor payment report list** — now decoded via JSON:API codec using `vendorPaymentMapper`
- **Provider report list** — now decoded via JSON:API codec using `orderDetailVendorMapper`

---

## @23blocks/block-onboarding

### 5.0.2 (latest)

#### Fixed
- **User journey report list** — now decoded via JSON:API codec using `userJourneyMapper` instead of manual mapping

---

## @23blocks/angular

### 14.0.0 (latest)

#### Added
- `agentRegistrations` getter on `AuthenticationService`
- `requestPasswordlessCode()` and `verifyPasswordlessCode()` Observable wrappers on `AuthenticationService` with automatic token storage
- `delegations` getter on `JarvisService`

---

## @23blocks/sdk

### 13.0.0 (latest)

Rebuilt with all block changes above. Meta-package bundles block code at build time.

---

## @23blocks/react

### 14.0.0 (latest)

Rebuilt with all block changes above. All new features accessible via block hooks (`useAuthenticationBlock()`, `useJarvisBlock()`, `useConversationsBlock()`).
