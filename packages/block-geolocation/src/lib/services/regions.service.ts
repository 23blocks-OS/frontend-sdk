import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Region,
  CreateRegionRequest,
  UpdateRegionRequest,
  ListRegionsParams,
} from '../types/region';
import { regionMapper } from '../mappers/region.mapper';

export interface RegionsService {
  list(params?: ListRegionsParams): Promise<PageResult<Region>>;
  get(uniqueId: string): Promise<Region>;
  create(data: CreateRegionRequest): Promise<Region>;
  update(uniqueId: string, data: UpdateRegionRequest): Promise<Region>;
  delete(uniqueId: string): Promise<void>;
  recover(uniqueId: string): Promise<Region>;
  search(query: string, params?: ListRegionsParams): Promise<PageResult<Region>>;
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
        data: {
          type: 'Region',
          attributes: {
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
        },
      });
      return decodeOne(response, regionMapper);
    },

    async update(uniqueId: string, data: UpdateRegionRequest): Promise<Region> {
      const response = await transport.put<unknown>(`/regions/${uniqueId}`, {
        data: {
          type: 'Region',
          attributes: {
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
