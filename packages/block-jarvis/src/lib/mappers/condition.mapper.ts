import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Condition } from '../types/condition.js';
import { parseString, parseDate, parseBoolean, parseOptionalNumber } from './utils.js';

export const conditionMapper: ResourceMapper<Condition> = {
  type: 'condition',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    expressionType: parseString(resource.attributes['expression_type']),
    promptUniqueId: parseString(resource.attributes['prompt_unique_id']),
    llmModel: parseString(resource.attributes['llm_model']),
    llmTemperature: parseOptionalNumber(resource.attributes['llm_temperature']),
    cacheable: resource.attributes['cacheable'] != null ? parseBoolean(resource.attributes['cacheable']) : undefined,
    cacheTtlSeconds: parseOptionalNumber(resource.attributes['cache_ttl_seconds']),
    expression: resource.attributes['expression'] as Record<string, unknown> | undefined,
    status: parseString(resource.attributes['status']) || 'active',
    enabled: resource.attributes['enabled'] != null ? parseBoolean(resource.attributes['enabled']) : undefined,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),
  }),
};
