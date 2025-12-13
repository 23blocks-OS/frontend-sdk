import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Workflow, WorkflowStep, WorkflowTrigger } from '../types/workflow';
import { parseString, parseDate, parseBoolean, parseStatus } from './utils';

export const workflowMapper: ResourceMapper<Workflow> = {
  type: 'Workflow',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    steps: (resource.attributes['steps'] as WorkflowStep[]) || [],
    triggers: resource.attributes['triggers'] as WorkflowTrigger[] | undefined,
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
