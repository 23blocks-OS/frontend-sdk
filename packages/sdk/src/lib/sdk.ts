// ─────────────────────────────────────────────────────────────────────────────
// Client Factory (Recommended API) — conversations inline message actions, products block aligned with backend strong params
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

export { createTokenManager } from './token-manager.js';

// ─────────────────────────────────────────────────────────────────────────────
// Core (safe to re-export directly - no conflicts)
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
