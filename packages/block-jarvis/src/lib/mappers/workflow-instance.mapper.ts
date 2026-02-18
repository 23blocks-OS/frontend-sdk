import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { WorkflowInstance, WorkflowStepLog } from '../types/workflow-instance.js';
import { parseString, parseDate, parseOptionalNumber } from './utils.js';

export const workflowInstanceMapper: ResourceMapper<WorkflowInstance> = {
  type: 'workflow_instance',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || '',
    workflowUniqueId: parseString(resource.attributes['workflow_unique_id']) || '',
    currentStepUniqueId: parseString(resource.attributes['current_step_unique_id']),
    currentStepOrder: parseOptionalNumber(resource.attributes['current_step_order']) ?? 0,
    input: resource.attributes['input'] as Record<string, unknown> | undefined,
    output: resource.attributes['output'] as Record<string, unknown> | undefined,
    logs: parseLogs(resource.attributes['logs']),
    status: parseString(resource.attributes['status']) || 'pending',
    startedAt: resource.attributes['started_at'] ? parseDate(resource.attributes['started_at']) : undefined,
    completedAt: resource.attributes['completed_at'] ? parseDate(resource.attributes['completed_at']) : undefined,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),
  }),
};

function parseLogs(value: unknown): WorkflowStepLog[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.map((log: any) => ({
    stepUniqueId: log.step_unique_id || '',
    stepName: log.step_name || '',
    status: log.status || '',
    input: log.input,
    output: log.output,
    startedAt: parseDate(log.started_at) || new Date(),
    completedAt: log.completed_at ? parseDate(log.completed_at) : undefined,
    error: log.error,
  }));
}
