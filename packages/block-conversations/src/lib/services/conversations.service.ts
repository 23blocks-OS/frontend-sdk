import type { Transport } from '@23blocks/contracts';
import { decodeMany } from '@23blocks/jsonapi-codec';
import type {
  Conversation,
  GetConversationParams,
  ConversationSummary,
  DigestRequest,
  DigestResponse,
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

  /**
   * Generate or retrieve a cached AI summary of a conversation.
   * @param contextId - Context unique ID of the conversation
   * @returns ConversationSummary with status, content, and cache info
   */
  summary(contextId: string): Promise<ConversationSummary>;

  /**
   * Generate a cross-conversation digest for multiple conversations.
   * @param data - Array of context IDs (up to 50) and optional custom prompt ID
   * @returns DigestResponse with summaries, conversationsFound count, total, and optional error
   */
  digest(data: DigestRequest): Promise<DigestResponse>;
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

    async summary(contextId: string): Promise<ConversationSummary> {
      const response = await transport.post<unknown>(`/conversations/${contextId}/summary`, {});
      const doc = response as Record<string, unknown>;
      const data = (doc['data'] || {}) as Record<string, unknown>;
      const attrs = (data['attributes'] || {}) as Record<string, unknown>;
      const content = attrs['content'] as Record<string, unknown> | undefined;
      return {
        contextUniqueId: String(attrs['context_unique_id'] || contextId),
        status: (attrs['status'] || 'pending') as ConversationSummary['status'],
        content: content ? {
          summary: String(content['summary'] || ''),
          keyPoints: Array.isArray(content['key_points']) ? content['key_points'] as string[] : undefined,
          actionItems: Array.isArray(content['action_items']) ? content['action_items'] as string[] : undefined,
        } : undefined,
        messageCount: attrs['message_count'] != null ? Number(attrs['message_count']) : undefined,
        fromCache: attrs['from_cache'] != null ? Boolean(attrs['from_cache']) : undefined,
      };
    },

    async digest(data: DigestRequest): Promise<DigestResponse> {
      const body: Record<string, unknown> = {
        context_unique_ids: data.contextUniqueIds,
      };
      if (data.promptId) body['prompt_id'] = data.promptId;

      const response = await transport.post<unknown>('/conversations/digest', body);
      const doc = response as Record<string, unknown>;
      const resData = (doc['data'] || {}) as Record<string, unknown>;
      const attrs = (resData['attributes'] || doc) as Record<string, unknown>;
      const rawSummaries = (attrs['summary'] || attrs['summaries'] || []) as Array<Record<string, unknown>>;

      const summaries = rawSummaries.map((s) => {
        const content = s['content'] as Record<string, unknown> | undefined;
        return {
          contextUniqueId: String(s['context_unique_id'] || ''),
          status: (s['status'] || 'pending') as ConversationSummary['status'],
          content: content ? {
            summary: String(content['summary'] || ''),
            keyPoints: Array.isArray(content['key_points']) ? content['key_points'] as string[] : undefined,
            actionItems: Array.isArray(content['action_items']) ? content['action_items'] as string[] : undefined,
          } : undefined,
          messageCount: s['message_count'] != null ? Number(s['message_count']) : undefined,
          fromCache: s['from_cache'] != null ? Boolean(s['from_cache']) : undefined,
        };
      });

      return {
        summaries,
        conversationsFound: Number(attrs['conversations_found'] || 0),
        total: Number(attrs['total'] || summaries.length),
        error: attrs['error'] ? String(attrs['error']) : undefined,
      };
    },
  };
}
