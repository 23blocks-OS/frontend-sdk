import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { WorkflowParticipant } from '../types/workflow-participant.js';
import { parseString, parseDate, parseBoolean } from './utils.js';

export const workflowParticipantMapper: ResourceMapper<WorkflowParticipant> = {
  type: 'workflow_participant',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || '',
    workflowUniqueId: parseString(resource.attributes['workflow_unique_id']) || '',
    role: parseString(resource.attributes['role']),
    roleName: parseString(resource.attributes['role_name']),
    participantUniqueId: parseString(resource.attributes['participant_unique_id']),
    participantName: parseString(resource.attributes['participant_name']),
    status: parseString(resource.attributes['status']) || 'active',
    enabled: resource.attributes['enabled'] != null ? parseBoolean(resource.attributes['enabled']) : undefined,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),
  }),
};
