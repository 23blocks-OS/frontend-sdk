import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Group,
  CreateGroupRequest,
  UpdateGroupRequest,
  ListGroupsParams,
} from '../types/group';
import { groupMapper } from '../mappers/group.mapper';

export interface GroupsService {
  list(params?: ListGroupsParams): Promise<PageResult<Group>>;
  get(uniqueId: string): Promise<Group>;
  create(data: CreateGroupRequest): Promise<Group>;
  update(uniqueId: string, data: UpdateGroupRequest): Promise<Group>;
  delete(uniqueId: string): Promise<void>;
  recover(uniqueId: string): Promise<Group>;
  search(query: string, params?: ListGroupsParams): Promise<PageResult<Group>>;
  listDeleted(params?: ListGroupsParams): Promise<PageResult<Group>>;
  addMember(uniqueId: string, memberId: string): Promise<Group>;
  removeMember(uniqueId: string, memberId: string): Promise<Group>;
}

export function createGroupsService(transport: Transport, _config: { appId: string }): GroupsService {
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
        data: {
          type: 'Group',
          attributes: {
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
        },
      });
      return decodeOne(response, groupMapper);
    },

    async update(uniqueId: string, data: UpdateGroupRequest): Promise<Group> {
      const response = await transport.put<unknown>(`/groups/${uniqueId}`, {
        data: {
          type: 'Group',
          attributes: {
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
        data: {
          type: 'GroupMember',
          attributes: {
            member_id: memberId,
          },
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
