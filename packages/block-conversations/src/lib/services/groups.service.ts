import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Group,
  CreateGroupRequest,
  UpdateGroupRequest,
  ListGroupsParams,
} from '../types/group.js';
import { groupMapper } from '../mappers/group.mapper.js';

export interface GroupsService {
  /**
   * List all groups
   * @param params - Optional filtering, sorting, and pagination parameters
   * @returns Paginated list of Group records with pagination metadata
   */
  list(params?: ListGroupsParams): Promise<PageResult<Group>>;

  /**
   * Get a group by unique ID
   * @param uniqueId - Unique ID of the group to retrieve
   * @returns The matching Group record
   */
  get(uniqueId: string): Promise<Group>;

  /**
   * Create a new group
   * @param data - Group creation payload including name, type, and initial members
   * @returns The newly created Group record
   */
  create(data: CreateGroupRequest): Promise<Group>;

  /**
   * Update a group
   * @param uniqueId - Unique ID of the group to update
   * @param data - Fields to update on the group
   * @returns The updated Group record
   */
  update(uniqueId: string, data: UpdateGroupRequest): Promise<Group>;

  /**
   * Delete a group (soft delete)
   * @param uniqueId - Unique ID of the group to delete
   * @returns void on successful deletion
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Recover a previously deleted group
   * @param uniqueId - Unique ID of the deleted group to recover
   * @returns The recovered Group record
   */
  recover(uniqueId: string): Promise<Group>;

  /**
   * Search groups by query string
   * @param query - Search query text
   * @param params - Optional pagination parameters
   * @returns Paginated list of matching Group records with pagination metadata
   */
  search(query: string, params?: ListGroupsParams): Promise<PageResult<Group>>;

  /**
   * List soft-deleted groups
   * @param params - Optional pagination parameters
   * @returns Paginated list of deleted Group records with pagination metadata
   */
  listDeleted(params?: ListGroupsParams): Promise<PageResult<Group>>;

  /**
   * Add a member to a group
   * @param uniqueId - Unique ID of the group
   * @param memberId - ID of the member to add
   * @returns The updated Group record
   */
  addMember(uniqueId: string, memberId: string): Promise<Group>;

  /**
   * Remove a member from a group
   * @param uniqueId - Unique ID of the group
   * @param memberId - ID of the member to remove
   * @returns The updated Group record
   */
  removeMember(uniqueId: string, memberId: string): Promise<Group>;
}

export function createGroupsService(transport: Transport, _config: { apiKey: string }): GroupsService {
  return {
    async list(params?: ListGroupsParams): Promise<PageResult<Group>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.groupType) queryParams['group_type'] = params.groupType;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/groups', { params: queryParams });
      return decodePageResult(response, groupMapper);
    },

    async get(uniqueId: string): Promise<Group> {
      const response = await transport.get<unknown>(`/groups/${uniqueId}`);
      return decodeOne(response, groupMapper);
    },

    async create(data: CreateGroupRequest): Promise<Group> {
      const response = await transport.post<unknown>('/groups', {
        group: {
            name: data.name,
            code: data.code,
            unique_code: data.uniqueCode,
            qcode: data.qcode,
            group_type: data.groupType,
            members: data.members,
            source: data.source,
            source_alias: data.sourceAlias,
            source_id: data.sourceId,
            source_type: data.sourceType,
            payload: data.payload,
          },
      });
      return decodeOne(response, groupMapper);
    },

    async update(uniqueId: string, data: UpdateGroupRequest): Promise<Group> {
      const response = await transport.put<unknown>(`/groups/${uniqueId}`, {
        group: {
            name: data.name,
            code: data.code,
            unique_code: data.uniqueCode,
            qcode: data.qcode,
            group_type: data.groupType,
            members: data.members,
            status: data.status,
            enabled: data.enabled,
            payload: data.payload,
          },
      });
      return decodeOne(response, groupMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/groups/${uniqueId}`);
    },

    async recover(uniqueId: string): Promise<Group> {
      const response = await transport.put<unknown>(`/groups/${uniqueId}/recover`, {});
      return decodeOne(response, groupMapper);
    },

    async search(query: string, params?: ListGroupsParams): Promise<PageResult<Group>> {
      const queryParams: Record<string, string> = { search: query };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.post<unknown>('/groups/search', { search: query }, { params: queryParams });
      return decodePageResult(response, groupMapper);
    },

    async listDeleted(params?: ListGroupsParams): Promise<PageResult<Group>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.get<unknown>('/groups/trash/show', { params: queryParams });
      return decodePageResult(response, groupMapper);
    },

    async addMember(uniqueId: string, memberId: string): Promise<Group> {
      const response = await transport.post<unknown>(`/groups/${uniqueId}/members`, {
        groupmember: {
            member_id: memberId,
          },
      });
      return decodeOne(response, groupMapper);
    },

    async removeMember(uniqueId: string, memberId: string): Promise<Group> {
      const response = await transport.delete<unknown>(`/groups/${uniqueId}/members/${memberId}`);
      return decodeOne(response, groupMapper);
    },
  };
}
