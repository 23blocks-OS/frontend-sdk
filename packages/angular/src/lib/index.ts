// ─────────────────────────────────────────────────────────────────────────────
// Main API (Recommended)
// ─────────────────────────────────────────────────────────────────────────────
export {
  // Main exports
  provideBlocks23,
  getBlocks23Providers,
  type ProviderConfig,
  type ServiceUrls,
  type AuthMode,
  type StorageType,
  type TokenManagerService,
  TOKEN_MANAGER,
  PROVIDER_CONFIG,

  // Backward compatibility (deprecated)
  type Simple23BlocksConfig,
  SIMPLE_CONFIG,
} from './simple-providers.js';

// ─────────────────────────────────────────────────────────────────────────────
// Advanced API (Custom transport)
// ─────────────────────────────────────────────────────────────────────────────
// Tokens
export {
  // Legacy shared transport (deprecated)
  TRANSPORT,
  // Per-service transport tokens
  AUTHENTICATION_TRANSPORT,
  SEARCH_TRANSPORT,
  PRODUCTS_TRANSPORT,
  CRM_TRANSPORT,
  CONTENT_TRANSPORT,
  GEOLOCATION_TRANSPORT,
  CONVERSATIONS_TRANSPORT,
  FILES_TRANSPORT,
  FORMS_TRANSPORT,
  ASSETS_TRANSPORT,
  CAMPAIGNS_TRANSPORT,
  COMPANY_TRANSPORT,
  REWARDS_TRANSPORT,
  SALES_TRANSPORT,
  WALLET_TRANSPORT,
  JARVIS_TRANSPORT,
  ONBOARDING_TRANSPORT,
  UNIVERSITY_TRANSPORT,
  // Config tokens
  AUTHENTICATION_CONFIG,
  SEARCH_CONFIG,
  PRODUCTS_CONFIG,
  CRM_CONFIG,
  CONTENT_CONFIG,
  GEOLOCATION_CONFIG,
  CONVERSATIONS_CONFIG,
  FILES_CONFIG,
  FORMS_CONFIG,
  ASSETS_CONFIG,
  CAMPAIGNS_CONFIG,
  COMPANY_CONFIG,
  REWARDS_CONFIG,
  SALES_CONFIG,
  WALLET_CONFIG,
  JARVIS_CONFIG,
  ONBOARDING_CONFIG,
  UNIVERSITY_CONFIG,
} from './tokens.js';

// Provider functions (advanced - requires custom transport)
export { provide23Blocks, get23BlocksProviders, type Provide23BlocksConfig } from './providers.js';

// Services
export { AuthenticationService } from './authentication/index.js';
export { SearchService } from './search/index.js';
export { ProductsService } from './products/index.js';
export { CrmService } from './crm/index.js';
export { ContentService } from './content/index.js';
export { GeolocationService } from './geolocation/index.js';
export { ConversationsService } from './conversations/index.js';
export { FilesService } from './files/index.js';
export { FormsService } from './forms/index.js';
export { AssetsService } from './assets/index.js';
export { CampaignsService } from './campaigns/index.js';
export { CompanyService } from './company/index.js';
export { RewardsService } from './rewards/index.js';
export { SalesService } from './sales/index.js';
export { WalletService } from './wallet/index.js';
export { JarvisService } from './jarvis/index.js';
export { OnboardingService } from './onboarding/index.js';
export { UniversityService } from './university/index.js';
