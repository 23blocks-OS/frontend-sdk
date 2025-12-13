import type { Transport } from '@23blocks/contracts';
import { decodeMany } from '@23blocks/jsonapi-codec';
import type {
  Conversation,
  GetConversationParams,
} from '../types/conversation';
import { messageMapper } from '../mappers/message.mapper';

export interface ConversationsService {
  get(params: GetConversationParams): Promise<Conversation>;
  listContexts(): Promise<string[]>;
  deleteContext(context: string): Promise<void>;
}

export function createConversationsService(transport: Transport, _config: { appId: string }): ConversationsService {
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
