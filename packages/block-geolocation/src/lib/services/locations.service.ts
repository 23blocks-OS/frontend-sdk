import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Location,
  CreateLocationRequest,
  UpdateLocationRequest,
  ListLocationsParams,
} from '../types/location';
import { locationMapper } from '../mappers/location.mapper';

export interface LocationsService {
  list(params?: ListLocationsParams): Promise<PageResult<Location>>;
  get(uniqueId: string): Promise<Location>;
  create(data: CreateLocationRequest): Promise<Location>;
  update(uniqueId: string, data: UpdateLocationRequest): Promise<Location>;
  delete(uniqueId: string): Promise<void>;
  recover(uniqueId: string): Promise<Location>;
  search(query: string, params?: ListLocationsParams): Promise<PageResult<Location>>;
  listDeleted(params?: ListLocationsParams): Promise<PageResult<Location>>;
  getQRCode(uniqueId: string): Promise<string>;
  searchByCode(code: string): Promise<Location[]>;
  addTag(uniqueId: string, tagUniqueId: string): Promise<Location>;
  removeTag(uniqueId: string, tagUniqueId: string): Promise<void>;
}

export function createLocationsService(transport: Transport, _config: { appId: string }): LocationsService {
  return {
    async list(params?: ListLocationsParams): Promise<PageResult<Location>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.ownerUniqueId) queryParams['owner_unique_id'] = params.ownerUniqueId;
      if (params?.ownerType) queryParams['owner_type'] = params.ownerType;
      if (params?.locationType) queryParams['location_type'] = params.locationType;
      if (params?.regionUniqueId) queryParams['region_unique_id'] = params.regionUniqueId;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/locations', { params: queryParams });
      return decodePageResult(response, locationMapper);
    },

    async get(uniqueId: string): Promise<Location> {
      const response = await transport.get<unknown>(`/locations/${uniqueId}`);
      return decodeOne(response, locationMapper);
    },

    async create(data: CreateLocationRequest): Promise<Location> {
      const response = await transport.post<unknown>('/locations', {
        location: {
            name: data.name,
            code: data.code,
            owner_unique_id: data.ownerUniqueId,
            owner_type: data.ownerType,
            source: data.source,
            address_unique_id: data.addressUniqueId,
            area_unique_id: data.areaUniqueId,
            location_parent_id: data.locationParentId,
            latitude: data.latitude,
            longitude: data.longitude,
            location_type: data.locationType,
            region_unique_id: data.regionUniqueId,
            image_url: data.imageUrl,
            payload: data.payload,
          },
      });
      return decodeOne(response, locationMapper);
    },

    async update(uniqueId: string, data: UpdateLocationRequest): Promise<Location> {
      const response = await transport.put<unknown>(`/locations/${uniqueId}`, {
        location: {
            name: data.name,
            code: data.code,
            address_unique_id: data.addressUniqueId,
            area_unique_id: data.areaUniqueId,
            latitude: data.latitude,
            longitude: data.longitude,
            location_type: data.locationType,
            image_url: data.imageUrl,
            video_url: data.videoUrl,
            content_url: data.contentUrl,
            icon_url: data.iconUrl,
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
          },
      });
      return decodeOne(response, locationMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/locations/${uniqueId}`);
    },

    async recover(uniqueId: string): Promise<Location> {
      const response = await transport.put<unknown>(`/locations/${uniqueId}/recover`, {});
      return decodeOne(response, locationMapper);
    },

    async search(query: string, params?: ListLocationsParams): Promise<PageResult<Location>> {
      const queryParams: Record<string, string> = { search: query };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.post<unknown>('/locations/search', { search: query }, { params: queryParams });
      return decodePageResult(response, locationMapper);
    },

    async listDeleted(params?: ListLocationsParams): Promise<PageResult<Location>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.get<unknown>('/locations/trash/show', { params: queryParams });
      return decodePageResult(response, locationMapper);
    },

    async getQRCode(uniqueId: string): Promise<string> {
      const response = await transport.get<unknown>(`/locations/${uniqueId}/qrcode`);
      return response as string;
    },

    async searchByCode(code: string): Promise<Location[]> {
      const response = await transport.post<unknown>('/locations/search/code', {
        code,
      });
      return decodeMany(response, locationMapper);
    },

    async addTag(uniqueId: string, tagUniqueId: string): Promise<Location> {
      const response = await transport.post<unknown>(`/locations/${uniqueId}/tags/`, {
        tag: { tag_unique_id: tagUniqueId },
      });
      return decodeOne(response, locationMapper);
    },

    async removeTag(uniqueId: string, tagUniqueId: string): Promise<void> {
      await transport.delete(`/locations/${uniqueId}/tags/${tagUniqueId}`);
    },
  };
}
