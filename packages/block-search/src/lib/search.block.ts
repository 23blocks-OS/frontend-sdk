import type { Transport, BlockConfig } from '@23blocks/contracts';
import {
  createSearchService,
  createSearchHistoryService,
  createFavoritesService,
  createEntitiesService,
  createIdentitiesService,
  createJarvisSearchService,
  type SearchService,
  type SearchHistoryService,
  type FavoritesService,
  type EntitiesService,
  type IdentitiesService,
  type JarvisSearchService,
} from './services/index.js';

/**
 * Configuration for the Search block
 */
export interface SearchBlockConfig extends BlockConfig {
  /** Application ID */
  appId: string;
  /** Default entity types to search (optional) */
  defaultEntityTypes?: string[];
}

/**
 * Search block interface
 */
export interface SearchBlock {
  /**
   * Core search operations
   */
  search: SearchService;

  /**
   * Search history management
   */
  history: SearchHistoryService;

  /**
   * Favorites/bookmarks management
   */
  favorites: FavoritesService;

  /**
   * Entity management for indexing
   */
  entities: EntitiesService;

  /**
   * Identity management for search users
   */
  identities: IdentitiesService;

  /**
   * Jarvis AI-enhanced search
   */
  jarvis: JarvisSearchService;
}

/**
 * Create the Search block
 *
 * @example
 * ```typescript
 * import { createSearchBlock } from '@23blocks/block-search';
 * import { createHttpTransport } from '@23blocks/transport-http';
 *
 * const transport = createHttpTransport({
 *   baseUrl: 'https://api.example.com',
 *   headers: () => ({
 *     'Authorization': `Bearer ${getToken()}`,
 *     'x-api-key': 'your-app-id',
 *   }),
 * });
 *
 * const searchBlock = createSearchBlock(transport, { appId: 'your-app-id' });
 *
 * // Execute a search
 * const { results, totalRecords } = await searchBlock.search.search({
 *   query: 'hello world',
 *   entityTypes: ['Product', 'Article'],
 *   limit: 20,
 * });
 *
 * // Get suggestions
 * const suggestions = await searchBlock.search.suggest('hel');
 *
 * // Get recent searches
 * const recent = await searchBlock.history.recent(10);
 *
 * // Add to favorites
 * await searchBlock.favorites.add({
 *   entityUniqueId: 'product-123',
 *   entityType: 'Product',
 *   entityAlias: 'My Favorite Product',
 * });
 * ```
 */
export function createSearchBlock(
  transport: Transport,
  config: SearchBlockConfig
): SearchBlock {
  return {
    search: createSearchService(transport, config),
    history: createSearchHistoryService(transport, config),
    favorites: createFavoritesService(transport, config),
    entities: createEntitiesService(transport, config),
    identities: createIdentitiesService(transport, config),
    jarvis: createJarvisSearchService(transport, config),
  };
}

/**
 * Block metadata
 */
export const searchBlockMetadata = {
  name: 'search',
  version: '0.0.1',
  description: 'Full-text search, suggestions, history, and favorites',
  resourceTypes: [
    'SearchResult',
    'SearchQuery',
    'LastQuery',
    'FavoriteEntity',
    'EntityType',
    'SearchEntity',
    'SearchIdentity',
    'JarvisSearchResult',
  ],
};
