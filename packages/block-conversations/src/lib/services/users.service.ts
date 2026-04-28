import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  ConversationsUser,
  RegisterUserRequest,
  UpdateUserRequest,
  ListUsersParams,
} from '../types/user.js';
import type { Group } from '../types/group.js';
import type { Conversation, UnreadSummary, UnreadSummaryParams } from '../types/conversation.js';
import { conversationsUserMapper } from '../mappers/user.mapper.js';
import { groupMapper } from '../mappers/group.mapper.js';

export interface UsersService {
  /**
   * List all conversations users
   * @param params - Optional filtering, sorting, and pagination parameters
   * @returns Paginated list of ConversationsUser records with pagination metadata
   */
  list(params?: ListUsersParams): Promise<PageResult<ConversationsUser>>;

  /**
   * Get a conversations user by unique ID
   * @param uniqueId - Unique ID of the user to retrieve
   * @returns The matching ConversationsUser record
   */
  get(uniqueId: string): Promise<ConversationsUser>;

  /**
   * Register a user in the conversations system
   * @param uniqueId - Unique ID of the user to register
   * @param data - Optional registration payload with profile details
   * @returns The newly registered ConversationsUser record
   */
  register(uniqueId: string, data?: RegisterUserRequest): Promise<ConversationsUser>;

  /**
   * Update a conversations user's profile
   * @param uniqueId - Unique ID of the user to update
   * @param data - Fields to update on the user profile
   * @returns The updated ConversationsUser record
   */
  update(uniqueId: string, data: UpdateUserRequest): Promise<ConversationsUser>;

  /**
   * List groups that a user belongs to
   * @param uniqueId - Unique ID of the user
   * @returns Paginated list of Group records the user is a member of
   */
  listGroups(uniqueId: string): Promise<PageResult<Group>>;

  /**
   * List conversations for a user
   * @param uniqueId - Unique ID of the user
   * @param params - Optional pagination parameters
   * @returns Paginated list of Conversation records (messages and files are empty; use conversations.get for full data)
   * @note Returned conversations contain empty messages and files arrays; fetch individual conversations for full content
   */
  listConversations(uniqueId: string, params?: { page?: number; perPage?: number }): Promise<PageResult<Conversation>>;

  /**
   * List group conversations for a user
   * @param uniqueId - Unique ID of the user
   * @param params - Optional pagination parameters
   * @returns Paginated list of group Conversation records (messages and files are empty)
   * @note Returned conversations contain empty messages and files arrays; fetch individual conversations for full content
   */
  listGroupConversations(uniqueId: string, params?: { page?: number; perPage?: number }): Promise<PageResult<Conversation>>;

  /**
   * List groups for a user within a specific context
   * @param uniqueId - Unique ID of the user
   * @param contextUniqueId - Unique ID of the context to filter groups by
   * @returns Paginated list of Group records within the specified context
   */
  listContextGroups(uniqueId: string, contextUniqueId: string): Promise<PageResult<Group>>;

  /**
   * Get aggregated unread summary for a user's conversations.
   * @param uniqueId - Unique ID of the user
   * @param params - Optional grouping and custom filter parameters
   * @returns UnreadSummary with buckets, total counts, and groupBy field
   */
  getUnreadSummary(uniqueId: string, params?: UnreadSummaryParams): Promise<UnreadSummary>;
}

export function createUsersService(transport: Transport, _config: { apiKey: string }): UsersService {
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
          currentPage: rawResponse.meta?.page || 1,
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
          currentPage: rawResponse.meta?.page || 1,
          perPage: rawResponse.meta?.per_page || data.length,
          totalPages: rawResponse.meta?.total_pages || 1,
        },
      };
    },

    async listContextGroups(uniqueId: string, contextUniqueId: string): Promise<PageResult<Group>> {
      const response = await transport.get<unknown>(`/users/${uniqueId}/context/${contextUniqueId}/groups`);
      return decodePageResult(response, groupMapper);
    },

    async getUnreadSummary(uniqueId: string, params?: UnreadSummaryParams): Promise<UnreadSummary> {
      const queryParams: Record<string, string> = {};
      if (params?.groupBy) queryParams['group_by'] = params.groupBy;
      if (params?.custom) {
        for (const [key, value] of Object.entries(params.custom)) {
          queryParams[`custom[${key}]`] = value;
        }
      }

      const response = await transport.get<unknown>(`/users/${uniqueId}/unread-summary`, { params: queryParams });
      const doc = response as Record<string, unknown>;
      const data = (doc['data'] || {}) as Record<string, unknown>;
      const attrs = (data['attributes'] || {}) as Record<string, unknown>;
      const rawBuckets = (attrs['buckets'] || []) as Array<Record<string, unknown>>;

      return {
        buckets: rawBuckets.map((b) => ({
          key: String(b['key'] || ''),
          unreadCount: Number(b['unread_count'] || 0),
          conversationCount: Number(b['conversation_count'] || 0),
          conversationPayload: b['conversation_payload'] as Record<string, unknown> | undefined,
        })),
        totalUnreadCount: Number(attrs['total_unread_count'] || 0),
        totalConversationCount: Number(attrs['total_conversation_count'] || 0),
        groupBy: String(attrs['group_by'] || params?.groupBy || 'reference'),
      };
    },
  };
}
