import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  MessageAction,
  UpdateMessageActionRequest,
  ListMessageActionsParams,
} from '../types/message-action.js';
import { messageActionMapper } from '../mappers/message-action.mapper.js';

export interface MessageActionsService {
  /**
   * List message actions
   * @param conversationId - Unique ID of the conversation
   * @param messageId - Unique ID of the message
   * @param params - Optional pagination and sorting parameters
   * @returns Paginated list of MessageAction records
   */
  list(conversationId: string, messageId: string, params?: ListMessageActionsParams): Promise<PageResult<MessageAction>>;

  /**
   * Get a message action by ID
   * @param conversationId - Unique ID of the conversation
   * @param messageId - Unique ID of the message
   * @param actionId - Unique ID of the action to retrieve
   * @returns The matching MessageAction record
   */
  get(conversationId: string, messageId: string, actionId: string): Promise<MessageAction>;

  /**
   * Update a message action
   * @param conversationId - Unique ID of the conversation
   * @param messageId - Unique ID of the message
   * @param actionId - Unique ID of the action to update
   * @param data - Fields to update
   * @returns The updated MessageAction record
   */
  update(conversationId: string, messageId: string, actionId: string, data: UpdateMessageActionRequest): Promise<MessageAction>;

  /**
   * Delete a message action
   * @param conversationId - Unique ID of the conversation
   * @param messageId - Unique ID of the message
   * @param actionId - Unique ID of the action to delete
   * @returns void on successful deletion
   */
  delete(conversationId: string, messageId: string, actionId: string): Promise<void>;
}

export function createMessageActionsService(transport: Transport, _config: { apiKey: string }): MessageActionsService {
  return {
    async list(conversationId: string, messageId: string, params?: ListMessageActionsParams): Promise<PageResult<MessageAction>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/conversations/${conversationId}/messages/${messageId}/actions`, { params: queryParams });
      return decodePageResult(response, messageActionMapper);
    },

    async get(conversationId: string, messageId: string, actionId: string): Promise<MessageAction> {
      const response = await transport.get<unknown>(`/conversations/${conversationId}/messages/${messageId}/actions/${actionId}`);
      return decodeOne(response, messageActionMapper);
    },

    async update(conversationId: string, messageId: string, actionId: string, data: UpdateMessageActionRequest): Promise<MessageAction> {
      const response = await transport.put<unknown>(`/conversations/${conversationId}/messages/${messageId}/actions/${actionId}`, {
        message_action: {
          status: data.status,
          enabled: data.enabled,
          payload: data.payload,
          response: data.response,
          control_value: data.controlValue,
        },
      });
      return decodeOne(response, messageActionMapper);
    },

    async delete(conversationId: string, messageId: string, actionId: string): Promise<void> {
      await transport.delete(`/conversations/${conversationId}/messages/${messageId}/actions/${actionId}`);
    },
  };
}
