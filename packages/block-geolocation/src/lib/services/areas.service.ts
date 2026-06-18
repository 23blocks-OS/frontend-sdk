import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Area,
  CreateAreaRequest,
  UpdateAreaRequest,
  ListAreasParams,
} from '../types/area.js';
import { areaMapper } from '../mappers/area.mapper.js';

export interface AreasService {
  /**
   * List all geographic areas
   * @param params - Optional filtering by area type, address, search, and pagination
   * @returns Paginated result containing Area items and metadata
   */
  list(params?: ListAreasParams): Promise<PageResult<Area>>;

  /**
   * Get a specific area
   * @param uniqueId - The unique identifier of the area
   * @returns The matching Area record
   */
  get(uniqueId: string): Promise<Area>;

  /**
   * Create a new geographic area
   * @param data - Area details including name, code, type, and boundary points
   * @returns The newly created Area record
   */
  create(data: CreateAreaRequest): Promise<Area>;

  /**
   * Update an existing area
   * @param uniqueId - The unique identifier of the area to update
   * @param data - Fields to update such as name, boundary points, or status
   * @returns The updated Area record
   */
  update(uniqueId: string, data: UpdateAreaRequest): Promise<Area>;

  /**
   * Delete an area (soft delete)
   * @param uniqueId - The unique identifier of the area to delete
   * @returns Resolves when the area has been deleted
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Recover a previously deleted area
   * @param uniqueId - The unique identifier of the deleted area
   * @returns The recovered Area record
   */
  recover(uniqueId: string): Promise<Area>;

  /**
   * List soft-deleted areas
   * @param params - Optional pagination parameters
   * @returns Paginated result of deleted Area records
   */
  listDeleted(params?: ListAreasParams): Promise<PageResult<Area>>;
}

export function createAreasService(transport: Transport, _config: { apiKey: string }): AreasService {
  return {
    async list(params?: ListAreasParams): Promise<PageResult<Area>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.areaType) queryParams['area_type'] = params.areaType;
      if (params?.addressUniqueId) queryParams['address_unique_id'] = params.addressUniqueId;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/areas', { params: queryParams });
      return decodePageResult(response, areaMapper);
    },

    async get(uniqueId: string): Promise<Area> {
      const response = await transport.get<unknown>(`/areas/${uniqueId}`);
      return decodeOne(response, areaMapper);
    },

    async create(data: CreateAreaRequest): Promise<Area> {
      const response = await transport.post<unknown>('/areas', {
        area: {
            name: data.name,
            code: data.code,
            address_unique_id: data.addressUniqueId,
            source: data.source,
            area_type: data.areaType,
            area_points: data.areaPoints,
            tags: data.tags,
            payload: data.payload,
          },
      });
      return decodeOne(response, areaMapper);
    },

    async update(uniqueId: string, data: UpdateAreaRequest): Promise<Area> {
      const response = await transport.put<unknown>(`/areas/${uniqueId}`, {
        area: {
            name: data.name,
            code: data.code,
            address_unique_id: data.addressUniqueId,
            area_type: data.areaType,
            area_points: data.areaPoints,
            enabled: data.enabled,
            status: data.status,
            tags: data.tags,
            payload: data.payload,
          },
      });
      return decodeOne(response, areaMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/areas/${uniqueId}`);
    },

    async recover(uniqueId: string): Promise<Area> {
      const response = await transport.put<unknown>(`/areas/${uniqueId}/recover`, {});
      return decodeOne(response, areaMapper);
    },

    async listDeleted(params?: ListAreasParams): Promise<PageResult<Area>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.get<unknown>('/areas/trash/show', { params: queryParams });
      return decodePageResult(response, areaMapper);
    },
  };
}
