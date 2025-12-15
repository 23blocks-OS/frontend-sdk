import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  LocationGroup,
  CreateLocationGroupRequest,
  ListLocationGroupsParams,
} from '../types/location-group';
import { locationGroupMapper } from '../mappers/location-group.mapper';

export interface LocationGroupsService {
  list(params?: ListLocationGroupsParams): Promise<PageResult<LocationGroup>>;
  get(uniqueId: string): Promise<LocationGroup>;
  create(data: CreateLocationGroupRequest): Promise<LocationGroup>;
}

export function createLocationGroupsService(transport: Transport, _config: { appId: string }): LocationGroupsService {
  return {
    async list(params?: ListLocationGroupsParams): Promise<PageResult<LocationGroup>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/location_groups', { params: queryParams });
      return decodePageResult(response, locationGroupMapper);
    },

    async get(uniqueId: string): Promise<LocationGroup> {
      const response = await transport.get<unknown>(`/location_groups/${uniqueId}/`);
      return decodeOne(response, locationGroupMapper);
    },

    async create(data: CreateLocationGroupRequest): Promise<LocationGroup> {
      const response = await transport.post<unknown>('/location_groups/', {
        location_group: {
          name: data.name,
          description: data.description,
          code: data.code,
          parent_unique_id: data.parentUniqueId,
          payload: data.payload,
        },
      });
      return decodeOne(response, locationGroupMapper);
    },
  };
}
