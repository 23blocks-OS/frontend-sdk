import type { Transport, PageResult } from '@23blocks/contracts';
import { assertUuid } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Conversation,
  CreateConversationRequest,
  SendConversationMessageRequest,
  SendConversationMessageResponse,
  ListConversationsParams,
} from '../types/conversation.js';
import { conversationMapper } from '../mappers/conversation.mapper.js';

export interface ConversationsService {
  list(params?: ListConversationsParams): Promise<PageResult<Conversation>>;
  get(uniqueId: string): Promise<Conversation>;
  create(data: CreateConversationRequest): Promise<Conversation>;
  sendMessage(uniqueId: string, data: SendConversationMessageRequest): Promise<SendConversationMessageResponse>;
  listByUser(userUniqueId: string, params?: ListConversationsParams): Promise<PageResult<Conversation>>;
  clear(uniqueId: string): Promise<Conversation>;
  /**
   * Rename a conversation. The backend accepts a top-level `name` field
   * (despite older docs that say `title`). Requires `conversations:write`.
   */
  rename(uniqueId: string, name: string): Promise<Conversation>;
  /**
   * Archive a conversation. Requires `conversations:delete` per the
   * Realtime API's scope enforcement (rt-archive-001 on missing scope).
   */
  archive(uniqueId: string): Promise<Conversation>;
  /**
   * Restore a previously-archived conversation. Requires
   * `conversations:delete` per the Realtime API's scope enforcement
   * (rt-restore-001 on missing scope).
   */
  restore(uniqueId: string): Promise<Conversation>;
}

export function createConversationsService(transport: Transport, _config: { apiKey: string }): ConversationsService {
  return {
    async list(params?: ListConversationsParams): Promise<PageResult<Conversation>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.agentUniqueId) queryParams['agent_unique_id'] = params.agentUniqueId;
      if (params?.userUniqueId) queryParams['user_unique_id'] = params.userUniqueId;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/conversations', { params: queryParams });
      return decodePageResult(response, conversationMapper);
    },

    async get(uniqueId: string): Promise<Conversation> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.get<unknown>(`/conversations/${uniqueId}`);
      return decodeOne(response, conversationMapper);
    },

    async create(data: CreateConversationRequest): Promise<Conversation> {
      const body: Record<string, unknown> = {};
      if (data.agentUniqueId) body['agent_unique_id'] = data.agentUniqueId;
      if (data.userUniqueId) body['user_unique_id'] = data.userUniqueId;
      if (data.title) body['title'] = data.title;
      const response = await transport.post<unknown>('/conversations', {
        conversation: body,
      });
      return decodeOne(response, conversationMapper);
    },

    async sendMessage(uniqueId: string, data: SendConversationMessageRequest): Promise<SendConversationMessageResponse> {
      assertUuid(uniqueId, 'uniqueId');
      const body: Record<string, unknown> = {};
      if (data.message) body['content'] = data.message;
      if (data.role) body['role'] = data.role;
      const response = await transport.post<any>(`/conversations/${uniqueId}/messages`, {
        message: body,
      });

      return {
        message: {
          role: response.message?.role || 'user',
          content: response.message?.content || '',
          timestamp: new Date(response.message?.timestamp || Date.now()),
        },
        response: response.response
          ? {
              role: response.response.role || 'assistant',
              content: response.response.content || '',
              timestamp: new Date(response.response.timestamp || Date.now()),
            }
          : undefined,
        executionUniqueId: response.execution_unique_id,
        tokens: response.tokens,
        cost: response.cost,
      };
    },

    async listByUser(userUniqueId: string, params?: ListConversationsParams): Promise<PageResult<Conversation>> {
      assertUuid(userUniqueId, 'userUniqueId');
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.agentUniqueId) queryParams['agent_unique_id'] = params.agentUniqueId;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      // Backend route is /identities/:uid/conversations (NOT /users/:uid/...).
      // The user_unique_id and identity_unique_id are the same UUID; the path
      // segment differs from the legacy guess.
      const response = await transport.get<unknown>(`/identities/${userUniqueId}/conversations`, { params: queryParams });
      return decodePageResult(response, conversationMapper);
    },

    async clear(uniqueId: string): Promise<Conversation> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.post<unknown>(`/conversations/${uniqueId}/clear`, {});
      return decodeOne(response, conversationMapper);
    },

    async rename(uniqueId: string, name: string): Promise<Conversation> {
      assertUuid(uniqueId, 'uniqueId');
      // Body is a top-level `name` field, not a wrapped `conversation: {...}`
      // envelope (the wrapped form returns 422 "Name is required").
      const response = await transport.put<unknown>(`/conversations/${uniqueId}/rename`, { name });
      return decodeOne(response, conversationMapper);
    },

    async archive(uniqueId: string): Promise<Conversation> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.put<unknown>(`/conversations/${uniqueId}/archive`, {});
      return decodeOne(response, conversationMapper);
    },

    async restore(uniqueId: string): Promise<Conversation> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.put<unknown>(`/conversations/${uniqueId}/restore`, {});
      return decodeOne(response, conversationMapper);
    },
  };
}
