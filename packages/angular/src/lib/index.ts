// ─────────────────────────────────────────────────────────────────────────────
// Main API (Recommended) — token lifecycle with auto-refresh and 401 retry
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

  // Token lifecycle
  type TokenLifecycleConfig,
  type TokenLifecycleManagerService,
  type AuthStateEvent,
  type AuthStateListener,
  TOKEN_LIFECYCLE,

  // Backward compatibility (deprecated)
  type Simple23BlocksConfig,
  SIMPLE_CONFIG,
} from './simple-providers';

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
  RAG_TRANSPORT,
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
  RAG_CONFIG,
} from './tokens';

// Provider functions (advanced - requires custom transport)
export { provide23Blocks, get23BlocksProviders, type Provide23BlocksConfig } from './providers';

// Services
export { AuthenticationService } from './authentication/index';
export { SearchService } from './search/index';
export { ProductsService } from './products/index';
export { CrmService } from './crm/index';
export { ContentService } from './content/index';
export { GeolocationService } from './geolocation/index';
export { ConversationsService } from './conversations/index';
export { FilesService } from './files/index';
export { FormsService } from './forms/index';
export { AssetsService } from './assets/index';
export { CampaignsService } from './campaigns/index';
export { CompanyService } from './company/index';
export { RewardsService } from './rewards/index';
export { SalesService } from './sales/index';
export { WalletService } from './wallet/index';
export { JarvisService } from './jarvis/index';
export { OnboardingService } from './onboarding/index';
export { UniversityService } from './university/index';
export { RagService } from './rag/index';
