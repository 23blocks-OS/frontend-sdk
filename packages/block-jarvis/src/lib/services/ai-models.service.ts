import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  AIModel,
  CreateAIModelRequest,
  UpdateAIModelRequest,
  ListAIModelsParams,
} from '../types/ai-model';
import { aiModelMapper } from '../mappers/ai-model.mapper';

export interface AIModelsService {
  list(params?: ListAIModelsParams): Promise<PageResult<AIModel>>;
  get(uniqueId: string): Promise<AIModel>;
  create(data: CreateAIModelRequest): Promise<AIModel>;
  update(uniqueId: string, data: UpdateAIModelRequest): Promise<AIModel>;
  delete(uniqueId: string): Promise<void>;
}

export function createAIModelsService(transport: Transport, _config: { appId: string }): AIModelsService {
  return {
    async list(params?: ListAIModelsParams): Promise<PageResult<AIModel>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.provider) queryParams['provider'] = params.provider;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/ai_models', { params: queryParams });
      return decodePageResult(response, aiModelMapper);
    },

    async get(uniqueId: string): Promise<AIModel> {
      const response = await transport.get<unknown>(`/ai_models/${uniqueId}`);
      return decodeOne(response, aiModelMapper);
    },

    async create(data: CreateAIModelRequest): Promise<AIModel> {
      const response = await transport.post<unknown>('/ai_models', {
        ai_model: {
          code: data.code,
          name: data.name,
          provider: data.provider,
          model_id: data.modelId,
          description: data.description,
          input_token_cost: data.inputTokenCost,
          output_token_cost: data.outputTokenCost,
          max_tokens: data.maxTokens,
          payload: data.payload,
        },
      });
      return decodeOne(response, aiModelMapper);
    },

    async update(uniqueId: string, data: UpdateAIModelRequest): Promise<AIModel> {
      const response = await transport.put<unknown>(`/ai_models/${uniqueId}`, {
        ai_model: {
          name: data.name,
          description: data.description,
          input_token_cost: data.inputTokenCost,
          output_token_cost: data.outputTokenCost,
          max_tokens: data.maxTokens,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, aiModelMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/ai_models/${uniqueId}`);
    },
  };
}
