import type { Transport } from '@23blocks/contracts';
import type {
  MarvinContext,
  MarvinChatRequest,
  MarvinChatResponse,
  CreateMarvinContextRequest,
  SendMarvinMessageRequest,
  SendMarvinMessageResponse,
} from '../types/marvin-chat';

export interface MarvinChatService {
  chat(data: MarvinChatRequest): Promise<MarvinChatResponse>;
  chatV2(data: MarvinChatRequest): Promise<MarvinChatResponse>;
  chatV3(data: MarvinChatRequest): Promise<MarvinChatResponse>;
  getContext(uniqueId: string): Promise<MarvinContext>;
  createContext(data?: CreateMarvinContextRequest): Promise<MarvinContext>;
  sendMessage(contextUniqueId: string, data: SendMarvinMessageRequest): Promise<SendMarvinMessageResponse>;
}

export function createMarvinChatService(transport: Transport, _config: { appId: string }): MarvinChatService {
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

    async getContext(uniqueId: string): Promise<MarvinContext> {
      const response = await transport.get<any>(`/marvin/contexts/${uniqueId}`);
      return {
        id: response.id,
        uniqueId: response.unique_id,
        messages: (response.messages || []).map((m: any) => ({
          role: m.role,
          content: m.content,
          timestamp: new Date(m.timestamp),
          tokens: m.tokens,
          payload: m.payload,
        })),
        model: response.model,
        temperature: response.temperature,
        systemPrompt: response.system_prompt,
        payload: response.payload,
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at),
      };
    },

    async createContext(data?: CreateMarvinContextRequest): Promise<MarvinContext> {
      const response = await transport.post<any>('/marvin/contexts', {
        model: data?.model,
        temperature: data?.temperature,
        system_prompt: data?.systemPrompt,
        payload: data?.payload,
      });
      return {
        id: response.id,
        uniqueId: response.unique_id,
        messages: [],
        model: response.model,
        temperature: response.temperature,
        systemPrompt: response.system_prompt,
        payload: response.payload,
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at),
      };
    },

    async sendMessage(contextUniqueId: string, data: SendMarvinMessageRequest): Promise<SendMarvinMessageResponse> {
      const response = await transport.post<any>(`/marvin/contexts/${contextUniqueId}/messages`, {
        message: data.message,
        payload: data.payload,
      });
      return {
        message: {
          role: 'user',
          content: data.message,
          timestamp: new Date(),
          payload: data.payload,
        },
        response: {
          role: 'assistant',
          content: response.response,
          timestamp: new Date(response.timestamp),
          tokens: response.tokens,
          payload: response.payload,
        },
        tokens: response.tokens,
        cost: response.cost,
      };
    },
  };
}
