import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  LocationGroup,
  CreateLocationGroupRequest,
  ListLocationGroupsParams,
} from '../types/location-group.js';
import { locationGroupMapper } from '../mappers/location-group.mapper.js';

export interface LocationGroupsService {
  /**
   * List all location groups
   * @param params - Optional filtering by status, search, and pagination
   * @returns Paginated result containing LocationGroup items and metadata
   */
  list(params?: ListLocationGroupsParams): Promise<PageResult<LocationGroup>>;

  /**
   * Get a specific location group
   * @param uniqueId - The unique identifier of the location group
   * @returns The matching LocationGroup record
   */
  get(uniqueId: string): Promise<LocationGroup>;

  /**
   * Create a new location group
   * @param data - Group details including name, code, description, and optional parent
   * @returns The newly created LocationGroup record
   */
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
