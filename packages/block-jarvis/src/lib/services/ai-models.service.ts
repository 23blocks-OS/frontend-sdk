import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  AIModel,
  CreateAIModelRequest,
  UpdateAIModelRequest,
  ListAIModelsParams,
} from '../types/ai-model.js';
import { aiModelMapper } from '../mappers/ai-model.mapper.js';

function buildAIModelBody(data: CreateAIModelRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.name) body['name'] = data.name;
  if (data.vendorName) body['vendor_name'] = data.vendorName;
  if (data.vendorUniqueId) body['vendor_unique_id'] = data.vendorUniqueId;
  if (data.contentUrl) body['content_url'] = data.contentUrl;
  if (data.thumbnailUrl) body['thumbnail_url'] = data.thumbnailUrl;
  if (data.imageUrl) body['image_url'] = data.imageUrl;
  if (data.videoUrl) body['video_url'] = data.videoUrl;
  if (data.inputTokenCost !== undefined) body['input_token_cost'] = data.inputTokenCost;
  if (data.outputTokenCost !== undefined) body['output_token_cost'] = data.outputTokenCost;
  if (data.apiUrl) body['api_url'] = data.apiUrl;
  if (data.status) body['status'] = data.status;
  return body;
}

export interface AIModelsService {
  list(params?: ListAIModelsParams): Promise<PageResult<AIModel>>;
  get(uniqueId: string): Promise<AIModel>;
  create(data: CreateAIModelRequest): Promise<AIModel>;
  update(uniqueId: string, data: UpdateAIModelRequest): Promise<AIModel>;
  delete(uniqueId: string): Promise<void>;
}

export function createAIModelsService(transport: Transport, _config: { apiKey: string }): AIModelsService {
  return {
    async list(params?: ListAIModelsParams): Promise<PageResult<AIModel>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
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
        ai_model: buildAIModelBody(data),
      });
      return decodeOne(response, aiModelMapper);
    },

    async update(uniqueId: string, data: UpdateAIModelRequest): Promise<AIModel> {
      const response = await transport.put<unknown>(`/ai_models/${uniqueId}`, {
        ai_model: buildAIModelBody(data),
      });
      return decodeOne(response, aiModelMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/ai_models/${uniqueId}`);
    },
  };
}
