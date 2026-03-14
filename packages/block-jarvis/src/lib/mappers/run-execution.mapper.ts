import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { AgentRunExecution } from '../types/agent-runtime.js';
import { parseString, parseDate, parseOptionalNumber } from './utils.js';

export const runExecutionMapper: ResourceMapper<AgentRunExecution> = {
  type: 'run_execution',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || '',
    agentUniqueId: parseString(resource.attributes['agent_unique_id']) || '',
    runId: parseString(resource.attributes['run_id']) || undefined,
    threadId: parseString(resource.attributes['thread_id']) || undefined,
    status: parseString(resource.attributes['status']) || 'pending',
    input: parseString(resource.attributes['input']) || undefined,
    output: parseString(resource.attributes['output']) || undefined,
    tokens: parseOptionalNumber(resource.attributes['tokens']),
    cost: parseOptionalNumber(resource.attributes['cost']),
    duration: parseOptionalNumber(resource.attributes['duration']),
    error: parseString(resource.attributes['error']) || undefined,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),
  }),
};
