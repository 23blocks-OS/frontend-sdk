import type { Transport } from '@23blocks/contracts';
import { decodeMany } from '@23blocks/jsonapi-codec';
import type {
  Conversation,
  GetConversationParams,
} from '../types/conversation.js';
import { messageMapper } from '../mappers/message.mapper.js';

export interface ConversationsService {
  /**
   * Get a conversation by context identifier
   * @param params - Parameters including context ID, pagination, and optional file inclusion
   * @returns Conversation object containing messages, files, and metadata
   */
  get(params: GetConversationParams): Promise<Conversation>;

  /**
   * List all available conversation context identifiers
   * @returns Array of context identifier strings
   */
  listContexts(): Promise<string[]>;

  /**
   * Delete a conversation context and its associated messages
   * @param context - Context identifier of the conversation to delete
   * @returns void on successful deletion
   */
  deleteContext(context: string): Promise<void>;
}

export function createConversationsService(transport: Transport, _config: { apiKey: string }): ConversationsService {
  return {
    async get(params: GetConversationParams): Promise<Conversation> {
      const queryParams: Record<string, string> = {};
      if (params.page) queryParams['page'] = String(params.page);
      if (params.perPage) queryParams['records'] = String(params.perPage);
      if (params.includeFiles) queryParams['with'] = 'files';

      const response = await transport.get<unknown>(`/conversations/${params.context}`, { params: queryParams });

      // Decode messages
      const messages = decodeMany(response, messageMapper);

      // Extract files and meta from response if available
      const rawResponse = response as any;
      const files = rawResponse.files || [];
      const meta = rawResponse.meta || {};

      return {
        id: params.context,
        context: params.context,
        messages,
        files,
        meta,
      };
    },

    async listContexts(): Promise<string[]> {
      const response = await transport.get<any>('/conversations/contexts');
      return response.data?.contexts || [];
    },

    async deleteContext(context: string): Promise<void> {
      await transport.delete(`/conversations/${context}`);
    },
  };
}
