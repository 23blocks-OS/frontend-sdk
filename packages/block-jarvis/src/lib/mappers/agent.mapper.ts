import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Agent } from '../types/agent';
import { parseString, parseDate, parseBoolean, parseOptionalNumber, parseStatus, parseStringArray } from './utils';

export const agentMapper: ResourceMapper<Agent> = {
  type: 'Agent',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    systemPrompt: parseString(resource.attributes['system_prompt']),
    model: parseString(resource.attributes['model']),
    temperature: parseOptionalNumber(resource.attributes['temperature']),
    maxTokens: parseOptionalNumber(resource.attributes['max_tokens']),
    tools: parseStringArray(resource.attributes['tools']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
