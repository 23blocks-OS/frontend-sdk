import type { Transport } from '@23blocks/contracts';
import { assertUuid } from '@23blocks/contracts';
import type {
  MarvinChatRequest,
  MarvinChatResponse,
  SendMarvinMessageRequest,
  SendMarvinMessageResponse,
} from '../types/marvin-chat.js';

export interface MarvinChatService {
  /**
   * Send a chat message via Marvin v1 API.
   * @returns MarvinChatResponse with the AI response, token usage, and cost.
   */
  chat(data: MarvinChatRequest): Promise<MarvinChatResponse>;

  /**
   * Send a chat message via Jarvis v2 API.
   * @returns MarvinChatResponse with the AI response, token usage, and cost.
   */
  chatV2(data: MarvinChatRequest): Promise<MarvinChatResponse>;

  /**
   * Send a chat message via Jarvis v3 API.
   * @returns MarvinChatResponse with the AI response, token usage, and cost.
   */
  chatV3(data: MarvinChatRequest): Promise<MarvinChatResponse>;

  /**
   * Send a message within a Marvin context. Routes to the chat_engine#ai_chat
   * controller and returns a JSON:API chat_response document.
   * @returns SendMarvinMessageResponse with the user message, AI response, and cost.
   */
  sendMessage(contextUniqueId: string, data: SendMarvinMessageRequest): Promise<SendMarvinMessageResponse>;
}

export function createMarvinChatService(transport: Transport, _config: { apiKey: string }): MarvinChatService {
  return {
    async chat(data: MarvinChatRequest): Promise<MarvinChatResponse> {
      const response = await transport.post<any>('/marvin/conversations', {
        message: data.message,
        context_unique_id: data.contextUniqueId,
        model: data.model,
        temperature: data.temperature,
        max_tokens: data.maxTokens,
        system_prompt: data.systemPrompt,
        payload: data.payload,
      });
      return {
        response: response.response,
        contextUniqueId: response.context_unique_id,
        tokens: response.tokens,
        cost: response.cost,
        model: response.model,
      };
    },

    async chatV2(data: MarvinChatRequest): Promise<MarvinChatResponse> {
      const response = await transport.post<any>('/jarvis/v2/conversations', {
        message: data.message,
        context_unique_id: data.contextUniqueId,
        model: data.model,
        temperature: data.temperature,
        max_tokens: data.maxTokens,
        system_prompt: data.systemPrompt,
        payload: data.payload,
      });
      return {
        response: response.response,
        contextUniqueId: response.context_unique_id,
        tokens: response.tokens,
        cost: response.cost,
        model: response.model,
      };
    },

    async chatV3(data: MarvinChatRequest): Promise<MarvinChatResponse> {
      const response = await transport.post<any>('/jarvis/v3/conversations', {
        message: data.message,
        context_unique_id: data.contextUniqueId,
        model: data.model,
        temperature: data.temperature,
        max_tokens: data.maxTokens,
        system_prompt: data.systemPrompt,
        payload: data.payload,
      });
      return {
        response: response.response,
        contextUniqueId: response.context_unique_id,
        tokens: response.tokens,
        cost: response.cost,
        model: response.model,
      };
    },

    async sendMessage(contextUniqueId: string, data: SendMarvinMessageRequest): Promise<SendMarvinMessageResponse> {
      assertUuid(contextUniqueId, 'contextUniqueId');
      // Backend (chat_engine#ai_chat) returns JSON:API:
      // { data: { type: 'chat_response', attributes: { content, metadata: { usage: {...}, ... } } } }
      const response = await transport.post<any>(`/marvin/contexts/${contextUniqueId}/messages`, {
        message: data.message,
        payload: data.payload,
      });
      const attrs = response?.data?.attributes ?? response ?? {};
      const meta = attrs?.metadata ?? {};
      const usage = meta?.usage ?? {};
      return {
        message: {
          role: 'user',
          content: data.message,
          timestamp: new Date(),
          payload: data.payload,
        },
        response: {
          role: 'assistant',
          content: attrs.content ?? attrs.response ?? '',
          timestamp: attrs.created_at ? new Date(attrs.created_at) : new Date(),
          tokens: usage.total_tokens ?? usage.tokens ?? attrs.tokens,
          payload: meta.payload ?? attrs.payload,
        },
        tokens: usage.total_tokens ?? usage.tokens ?? attrs.tokens,
        cost: usage.cost ?? attrs.cost,
      };
    },
  };
}
