// ─────────────────────────────────────────────────────────────────────────────
// Main API (Recommended)
// ─────────────────────────────────────────────────────────────────────────────
export {
  // Main exports
  Provider,
  useClient,
  useAuth,
  type ProviderProps,
  type ClientContext,
  type ServiceUrls,
  type AuthMode,
  type StorageType,
  type TokenManager,

  // Backward compatibility (deprecated)
  SimpleBlocks23Provider,
  useSimpleBlocks23,
  useSimpleAuth,
  type SimpleBlocks23ProviderProps,
  type SimpleBlocks23Context,
} from './simple-provider.js';

// ─────────────────────────────────────────────────────────────────────────────
// Advanced API (Custom transport)
// ─────────────────────────────────────────────────────────────────────────────
// Context and Provider
export {
  Blocks23Provider,
  use23Blocks,
  useAuthenticationBlock,
  useSearchBlock,
  useProductsBlock,
  useCrmBlock,
  useContentBlock,
  useGeolocationBlock,
  useConversationsBlock,
  useFilesBlock,
  useFormsBlock,
  useAssetsBlock,
  useCampaignsBlock,
  useCompanyBlock,
  useRewardsBlock,
  useSalesBlock,
  useWalletBlock,
  useJarvisBlock,
  useOnboardingBlock,
  useUniversityBlock,
  type Blocks23ProviderProps,
  type Blocks23Context,
} from './context.js';

// Hooks (for advanced API with custom transport)
export {
  // Auth - renamed to avoid conflict with main useAuth
  useAuth as useAuthState,
  useUsers,
  type UseAuthReturn,
  type UseAuthState,
  type UseAuthActions,
  type UseUsersReturn,
  type UseUsersState,
  type UseUsersActions,

  // Search
  useSearch,
  useFavorites,
  type UseSearchReturn,
  type UseSearchState,
  type UseSearchActions,
  type UseFavoritesReturn,
  type UseFavoritesState,
  type UseFavoritesActions,
} from './hooks/index.js';
