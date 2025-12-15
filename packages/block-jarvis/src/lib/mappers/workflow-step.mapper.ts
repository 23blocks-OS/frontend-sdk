import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { WorkflowStep } from '../types/workflow-step';
import { parseDate } from './utils';

export const workflowStepMapper: ResourceMapper<WorkflowStep> = {
  type: 'workflow_step',
  map: (resource) => ({
    id: resource.id,
    uniqueId: resource.attributes?.['unique_id'] as string,
    workflowUniqueId: resource.attributes?.['workflow_unique_id'] as string,
    name: resource.attributes?.['name'] as string,
    description: resource.attributes?.['description'] as string | undefined,
    stepType: resource.attributes?.['step_type'] as string,
    order: resource.attributes?.['order'] as number,
    config: resource.attributes?.['config'] as Record<string, unknown> | undefined,
    promptUniqueId: resource.attributes?.['prompt_unique_id'] as string | undefined,
    agentUniqueId: resource.attributes?.['agent_unique_id'] as string | undefined,
    enabled: resource.attributes?.['enabled'] as boolean,
    status: resource.attributes?.['status'] as string,
    payload: resource.attributes?.['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes?.['created_at']),
    updatedAt: parseDate(resource.attributes?.['updated_at']),
  }),
};
