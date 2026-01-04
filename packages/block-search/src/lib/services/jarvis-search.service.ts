import type { Transport, PageResult } from '@23blocks/contracts';
import { decodePageResult } from '@23blocks/jsonapi-codec';
import type { SearchResult } from '../types/search.js';
import { searchResultMapper } from '../mappers/search.mapper.js';

/**
 * Jarvis search query
 */
export interface JarvisSearchQuery {
  query: string;
  entityTypes?: string[];
  filters?: Record<string, unknown>;
  limit?: number;
  offset?: number;
  includeMetadata?: boolean;
  includeRelations?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Jarvis search result with AI-enhanced metadata
 */
export interface JarvisSearchResult extends SearchResult {
  confidence?: number;
  relevanceScore?: number;
  semanticMatches?: string[];
  suggestedActions?: string[];
}

/**
 * Jarvis Search Service - AI-enhanced entity search
 */
export interface JarvisSearchService {
  /**
   * Search entities using Jarvis AI-enhanced search
   */
  search(query: JarvisSearchQuery): Promise<PageResult<JarvisSearchResult>>;

  /**
   * Get semantic suggestions based on query
   */
  suggest(query: string, limit?: number): Promise<string[]>;

  /**
   * Get related entities based on an entity
   */
  getRelated(entityUniqueId: string, entityType: string, limit?: number): Promise<JarvisSearchResult[]>;
}

/**
 * Create the Jarvis Search service
 */
export function createJarvisSearchService(
  transport: Transport,
  _config: { appId: string }
): JarvisSearchService {
  const jarvisSearchResultMapper = {
    ...searchResultMapper,
    type: 'jarvis_search_result',
    map: (resource: unknown) => {
      const base = searchResultMapper.map(resource as Parameters<typeof searchResultMapper.map>[0]);
      const attrs = (resource as { attributes?: Record<string, unknown> })?.attributes ?? {};
      return {
        ...base,
        confidence: attrs['confidence'] as number | undefined,
        relevanceScore: attrs['relevance_score'] as number | undefined,
        semanticMatches: attrs['semantic_matches'] as string[] | undefined,
        suggestedActions: attrs['suggested_actions'] as string[] | undefined,
      } as JarvisSearchResult;
    },
  };

  return {
    async search(query: JarvisSearchQuery): Promise<PageResult<JarvisSearchResult>> {
      const response = await transport.post<unknown>('/jarvis/entities/search', {
        search: {
          query: query.query,
          entity_types: query.entityTypes,
          filters: query.filters,
          limit: query.limit,
          offset: query.offset,
          include_metadata: query.includeMetadata,
          include_relations: query.includeRelations,
          sort_by: query.sortBy,
          sort_order: query.sortOrder,
        },
      });
      return decodePageResult(response, jarvisSearchResultMapper);
    },

    async suggest(query: string, limit?: number): Promise<string[]> {
      const response = await transport.post<{ suggestions: string[] }>('/jarvis/entities/suggest', {
        query,
        limit,
      });
      return response.suggestions ?? [];
    },

    async getRelated(
      entityUniqueId: string,
      entityType: string,
      limit?: number
    ): Promise<JarvisSearchResult[]> {
      const response = await transport.post<{ data: unknown[] }>('/jarvis/entities/related', {
        entity_unique_id: entityUniqueId,
        entity_type: entityType,
        limit,
      });
      return (response.data ?? []).map((item) => jarvisSearchResultMapper.map(item as Parameters<typeof jarvisSearchResultMapper.map>[0]));
    },
  };
}
