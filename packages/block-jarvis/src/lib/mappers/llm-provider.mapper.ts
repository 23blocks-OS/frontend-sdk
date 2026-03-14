import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { LlmProvider } from '../types/llm-provider.js';
import { parseString, parseDate } from './utils.js';

export const llmProviderMapper: ResourceMapper<LlmProvider> = {
  type: 'llm_provider',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    name: parseString(resource.attributes['name']) || '',
    providerType: parseString(resource.attributes['provider_type']) || undefined,
    apiUrl: parseString(resource.attributes['api_url']) || undefined,
    status: parseString(resource.attributes['status']) || 'active',
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),
  }),
};
