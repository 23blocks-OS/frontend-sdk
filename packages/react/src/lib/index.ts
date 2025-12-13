// Context and Provider
export {
  Blocks23Provider,
  use23Blocks,
  useAuthenticationBlock,
  useSearchBlock,
  type Blocks23ProviderProps,
  type Blocks23Context,
} from './context.js';

// Hooks
export {
  // Auth
  useAuth,
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
