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
// `isUuid` and `assertUuid` are exported from @23blocks/contracts. The SDK
// uses `assertUuid` internally to validate path-param UUIDs on endpoints
// confirmed by each block's API team to require strict RFC 4122 format.
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
