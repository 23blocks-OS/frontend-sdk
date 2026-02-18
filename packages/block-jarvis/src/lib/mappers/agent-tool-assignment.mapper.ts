import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { AgentToolAssignment } from '../types/agent-tool-assignment.js';
import { parseString, parseDate, parseBoolean, parseOptionalNumber } from './utils.js';

export const agentToolAssignmentMapper: ResourceMapper<AgentToolAssignment> = {
  type: 'agent_tool_assignment',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || '',
    agentUniqueId: parseString(resource.attributes['agent_unique_id']) || '',
    toolUniqueId: parseString(resource.attributes['tool_unique_id']) || '',
    enabled: resource.attributes['enabled'] != null ? parseBoolean(resource.attributes['enabled']) : undefined,
    priority: parseOptionalNumber(resource.attributes['priority']),
    status: parseString(resource.attributes['status']) || 'active',
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),
  }),
};
