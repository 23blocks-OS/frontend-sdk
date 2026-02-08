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
   * Execute a search query against the search index.
   * @param request - The search request containing query text, optional entity type filters, include/exclude lists, and pagination (limit/offset).
   * @returns A {@link SearchResponse} containing the matched results array, a synthesized {@link SearchQuery} with execution metadata (elapsed time, total records), and summary counts.
   * @note The returned `query` object is constructed from response metadata when available; otherwise it is synthesized client-side with default/null values.
   */
  search(request: SearchRequest): Promise<SearchResponse>;

  /**
   * Get search suggestions/autocomplete results for a partial query.
   * @param query - The partial text to generate suggestions for.
   * @param limit - Maximum number of suggestions to return. Defaults to 10.
   * @returns An array of {@link SearchResult} items matching the suggestion query.
   */
  suggest(query: string, limit?: number): Promise<SearchResult[]>;

  /**
   * Get all available entity types that can be searched.
   * @returns An array of {@link EntityType} objects, each containing the type identifier and source.
   */
  entityTypes(): Promise<EntityType[]>;
}

/**
 * Search history service interface
 */
export interface SearchHistoryService {
  /**
   * Get recent searches for the current user.
   * @param limit - Maximum number of recent queries to return. Defaults to 20.
   * @returns An array of {@link LastQuery} objects representing the user's recent search history, including query text, user context, and execution statistics.
   */
  recent(limit?: number): Promise<LastQuery[]>;

  /**
   * Get a specific saved query by its unique ID.
   * @param uniqueId - The unique identifier of the query to retrieve.
   * @returns The full {@link SearchQuery} record including query text, user context, execution timing, and result counts.
   */
  get(uniqueId: string): Promise<SearchQuery>;

  /**
   * Clear all search history for the current user.
   * @returns Resolves with no value on successful deletion.
   * @note This deletes the entire search history; individual entries cannot be restored after clearing.
   */
  clear(): Promise<void>;

  /**
   * Delete a specific query from the search history.
   * @param uniqueId - The unique identifier of the history entry to delete.
   * @returns Resolves with no value on successful deletion.
   */
  delete(uniqueId: string): Promise<void>;
}

/**
 * Favorites service interface
 */
export interface FavoritesService {
  /**
   * List the current user's favorite entities with optional pagination, sorting, and filtering.
   * @param params - Optional {@link ListParams} for pagination, sorting, and filtering.
   * @returns A paginated result containing an array of {@link FavoriteEntity} items and pagination metadata.
   */
  list(params?: ListParams): Promise<PageResult<FavoriteEntity>>;

  /**
   * Get a single favorite by its unique ID.
   * @param uniqueId - The unique identifier of the favorite entry.
   * @returns The matching {@link FavoriteEntity}.
   */
  get(uniqueId: string): Promise<FavoriteEntity>;

  /**
   * Add an entity to the user's favorites.
   * @param request - The favorite request containing the entity's unique ID, type, and optional alias/URL/avatar fields.
   * @returns The newly created {@link FavoriteEntity} as persisted by the backend.
   */
  add(request: AddFavoriteRequest): Promise<FavoriteEntity>;

  /**
   * Remove a favorite by its unique ID.
   * @param uniqueId - The unique identifier of the favorite entry to remove.
   * @returns Resolves with no value on successful removal.
   */
  remove(uniqueId: string): Promise<void>;

  /**
   * Check whether a given entity is in the user's favorites.
   * @param entityUniqueId - The unique identifier of the entity to check.
   * @returns `true` if the entity is favorited, `false` otherwise.
   * @note Returns `false` on any error (e.g., network failure or 404), rather than throwing.
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
    queryParams['page'] = params.page;
  }
  if (params.perPage) {
    queryParams['records'] = params.perPage;
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

    async get(uniqueId: string): Promise<SearchQuery> {
      const response = await transport.get<JsonApiDocument>(`/search/queries/${uniqueId}`);
      return decodeOne(response, searchQueryMapper);
    },

    async clear(): Promise<void> {
      await transport.delete('/search/history');
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/search/history/${uniqueId}`);
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

    async get(uniqueId: string): Promise<FavoriteEntity> {
      const response = await transport.get<JsonApiDocument>(`/search/favorites/${uniqueId}`);
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

    async remove(uniqueId: string): Promise<void> {
      await transport.delete(`/search/favorites/${uniqueId}`);
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
