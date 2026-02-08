import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Region,
  CreateRegionRequest,
  UpdateRegionRequest,
  ListRegionsParams,
} from '../types/region.js';
import { regionMapper } from '../mappers/region.mapper.js';

export interface RegionsService {
  /**
   * List all regions
   * @param params - Optional filtering by country code, search, status, and pagination
   * @returns Paginated result containing Region items and metadata
   */
  list(params?: ListRegionsParams): Promise<PageResult<Region>>;

  /**
   * Get a specific region
   * @param uniqueId - The unique identifier of the region
   * @returns The matching Region record
   */
  get(uniqueId: string): Promise<Region>;

  /**
   * Create a new region
   * @param data - Region details including name, code, country, and media URLs
   * @returns The newly created Region record
   */
  create(data: CreateRegionRequest): Promise<Region>;

  /**
   * Update an existing region
   * @param uniqueId - The unique identifier of the region to update
   * @param data - Fields to update such as name, code, country, media URLs, or status
   * @returns The updated Region record
   */
  update(uniqueId: string, data: UpdateRegionRequest): Promise<Region>;

  /**
   * Delete a region (soft delete)
   * @param uniqueId - The unique identifier of the region to delete
   * @returns Resolves when the region has been deleted
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Recover a previously deleted region
   * @param uniqueId - The unique identifier of the deleted region
   * @returns The recovered Region record
   */
  recover(uniqueId: string): Promise<Region>;

  /**
   * Search regions by query string
   * @param query - The search query text
   * @param params - Optional additional filtering and pagination
   * @returns Paginated result of Region records matching the search query
   */
  search(query: string, params?: ListRegionsParams): Promise<PageResult<Region>>;

  /**
   * List soft-deleted regions
   * @param params - Optional pagination parameters
   * @returns Paginated result of deleted Region records
   */
  listDeleted(params?: ListRegionsParams): Promise<PageResult<Region>>;
}

export function createRegionsService(transport: Transport, _config: { appId: string }): RegionsService {
  return {
    async list(params?: ListRegionsParams): Promise<PageResult<Region>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.countryCode) queryParams['country_code'] = params.countryCode;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/regions', { params: queryParams });
      return decodePageResult(response, regionMapper);
    },

    async get(uniqueId: string): Promise<Region> {
      const response = await transport.get<unknown>(`/regions/${uniqueId}`);
      return decodeOne(response, regionMapper);
    },

    async create(data: CreateRegionRequest): Promise<Region> {
      const response = await transport.post<unknown>('/regions', {
        region: {
            name: data.name,
            code: data.code,
            description: data.description,
            notes: data.notes,
            country_code: data.countryCode,
            country_name: data.countryName,
            image_url: data.imageUrl,
            tags: data.tags,
            source: data.source,
            source_alias: data.sourceAlias,
            source_id: data.sourceId,
          },
      });
      return decodeOne(response, regionMapper);
    },

    async update(uniqueId: string, data: UpdateRegionRequest): Promise<Region> {
      const response = await transport.put<unknown>(`/regions/${uniqueId}`, {
        region: {
            name: data.name,
            code: data.code,
            description: data.description,
            notes: data.notes,
            country_code: data.countryCode,
            country_name: data.countryName,
            image_url: data.imageUrl,
            content_url: data.contentUrl,
            media_url: data.mediaUrl,
            thumbnail_url: data.thumbnailUrl,
            icon_url: data.iconUrl,
            tags: data.tags,
            enabled: data.enabled,
            status: data.status,
          },
      });
      return decodeOne(response, regionMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/regions/${uniqueId}`);
    },

    async recover(uniqueId: string): Promise<Region> {
      const response = await transport.put<unknown>(`/regions/${uniqueId}/recover`, {});
      return decodeOne(response, regionMapper);
    },

    async search(query: string, params?: ListRegionsParams): Promise<PageResult<Region>> {
      const queryParams: Record<string, string> = { search: query };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.post<unknown>('/regions/search', { search: query }, { params: queryParams });
      return decodePageResult(response, regionMapper);
    },

    async listDeleted(params?: ListRegionsParams): Promise<PageResult<Region>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.get<unknown>('/regions/trash/show', { params: queryParams });
      return decodePageResult(response, regionMapper);
    },
  };
}
