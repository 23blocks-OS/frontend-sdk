import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { AgentTool } from '../types/agent-tool.js';
import { parseString, parseDate, parseBoolean } from './utils.js';

export const agentToolMapper: ResourceMapper<AgentTool> = {
  type: 'agent_tool',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || '',
    agentUniqueId: parseString(resource.attributes['agent_unique_id']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    toolType: parseString(resource.attributes['tool_type']),
    apiMethod: parseString(resource.attributes['api_method']),
    apiUrl: parseString(resource.attributes['api_url']),
    requiresAuth: resource.attributes['requires_auth'] != null ? parseBoolean(resource.attributes['requires_auth']) : undefined,
    responseMapping: parseString(resource.attributes['response_mapping']),
    parameters: resource.attributes['parameters'] as Record<string, unknown> | undefined,
    apiHeaders: resource.attributes['api_headers'] as Record<string, unknown> | undefined,
    status: parseString(resource.attributes['status']) || 'active',
    enabled: resource.attributes['enabled'] != null ? parseBoolean(resource.attributes['enabled']) : undefined,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),
  }),
};
