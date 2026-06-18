import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Location,
  CreateLocationRequest,
  UpdateLocationRequest,
  ListLocationsParams,
} from '../types/location.js';
import { locationMapper } from '../mappers/location.mapper.js';

export interface LocationsService {
  /**
   * List all locations
   * @param params - Optional filtering by owner, type, region, search, and pagination
   * @returns Paginated result containing Location items and metadata
   */
  list(params?: ListLocationsParams): Promise<PageResult<Location>>;

  /**
   * Get a specific location
   * @param uniqueId - The unique identifier of the location
   * @returns The matching Location record
   */
  get(uniqueId: string): Promise<Location>;

  /**
   * Create a new location
   * @param data - Location details including name, code, owner, coordinates, and type
   * @returns The newly created Location record
   */
  create(data: CreateLocationRequest): Promise<Location>;

  /**
   * Update an existing location
   * @param uniqueId - The unique identifier of the location to update
   * @param data - Fields to update such as name, coordinates, media URLs, or status
   * @returns The updated Location record
   */
  update(uniqueId: string, data: UpdateLocationRequest): Promise<Location>;

  /**
   * Delete a location (soft delete)
   * @param uniqueId - The unique identifier of the location to delete
   * @returns Resolves when the location has been deleted
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Recover a previously deleted location
   * @param uniqueId - The unique identifier of the deleted location
   * @returns The recovered Location record
   */
  recover(uniqueId: string): Promise<Location>;

  /**
   * Search locations by query string
   * @param query - The search query text
   * @param params - Optional additional filtering and pagination
   * @returns Paginated result of Location records matching the search query
   */
  search(query: string, params?: ListLocationsParams): Promise<PageResult<Location>>;

  /**
   * List soft-deleted locations
   * @param params - Optional pagination parameters
   * @returns Paginated result of deleted Location records
   */
  listDeleted(params?: ListLocationsParams): Promise<PageResult<Location>>;

  /**
   * Get a QR code for a location
   * @param uniqueId - The unique identifier of the location
   * @returns The QR code data as a string
   */
  getQRCode(uniqueId: string): Promise<string>;

  /**
   * Search locations by their code
   * @param code - The location code to search for
   * @returns Array of Location records matching the code
   */
  searchByCode(code: string): Promise<Location[]>;

  /**
   * Add a tag to a location
   * @param uniqueId - The unique identifier of the location
   * @param tagUniqueId - The unique identifier of the tag to add
   * @returns The updated Location record with the tag applied
   */
  addTag(uniqueId: string, tagUniqueId: string): Promise<Location>;

  /**
   * Remove a tag from a location
   * @param uniqueId - The unique identifier of the location
   * @param tagUniqueId - The unique identifier of the tag to remove
   * @returns Resolves when the tag has been removed
   */
  removeTag(uniqueId: string, tagUniqueId: string): Promise<void>;
}

export function createLocationsService(transport: Transport, _config: { apiKey: string }): LocationsService {
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
      // Geolocation API doesn't expose POST /locations/search — search is a
      // query-string filter on the index endpoint. Confirmed by
      // api-geolocation in msg_1781742840_c5f7175b.
      const queryParams: Record<string, string> = { search: query };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.get<unknown>('/locations', { params: queryParams });
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
