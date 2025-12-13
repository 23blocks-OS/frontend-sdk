// ─────────────────────────────────────────────────────────────────────────────
// Client Factory (Recommended API)
// ─────────────────────────────────────────────────────────────────────────────

export {
  create23BlocksClient,
  type AuthMode,
  type ClientConfig,
  type Blocks23Client,
  type ManagedAuthService,
  type StorageType,
  type TokenManager,
} from './client.js';

export { createTokenManager } from './token-manager.js';

// ─────────────────────────────────────────────────────────────────────────────
// Core
// ─────────────────────────────────────────────────────────────────────────────

export * from '@23blocks/contracts';
export * from '@23blocks/jsonapi-codec';
export * from '@23blocks/transport-http';

// ─────────────────────────────────────────────────────────────────────────────
// Blocks (for advanced users who need custom transport)
// ─────────────────────────────────────────────────────────────────────────────

export * from '@23blocks/block-authentication';
export * from '@23blocks/block-search';
export * from '@23blocks/block-products';
export * from '@23blocks/block-crm';
export * from '@23blocks/block-content';
export * from '@23blocks/block-geolocation';
export * from '@23blocks/block-conversations';
export * from '@23blocks/block-files';
export * from '@23blocks/block-forms';
export * from '@23blocks/block-assets';
export * from '@23blocks/block-campaigns';
export * from '@23blocks/block-company';
export * from '@23blocks/block-rewards';
export * from '@23blocks/block-sales';
export * from '@23blocks/block-wallet';
export * from '@23blocks/block-jarvis';
export * from '@23blocks/block-onboarding';
export * from '@23blocks/block-university';
