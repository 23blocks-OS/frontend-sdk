import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Execution } from '../types/execution.js';
import { parseString, parseDate, parseOptionalNumber } from './utils.js';

export const executionMapper: ResourceMapper<Execution> = {
  type: 'execution',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || '',
    agentUniqueId: parseString(resource.attributes['agent_unique_id']),
    promptUniqueId: parseString(resource.attributes['prompt_unique_id']),
    input: parseString(resource.attributes['input']),
    output: parseString(resource.attributes['output']),
    tokens: parseOptionalNumber(resource.attributes['tokens']),
    cost: parseOptionalNumber(resource.attributes['cost']),
    duration: parseOptionalNumber(resource.attributes['duration']),
    status: parseString(resource.attributes['status']) || 'pending',
    startedAt: parseDate(resource.attributes['started_at']),
    completedAt: parseDate(resource.attributes['completed_at']),
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),
  }),
};
