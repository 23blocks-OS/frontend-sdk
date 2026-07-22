// ─────────────────────────────────────────────────────────────────────────────
// Client Factory (Recommended API) — token lifecycle, auto-refresh, 401 retry, AID tokenEndpoint and company fields
// ─────────────────────────────────────────────────────────────────────────────

export {
  create23BlocksClient,
  type AuthMode,
  type ClientConfig,
  type ServiceUrls,
  type Blocks23Client,
  type ManagedAuthService,
  type StorageType,
  type TokenManager,
} from './client.js';

export { createTokenManager, isBrowser } from './token-manager.js';

export {
  createTokenLifecycleManager,
  createRetryingTransport,
  type AuthStateEvent,
  type AuthStateListener,
  type RefreshTokenFn,
  type TokenLifecycleConfig,
  type TokenLifecycleManager,
} from './token-lifecycle.js';

// ─────────────────────────────────────────────────────────────────────────────
// Core (safe to re-export directly - no conflicts)
//
// `isUuid` and `assertUuid` are exported from @23blocks/contracts.
//
// block-products BREAKING (7.0.0): product submissions are now generic, not
// wine-specific. products.userSubmissions.create / products.adminSubmissions.
// update no longer accept top-level vintage/varietal/region/alcoholContent —
// pass any product-type-specific attributes under `payload` (Record<string,
// unknown>), mirroring product.payload; on approval it maps verbatim to the
// created Product.payload. adminSubmissions.approve gains enrichedData.
// categoryId; adminSubmissions.reject gains duplicateOfSubmissionId.
//
// The user/storage/entity file mappers in @23blocks/block-files now read every
// attribute declared on their respective types — including the AI/RAG fields
// (schema_model, structured_content, file_structure, metadata, raw_content,
// content) and the canonical name/description/tags fields that the earlier
// mappers silently dropped.
//
// Several jarvis/products endpoints now correctly parse JSON:API responses
// (was reading flat top-level fields, silently dropping everything):
// jarvis.prompts.execute, jarvis.marvinChat.sendMessage,
// jarvis.agentRuntime.initiateHandoff/getHandoffStatus,
// block-products: products.search() no longer sends `?search=<term>` as a
// query param — that was colliding with the body's `{search: {search_by}}`
// hash (Rails param-merge collision: string vs hash) and silently returning
// 0 rows. Body shape unchanged; only the redundant query param was removed.
// (Same pattern likely exists in 27 other search methods across block-content,
// block-crm, block-conversations, block-geolocation — fix shipping per
// block as each API team confirms.)
//
// block-jarvis BREAKING: Conversation.title and CreateConversationRequest.title
// renamed to .name to match the actual Conversations API contract (the
// SDK's `title` field never existed in the API and always read back as
// empty string). Conversation mapper now reads attributes.name (with a
// transitional fallback to attributes.title). Mapper discriminator
// changed from 'conversation' → 'Conversation' to match the API.
//
// block-onboarding BREAKING: RemarketingService split per the API's
// CQRS-clean redesign (2026-06-01). listAbandonedJourneys is now read-only;
// triggerRemarketing (renamed from triggerRun) calls the new POST endpoint;
// added triggerRemarketingForJourney for single-journey trigger.
//
// block-jarvis BREAKING: prompts.create() and prompts.update() now return
// `Promise<Prompt | PromptVersion>` (was `Promise<Prompt>`). As of the
// 2026-05-30 Jarvis API change, those endpoints return the newly-created
// PromptVersion instead of the parent Prompt — the SDK is tolerant of
// both shapes during the rollout window. Discriminate the union via the
// `resourceType` field on the returned object.
//
// block-conversations: GET /conversations/:id now supports the new
// `summary` and `tasks` JSON:API relationships announced by realtime
// (2026-05-29). Pass `include: ['summary', 'tasks']` in GetConversationParams
// to opt in; the returned Conversation gains optional `summary` and `tasks`
// fields populated from the response `included[]` array.
//
// block-conversations: new `tasks` sub-service with listForConversation,
// listForUser (cross-conversation digest), create, update, complete,
// dismiss, reopen, delete. Backs the persistent action items auto-created
// from AI summaries. Uses PUT for /tasks/:uid mutations (action_type
// query param drives lifecycle transitions).
//
// block-products BREAKING: ShoppingListsService rewritten. Methods now
// take userUniqueId as a required positional arg; paths moved from the
// non-existent flat /shopping_lists/* to /users/:uid/shoppinglists/*.
// Item operations use the /products sub-resource (NOT /items) with
// quantity-as-delta semantics on addItem. updateItemQuantity removed.
//
// `transport.delete` now supports a request body via `options.body`
// (required by some 23blocks routes that read params from DELETE bodies).
//
// jarvis.conversations now correctly hits /identities/:uid/conversations
// for listByUser (was 404'ing on /users/:uid/...) and exposes archive,
// rename (top-level `name` field, not `title`), and restore methods that
// the backend supported all along.
//
// UserOwnership (block-assets) now surfaces the full Asset record via the
// `asset` field, populated from the JSON:API `included[]` array — saves
// N+1 lookups when consumers need asset details alongside ownership rows.
//
// jarvis.agentRuntime.getMessages/getConversation/getContext (messages come
// from the JSON:API `included[]` array with source_alias→role translation),
// products.visitors.create, and all 13 methods in block-assets
// (entities.{listAccesses,getAccess,requestAccess,listAccessRequests,
// approveAccessRequest}, asset-images/asset-events/categories.create*,
// users.{listOwnership,listEntities,listAssets}, assets.createOTP).
// Removed dead marvin routes (getContext/createContext on /marvin/contexts).
//
// block-onboarding BREAKING: listAbandonedJourneys replaced with
// triggerRun (it was actually a fire-and-email action, not a list);
// getMandrillStats return shape changed to MandrillTimeSeriesPoint[]
// (was a single stats object with fields that didn't exist in the
// response).
//
// block-authentication BREAKING: 10 methods removed that were calling
// non-existent routes (MagicLinksService.get/expire, RefreshTokensService.
// get/revoke, UserDevicesService.get/unregister/setDefault, TenantUsersService.
// get, AdminRsaKeysService.get/deactivate/delete). Also 9 param renames
// to clarify intent (AppsService uniqueId→appUrlId, BlocksService
// uniqueId→blockCode, ServicesRegistryService uniqueId→id,
// CompanySubscriptionsService companyUniqueId→companyUrlId). Added
// assertUuid to GeographyService.currencies.get (only geography endpoint
// that takes a UUID; others are integer IDs).
//
// The SDK uses `assertUuid` internally to validate path-param UUIDs on
// endpoints confirmed by each block's API team to require strict RFC 4122
// format.
// Coverage: block-conversations (all path-param uniqueIds), block-jarvis
// (all path-param uniqueIds except OpenAI-format threadId/runId),
// block-files (all path-param uniqueIds except :url_id which is base64url),
// and block-authentication (users, roles, permissions, agent_registrations,
// service_tokens, mailtemplates, subscription_models, mfa — but NOT
// companies' :url_id, magic_link tokens, agent_registrations resolve codes,
// block_code slugs, or numeric service ids).
// Invalid UUIDs throw a TypeError at the call site with an actionable
// message instead of failing at the backend with an opaque PostgreSQL error.
// ─────────────────────────────────────────────────────────────────────────────

export * from '@23blocks/contracts';
export * from '@23blocks/jsonapi-codec';
export * from '@23blocks/transport-http';

// ─────────────────────────────────────────────────────────────────────────────
// Blocks (namespaced to avoid type conflicts)
//
// Multiple blocks export types with the same name (e.g., Category, Tag,
// Subscription, MailTemplate, Meeting, Conversation, Referral).
// Using namespace exports prevents conflicts.
//
// Usage:
//   import { authentication, crm, forms } from '@23blocks/sdk';
//   const user: authentication.User = ...;
//   const category: crm.Category = ...;
//   const subscription: forms.Subscription = ...;
//
// Or import specific types from individual packages:
//   import { User } from '@23blocks/block-authentication';
//   import { Category } from '@23blocks/block-crm';
//   import { CreatePurchaseRequest, StripeCheckoutSession, VendorPayment } from '@23blocks/block-sales';
//
// Breaking changes for `files`:
//  - `storageFiles` methods require a `urlId` (company tenant identifier) as the
//    first argument. Routes moved to `/storage/:url_id/files`.
//  - `entityFiles` methods require an `entityUniqueId` as the first argument.
//    Routes moved to `/entities/:unique_id/files`. New methods added for
//    presignUpload, multipart upload, associate/disassociate, and entity
//    management (listEntities, getEntity, registerEntity).
//  - `userFiles.presignUpload` / `multipartPresign` / `multipartComplete` now
//    return JSON:API-shaped responses with `presignedUrl`, `signedUrl`,
//    `publicUrl`, `fileName`, `fileId`, `expiresAt` fields.
// ─────────────────────────────────────────────────────────────────────────────

export * as authentication from '@23blocks/block-authentication';
export * as search from '@23blocks/block-search';
export * as products from '@23blocks/block-products';
export * as crm from '@23blocks/block-crm';
export * as content from '@23blocks/block-content';
export * as geolocation from '@23blocks/block-geolocation';
export * as conversations from '@23blocks/block-conversations';
export * as files from '@23blocks/block-files';
export * as forms from '@23blocks/block-forms';
export * as assets from '@23blocks/block-assets';
export * as campaigns from '@23blocks/block-campaigns';
export * as company from '@23blocks/block-company';
export * as rewards from '@23blocks/block-rewards';
export * as sales from '@23blocks/block-sales';
export * as wallet from '@23blocks/block-wallet';
export * as jarvis from '@23blocks/block-jarvis'; // includes analytics service
export * as onboarding from '@23blocks/block-onboarding';
export * as university from '@23blocks/block-university';
export * as rag from '@23blocks/block-rag';
