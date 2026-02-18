import type { Transport, PageResult } from '@23blocks/contracts';
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
}

export function createConversationsService(transport: Transport, _config: { appId: string }): ConversationsService {
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
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.agentUniqueId) queryParams['agent_unique_id'] = params.agentUniqueId;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/users/${userUniqueId}/conversations`, { params: queryParams });
      return decodePageResult(response, conversationMapper);
    },

    async clear(uniqueId: string): Promise<Conversation> {
      const response = await transport.post<unknown>(`/conversations/${uniqueId}/clear`, {});
      return decodeOne(response, conversationMapper);
    },
  };
}
