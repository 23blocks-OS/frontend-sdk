import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Execution } from '../types/execution';
import { parseString, parseDate, parseOptionalNumber, parseExecutionStatus } from './utils';

export const executionMapper: ResourceMapper<Execution> = {
  type: 'Execution',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    agentUniqueId: parseString(resource.attributes['agent_unique_id']),
    promptUniqueId: parseString(resource.attributes['prompt_unique_id']),
    input: parseString(resource.attributes['input']),
    output: parseString(resource.attributes['output']),
    tokens: parseOptionalNumber(resource.attributes['tokens']),
    cost: parseOptionalNumber(resource.attributes['cost']),
    duration: parseOptionalNumber(resource.attributes['duration']),
    status: parseExecutionStatus(resource.attributes['status']),
    startedAt: parseDate(resource.attributes['started_at']),
    completedAt: parseDate(resource.attributes['completed_at']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
