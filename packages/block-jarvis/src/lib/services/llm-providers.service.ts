import type { Transport, PageResult } from '@23blocks/contracts';
import { decodePageResult } from '@23blocks/jsonapi-codec';
import type { LlmProvider, LlmProviderModel, LlmProviderValidation } from '../types/llm-provider.js';
import { llmProviderMapper } from '../mappers/llm-provider.mapper.js';

export interface LlmProvidersService {
  list(): Promise<PageResult<LlmProvider>>;
  validate(): Promise<LlmProviderValidation>;
  models(provider: string): Promise<LlmProviderModel[]>;
}

export function createLlmProvidersService(transport: Transport, _config: { apiKey: string }): LlmProvidersService {
  return {
    async list(): Promise<PageResult<LlmProvider>> {
      const response = await transport.get<unknown>('/llm-providers');
      return decodePageResult(response, llmProviderMapper);
    },

    async validate(): Promise<LlmProviderValidation> {
      const response = await transport.get<any>('/llm-providers/validate');
      return {
        valid: !!response.valid,
        message: response.message,
      };
    },

    async models(provider: string): Promise<LlmProviderModel[]> {
      const response = await transport.get<any>(`/llm-providers/${provider}/models`);
      const data = response.data || response;
      if (Array.isArray(data)) {
        return data.map((m: any) => ({
          id: m.id || m.name,
          name: m.name || m.id,
          provider: m.provider || provider,
        }));
      }
      return [];
    },
  };
}
