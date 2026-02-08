import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Conversation,
  CreateConversationRequest,
  SendMessageRequest,
  SendMessageResponse,
  ListConversationsParams,
} from '../types/conversation.js';
import { conversationMapper } from '../mappers/conversation.mapper.js';

export interface ConversationsService {
  /**
   * List conversations with optional filtering and sorting.
   * @returns Paginated list of Conversation records with metadata.
   */
  list(params?: ListConversationsParams): Promise<PageResult<Conversation>>;

  /**
   * Get a single conversation by unique ID.
   * @returns The matching Conversation record.
   */
  get(uniqueId: string): Promise<Conversation>;

  /**
   * Create a new conversation.
   * @returns The newly created Conversation record.
   */
  create(data: CreateConversationRequest): Promise<Conversation>;

  /**
   * Send a message in a conversation.
   * @returns SendMessageResponse with the sent message, optional AI response, and cost.
   */
  sendMessage(uniqueId: string, data: SendMessageRequest): Promise<SendMessageResponse>;

  /**
   * List conversations belonging to a specific user.
   * @returns Paginated list of Conversation records with metadata.
   */
  listByUser(userUniqueId: string, params?: ListConversationsParams): Promise<PageResult<Conversation>>;

  /**
   * Clear all messages in a conversation.
   * @returns The updated Conversation record with messages cleared.
   */
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
      const response = await transport.post<unknown>('/conversations', {
        conversation: {
            agent_unique_id: data.agentUniqueId,
            user_unique_id: data.userUniqueId,
            title: data.title,
            payload: data.payload,
          },
      });
      return decodeOne(response, conversationMapper);
    },

    async sendMessage(uniqueId: string, data: SendMessageRequest): Promise<SendMessageResponse> {
      const response = await transport.post<any>(`/conversations/${uniqueId}/messages`, {
        message: data.message,
        role: data.role,
        payload: data.payload,
      });

      return {
        message: {
          role: response.message.role,
          content: response.message.content,
          timestamp: new Date(response.message.timestamp),
          payload: response.message.payload,
        },
        response: response.response
          ? {
              role: response.response.role,
              content: response.response.content,
              timestamp: new Date(response.response.timestamp),
              payload: response.response.payload,
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
