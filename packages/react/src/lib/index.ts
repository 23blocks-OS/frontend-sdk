// ─────────────────────────────────────────────────────────────────────────────
// Runtime UUID validation
//
// `isUuid` and `assertUuid` (from @23blocks/contracts, re-exported via
// @23blocks/sdk) are now used internally to validate path-param UUIDs on
// endpoints confirmed to require strict RFC 4122 format. Methods on
// useConversationsBlock().{contexts,conversations,messages,...} and the
// jarvis context endpoint throw a TypeError at the call site if you pass a
// non-UUID value, with an actionable message and a suggestion to use
// `reference`/`source_id`/`source_alias` for custom identifiers.
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Main API (Recommended) — token lifecycle, auto-refresh, 401 retry, AID tokenEndpoint and company fields
//
// Breaking changes for useFilesBlock():
//  - `storageFiles` methods require a `urlId` (company tenant identifier) as
//    the first argument. Routes moved to `/storage/:url_id/files`.
//  - `entityFiles` methods require an `entityUniqueId` as the first argument.
//    Routes moved to `/entities/:unique_id/files`. New methods added for
//    presignUpload, multipart upload, associate/disassociate, and entity
//    management (listEntities, getEntity, registerEntity).
//  - `userFiles.presignUpload` / `multipartPresign` / `multipartComplete` now
//    return JSON:API-shaped responses with `presignedUrl`, `signedUrl`,
//    `publicUrl`, `fileName`, `fileId`, `expiresAt` fields.
// ─────────────────────────────────────────────────────────────────────────────
export {
  // Main exports
  Provider,
  useClient,
  useAuth,
  useUser,
  type ProviderProps,
  type ClientContext,
  type ServiceUrls,
  type AuthMode,
  type StorageType,
  type TokenManager,
  type AsyncStorageInterface,
  type UseUserReturn,
  type AuthStateEvent,
  type AuthStateListener,
  type TokenLifecycleConfig,

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
  // User management (admin operations)
  useUsers,
  type UseUsersReturn,
  type UseUsersState,
  type UseUsersActions,

  // MFA
  useMfa,
  type UseMfaReturn,
  type UseMfaState,
  type UseMfaActions,

  // OAuth
  useOAuth,
  type UseOAuthReturn,
  type UseOAuthState,
  type UseOAuthActions,

  // Avatars
  useAvatars,
  type UseAvatarsReturn,
  type UseAvatarsState,
  type UseAvatarsActions,

  // Tenants
  useTenants,
  type UseTenantsReturn,
  type UseTenantsState,
  type UseTenantsActions,

  // Search
  useSearch,
  useFavorites,
  type UseSearchReturn,
  type UseSearchState,
  type UseSearchActions,
  type UseFavoritesReturn,
  type UseFavoritesState,
  type UseFavoritesActions,

  // Content
  useContentSeries,
  type UseContentSeriesReturn,
  type UseContentSeriesState,
  type UseContentSeriesActions,
} from './hooks/index.js';
