import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { AIModel } from '../types/ai-model';
import { parseDate } from './utils';

export const aiModelMapper: ResourceMapper<AIModel> = {
  type: 'ai_model',
  map: (resource) => ({
    id: resource.id,
    uniqueId: resource.attributes?.['unique_id'] as string,
    code: resource.attributes?.['code'] as string,
    name: resource.attributes?.['name'] as string,
    provider: resource.attributes?.['provider'] as string,
    modelId: resource.attributes?.['model_id'] as string,
    description: resource.attributes?.['description'] as string | undefined,
    inputTokenCost: resource.attributes?.['input_token_cost'] as number | undefined,
    outputTokenCost: resource.attributes?.['output_token_cost'] as number | undefined,
    maxTokens: resource.attributes?.['max_tokens'] as number | undefined,
    enabled: resource.attributes?.['enabled'] as boolean,
    status: resource.attributes?.['status'] as string,
    payload: resource.attributes?.['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes?.['created_at']),
    updatedAt: parseDate(resource.attributes?.['updated_at']),
  }),
};
