import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { WorkflowParticipant } from '../types/workflow-participant';
import { parseDate } from './utils';

export const workflowParticipantMapper: ResourceMapper<WorkflowParticipant> = {
  type: 'workflow_participant',
  map: (resource) => ({
    id: resource.id,
    uniqueId: resource.attributes?.['unique_id'] as string,
    workflowUniqueId: resource.attributes?.['workflow_unique_id'] as string,
    entityType: resource.attributes?.['entity_type'] as string,
    entityUniqueId: resource.attributes?.['entity_unique_id'] as string,
    role: resource.attributes?.['role'] as string | undefined,
    permissions: resource.attributes?.['permissions'] as string[] | undefined,
    enabled: resource.attributes?.['enabled'] as boolean,
    status: resource.attributes?.['status'] as string,
    payload: resource.attributes?.['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes?.['created_at']),
    updatedAt: parseDate(resource.attributes?.['updated_at']),
  }),
};
