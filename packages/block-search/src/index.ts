// Block factory and config
export {
  createSearchBlock,
  searchBlockMetadata,
  type SearchBlock,
  type SearchBlockConfig,
} from './lib/search.block.js';

// Types
export type {
  SearchResult,
  SearchQuery,
  LastQuery,
  FavoriteEntity,
  EntityType,
  SearchRequest,
  SearchResponse,
  AddFavoriteRequest,
} from './lib/types/index.js';

// Services
export type {
  SearchService,
  SearchHistoryService,
  FavoritesService,
} from './lib/services/index.js';

// Mappers (for advanced use cases)
export {
  searchResultMapper,
  searchQueryMapper,
  lastQueryMapper,
  favoriteEntityMapper,
  entityTypeMapper,
} from './lib/mappers/index.js';
