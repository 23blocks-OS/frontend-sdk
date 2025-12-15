import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  ConversationsUser,
  RegisterUserRequest,
  UpdateUserRequest,
  ListUsersParams,
} from '../types/user';
import type { Group } from '../types/group';
import type { Conversation } from '../types/conversation';
import { conversationsUserMapper } from '../mappers/user.mapper';
import { groupMapper } from '../mappers/group.mapper';
import { messageMapper } from '../mappers/message.mapper';

export interface UsersService {
  list(params?: ListUsersParams): Promise<PageResult<ConversationsUser>>;
  get(uniqueId: string): Promise<ConversationsUser>;
  register(uniqueId: string, data?: RegisterUserRequest): Promise<ConversationsUser>;
  update(uniqueId: string, data: UpdateUserRequest): Promise<ConversationsUser>;
  listGroups(uniqueId: string): Promise<PageResult<Group>>;
  listConversations(uniqueId: string, params?: { page?: number; perPage?: number }): Promise<PageResult<Conversation>>;
  listGroupConversations(uniqueId: string, params?: { page?: number; perPage?: number }): Promise<PageResult<Conversation>>;
  listContextGroups(uniqueId: string, contextUniqueId: string): Promise<PageResult<Group>>;
}

export function createUsersService(transport: Transport, _config: { appId: string }): UsersService {
  return {
    async list(params?: ListUsersParams): Promise<PageResult<ConversationsUser>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/users', { params: queryParams });
      return decodePageResult(response, conversationsUserMapper);
    },

    async get(uniqueId: string): Promise<ConversationsUser> {
      const response = await transport.get<unknown>(`/users/${uniqueId}`);
      return decodeOne(response, conversationsUserMapper);
    },

    async register(uniqueId: string, data?: RegisterUserRequest): Promise<ConversationsUser> {
      const response = await transport.post<unknown>(`/users/${uniqueId}/register`, {
        user: {
          email: data?.email,
          name: data?.name,
          username: data?.username,
          avatar_url: data?.avatarUrl,
          payload: data?.payload,
        },
      });
      return decodeOne(response, conversationsUserMapper);
    },

    async update(uniqueId: string, data: UpdateUserRequest): Promise<ConversationsUser> {
      const response = await transport.put<unknown>(`/users/${uniqueId}`, {
        user: {
          name: data.name,
          username: data.username,
          avatar_url: data.avatarUrl,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, conversationsUserMapper);
    },

    async listGroups(uniqueId: string): Promise<PageResult<Group>> {
      const response = await transport.get<unknown>(`/users/${uniqueId}/groups`);
      return decodePageResult(response, groupMapper);
    },

    async listConversations(uniqueId: string, params?: { page?: number; perPage?: number }): Promise<PageResult<Conversation>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.get<unknown>(`/users/${uniqueId}/conversations`, { params: queryParams });

      // Return conversations with their messages
      const rawResponse = response as any;
      const data = rawResponse.data || [];

      return {
        data: data.map((conv: any) => ({
          id: conv.id || conv.unique_id,
          context: conv.context || conv.unique_id,
          messages: [],
          files: [],
          meta: conv.meta || {},
        })),
        meta: {
          totalCount: rawResponse.meta?.total_count || data.length,
          page: rawResponse.meta?.page || 1,
          perPage: rawResponse.meta?.per_page || data.length,
          totalPages: rawResponse.meta?.total_pages || 1,
        },
      };
    },

    async listGroupConversations(uniqueId: string, params?: { page?: number; perPage?: number }): Promise<PageResult<Conversation>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.get<unknown>(`/users/${uniqueId}/mygroups/conversations`, { params: queryParams });

      const rawResponse = response as any;
      const data = rawResponse.data || [];

      return {
        data: data.map((conv: any) => ({
          id: conv.id || conv.unique_id,
          context: conv.context || conv.unique_id,
          messages: [],
          files: [],
          meta: conv.meta || {},
        })),
        meta: {
          totalCount: rawResponse.meta?.total_count || data.length,
          page: rawResponse.meta?.page || 1,
          perPage: rawResponse.meta?.per_page || data.length,
          totalPages: rawResponse.meta?.total_pages || 1,
        },
      };
    },

    async listContextGroups(uniqueId: string, contextUniqueId: string): Promise<PageResult<Group>> {
      const response = await transport.get<unknown>(`/users/${uniqueId}/context/${contextUniqueId}/groups`);
      return decodePageResult(response, groupMapper);
    },
  };
}
