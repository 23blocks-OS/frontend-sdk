import type { Transport, PageResult, ListParams } from '@23blocks/contracts';
import type { JsonApiDocument } from '@23blocks/jsonapi-codec';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  SearchResult,
  SearchQuery,
  LastQuery,
  FavoriteEntity,
  EntityType,
  SearchRequest,
  SearchResponse,
  AddFavoriteRequest,
} from '../types/index.js';
import {
  searchResultMapper,
  searchQueryMapper,
  lastQueryMapper,
  favoriteEntityMapper,
  entityTypeMapper,
} from '../mappers/index.js';
import type { SearchBlockConfig } from '../search.block.js';

/**
 * Search service interface
 */
export interface SearchService {
  /**
   * Execute a search query
   */
  search(request: SearchRequest): Promise<SearchResponse>;

  /**
   * Get search suggestions/autocomplete
   */
  suggest(query: string, limit?: number): Promise<SearchResult[]>;

  /**
   * Get available entity types
   */
  entityTypes(): Promise<EntityType[]>;
}

/**
 * Search history service interface
 */
export interface SearchHistoryService {
  /**
   * Get recent searches for the current user
   */
  recent(limit?: number): Promise<LastQuery[]>;

  /**
   * Get a specific query by ID
   */
  get(id: string): Promise<SearchQuery>;

  /**
   * Clear search history
   */
  clear(): Promise<void>;

  /**
   * Delete a specific query from history
   */
  delete(id: string): Promise<void>;
}

/**
 * Favorites service interface
 */
export interface FavoritesService {
  /**
   * List user's favorites
   */
  list(params?: ListParams): Promise<PageResult<FavoriteEntity>>;

  /**
   * Get a favorite by ID
   */
  get(id: string): Promise<FavoriteEntity>;

  /**
   * Add a favorite
   */
  add(request: AddFavoriteRequest): Promise<FavoriteEntity>;

  /**
   * Remove a favorite
   */
  remove(id: string): Promise<void>;

  /**
   * Check if an entity is favorited
   */
  isFavorite(entityUniqueId: string): Promise<boolean>;
}

/**
 * Build filter params for list operations
 */
function buildListParams(params?: ListParams): Record<string, string | number | boolean | string[] | undefined> {
  if (!params) return {};

  const queryParams: Record<string, string | number | boolean | string[] | undefined> = {};

  if (params.page) {
    queryParams['page[number]'] = params.page;
  }
  if (params.perPage) {
    queryParams['page[size]'] = params.perPage;
  }

  if (params.sort) {
    const sorts = Array.isArray(params.sort) ? params.sort : [params.sort];
    queryParams['sort'] = sorts
      .map((s) => (s.direction === 'desc' ? `-${s.field}` : s.field))
      .join(',');
  }

  if (params.filter) {
    for (const [key, value] of Object.entries(params.filter)) {
      queryParams[`filter[${key}]`] = value;
    }
  }

  return queryParams;
}

/**
 * Create the search service
 */
export function createSearchService(
  transport: Transport,
  _config: SearchBlockConfig
): SearchService {
  return {
    async search(request: SearchRequest): Promise<SearchResponse> {
      const response = await transport.post<JsonApiDocument & {
        meta?: {
          total_records?: number;
          elapsed_time?: number;
          query?: unknown;
        };
      }>('/search', {
        query: request.query,
        entity_types: request.entityTypes,
        include: request.include,
        exclude: request.exclude,
        limit: request.limit,
        offset: request.offset,
      });

      const results = decodeMany(response, searchResultMapper);

      // Extract query from meta if available
      let query: SearchQuery;
      if (response.meta?.query) {
        // The query comes in meta for search responses
        query = {
          id: '',
          uniqueId: '',
          createdAt: new Date(),
          updatedAt: new Date(),
          partition: null,
          key: null,
          query: request.query,
          include: request.include ?? null,
          exclude: request.exclude ?? null,
          payload: null,
          userUniqueId: null,
          userProviderName: null,
          userName: null,
          userEmail: null,
          userRole: null,
          userRoleUniqueId: null,
          userRoleName: null,
          queryString: null,
          userAgent: null,
          url: null,
          path: null,
          ipaddress: null,
          origin: null,
          source: null,
          submittedAt: new Date(),
          device: null,
          browser: null,
          hash: null,
          elapsedTime: response.meta.elapsed_time ?? null,
          startedAt: null,
          endedAt: null,
          totalRecords: response.meta.total_records ?? results.length,
          totalRecordsReturned: results.length,
          queryOrigin: null,
        };
      } else {
        query = {
          id: '',
          uniqueId: '',
          createdAt: new Date(),
          updatedAt: new Date(),
          partition: null,
          key: null,
          query: request.query,
          include: request.include ?? null,
          exclude: request.exclude ?? null,
          payload: null,
          userUniqueId: null,
          userProviderName: null,
          userName: null,
          userEmail: null,
          userRole: null,
          userRoleUniqueId: null,
          userRoleName: null,
          queryString: null,
          userAgent: null,
          url: null,
          path: null,
          ipaddress: null,
          origin: null,
          source: null,
          submittedAt: new Date(),
          device: null,
          browser: null,
          hash: null,
          elapsedTime: null,
          startedAt: null,
          endedAt: null,
          totalRecords: results.length,
          totalRecordsReturned: results.length,
          queryOrigin: null,
        };
      }

      return {
        results,
        query,
        totalRecords: response.meta?.total_records ?? results.length,
        elapsedTime: response.meta?.elapsed_time ?? 0,
      };
    },

    async suggest(query: string, limit = 10): Promise<SearchResult[]> {
      const response = await transport.get<JsonApiDocument>(
        '/search/suggest',
        { params: { q: query, limit } }
      );
      return decodeMany(response, searchResultMapper);
    },

    async entityTypes(): Promise<EntityType[]> {
      const response = await transport.get<JsonApiDocument>('/search/entity_types');
      return decodeMany(response, entityTypeMapper);
    },
  };
}

/**
 * Create the search history service
 */
export function createSearchHistoryService(
  transport: Transport,
  _config: SearchBlockConfig
): SearchHistoryService {
  return {
    async recent(limit = 20): Promise<LastQuery[]> {
      const response = await transport.get<JsonApiDocument>(
        '/search/history',
        { params: { limit } }
      );
      return decodeMany(response, lastQueryMapper);
    },

    async get(id: string): Promise<SearchQuery> {
      const response = await transport.get<JsonApiDocument>(`/search/queries/${id}`);
      return decodeOne(response, searchQueryMapper);
    },

    async clear(): Promise<void> {
      await transport.delete('/search/history');
    },

    async delete(id: string): Promise<void> {
      await transport.delete(`/search/history/${id}`);
    },
  };
}

/**
 * Create the favorites service
 */
export function createFavoritesService(
  transport: Transport,
  _config: SearchBlockConfig
): FavoritesService {
  return {
    async list(params?: ListParams): Promise<PageResult<FavoriteEntity>> {
      const response = await transport.get<JsonApiDocument>(
        '/search/favorites',
        { params: buildListParams(params) }
      );
      return decodePageResult(response, favoriteEntityMapper);
    },

    async get(id: string): Promise<FavoriteEntity> {
      const response = await transport.get<JsonApiDocument>(`/search/favorites/${id}`);
      return decodeOne(response, favoriteEntityMapper);
    },

    async add(request: AddFavoriteRequest): Promise<FavoriteEntity> {
      const response = await transport.post<JsonApiDocument>('/search/favorites', {
        entity_unique_id: request.entityUniqueId,
        entity_type: request.entityType,
        entity_alias: request.entityAlias,
        entity_url: request.entityUrl,
        entity_avatar_url: request.entityAvatarUrl,
      });
      return decodeOne(response, favoriteEntityMapper);
    },

    async remove(id: string): Promise<void> {
      await transport.delete(`/search/favorites/${id}`);
    },

    async isFavorite(entityUniqueId: string): Promise<boolean> {
      try {
        const response = await transport.get<{ data: { favorite: boolean } }>(
          `/search/favorites/check/${entityUniqueId}`
        );
        return response.data?.favorite ?? false;
      } catch {
        return false;
      }
    },
  };
}
