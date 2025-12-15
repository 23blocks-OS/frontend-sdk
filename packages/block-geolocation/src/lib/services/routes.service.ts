import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  TravelRoute,
  CreateTravelRouteRequest,
  UpdateTravelRouteRequest,
  ListTravelRoutesParams,
} from '../types/route';
import { travelRouteMapper } from '../mappers/route.mapper';

export interface TravelRoutesService {
  list(params?: ListTravelRoutesParams): Promise<PageResult<TravelRoute>>;
  get(uniqueId: string): Promise<TravelRoute>;
  create(data: CreateTravelRouteRequest): Promise<TravelRoute>;
  update(uniqueId: string, data: UpdateTravelRouteRequest): Promise<TravelRoute>;
  delete(uniqueId: string): Promise<void>;
  recover(uniqueId: string): Promise<TravelRoute>;
  search(query: string, params?: ListTravelRoutesParams): Promise<PageResult<TravelRoute>>;
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
