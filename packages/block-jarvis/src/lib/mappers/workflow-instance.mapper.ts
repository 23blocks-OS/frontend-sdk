import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { WorkflowInstance, WorkflowStepLog } from '../types/workflow-instance';
import { parseDate } from './utils';

export const workflowInstanceMapper: ResourceMapper<WorkflowInstance> = {
  type: 'workflow_instance',
  map: (resource) => ({
    id: resource.id,
    uniqueId: resource.attributes?.['unique_id'] as string,
    workflowUniqueId: resource.attributes?.['workflow_unique_id'] as string,
    currentStepUniqueId: resource.attributes?.['current_step_unique_id'] as string | undefined,
    currentStepOrder: resource.attributes?.['current_step_order'] as number,
    input: resource.attributes?.['input'] as Record<string, unknown> | undefined,
    output: resource.attributes?.['output'] as Record<string, unknown> | undefined,
    logs: ((resource.attributes?.['logs'] as any[]) || []).map((log: any) => ({
      stepUniqueId: log.step_unique_id,
      stepName: log.step_name,
      status: log.status,
      input: log.input,
      output: log.output,
      startedAt: parseDate(log.started_at),
      completedAt: log.completed_at ? parseDate(log.completed_at) : undefined,
      error: log.error,
    })) as WorkflowStepLog[],
    status: resource.attributes?.['status'] as string,
    startedAt: resource.attributes?.['started_at'] ? parseDate(resource.attributes?.['started_at']) : undefined,
    completedAt: resource.attributes?.['completed_at'] ? parseDate(resource.attributes?.['completed_at']) : undefined,
    payload: resource.attributes?.['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes?.['created_at']),
    updatedAt: parseDate(resource.attributes?.['updated_at']),
  }),
};
