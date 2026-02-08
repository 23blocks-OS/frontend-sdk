import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  TravelRoute,
  CreateTravelRouteRequest,
  UpdateTravelRouteRequest,
  ListTravelRoutesParams,
} from '../types/route.js';
import { travelRouteMapper } from '../mappers/route.mapper.js';

export interface TravelRoutesService {
  /**
   * List all travel routes
   * @param params - Optional filtering by owner, status, search, and pagination
   * @returns Paginated result containing TravelRoute items and metadata
   */
  list(params?: ListTravelRoutesParams): Promise<PageResult<TravelRoute>>;

  /**
   * Get a specific travel route
   * @param uniqueId - The unique identifier of the route
   * @returns The matching TravelRoute record
   */
  get(uniqueId: string): Promise<TravelRoute>;

  /**
   * Create a new travel route
   * @param data - Route details including name, code, description, and owner
   * @returns The newly created TravelRoute record
   */
  create(data: CreateTravelRouteRequest): Promise<TravelRoute>;

  /**
   * Update an existing travel route
   * @param uniqueId - The unique identifier of the route to update
   * @param data - Fields to update such as name, description, tags, or status
   * @returns The updated TravelRoute record
   */
  update(uniqueId: string, data: UpdateTravelRouteRequest): Promise<TravelRoute>;

  /**
   * Delete a travel route (soft delete)
   * @param uniqueId - The unique identifier of the route to delete
   * @returns Resolves when the route has been deleted
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Recover a previously deleted travel route
   * @param uniqueId - The unique identifier of the deleted route
   * @returns The recovered TravelRoute record
   */
  recover(uniqueId: string): Promise<TravelRoute>;

  /**
   * Search travel routes by query string
   * @param query - The search query text
   * @param params - Optional additional filtering and pagination
   * @returns Paginated result of TravelRoute records matching the search query
   */
  search(query: string, params?: ListTravelRoutesParams): Promise<PageResult<TravelRoute>>;

  /**
   * List soft-deleted travel routes
   * @param params - Optional pagination parameters
   * @returns Paginated result of deleted TravelRoute records
   */
  listDeleted(params?: ListTravelRoutesParams): Promise<PageResult<TravelRoute>>;
}

export function createTravelRoutesService(transport: Transport, _config: { appId: string }): TravelRoutesService {
  return {
    async list(params?: ListTravelRoutesParams): Promise<PageResult<TravelRoute>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.ownerUniqueId) queryParams['owner_unique_id'] = params.ownerUniqueId;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/travel_routes', { params: queryParams });
      return decodePageResult(response, travelRouteMapper);
    },

    async get(uniqueId: string): Promise<TravelRoute> {
      const response = await transport.get<unknown>(`/travel_routes/${uniqueId}`);
      return decodeOne(response, travelRouteMapper);
    },

    async create(data: CreateTravelRouteRequest): Promise<TravelRoute> {
      const response = await transport.post<unknown>('/travel_routes', {
        travelroute: {
            name: data.name,
            code: data.code,
            description: data.description,
            owner_unique_id: data.ownerUniqueId,
            tags: data.tags,
            payload: data.payload,
          },
      });
      return decodeOne(response, travelRouteMapper);
    },

    async update(uniqueId: string, data: UpdateTravelRouteRequest): Promise<TravelRoute> {
      const response = await transport.put<unknown>(`/travel_routes/${uniqueId}`, {
        travelroute: {
            name: data.name,
            code: data.code,
            description: data.description,
            enabled: data.enabled,
            status: data.status,
            tags: data.tags,
            payload: data.payload,
          },
      });
      return decodeOne(response, travelRouteMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/travel_routes/${uniqueId}`);
    },

    async recover(uniqueId: string): Promise<TravelRoute> {
      const response = await transport.put<unknown>(`/travel_routes/${uniqueId}/recover`, {});
      return decodeOne(response, travelRouteMapper);
    },

    async search(query: string, params?: ListTravelRoutesParams): Promise<PageResult<TravelRoute>> {
      const queryParams: Record<string, string> = { search: query };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.post<unknown>('/travel_routes/search', { search: query }, { params: queryParams });
      return decodePageResult(response, travelRouteMapper);
    },

    async listDeleted(params?: ListTravelRoutesParams): Promise<PageResult<TravelRoute>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.get<unknown>('/travel_routes/trash/show', { params: queryParams });
      return decodePageResult(response, travelRouteMapper);
    },
  };
}
