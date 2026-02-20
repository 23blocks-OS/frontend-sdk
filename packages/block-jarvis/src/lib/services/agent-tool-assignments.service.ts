import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  AgentToolAssignment,
  CreateAgentToolAssignmentRequest,
  UpdateAgentToolAssignmentRequest,
  ListAgentToolAssignmentsParams,
} from '../types/agent-tool-assignment.js';
import { agentToolAssignmentMapper } from '../mappers/agent-tool-assignment.mapper.js';

export interface AgentToolAssignmentsService {
  list(agentUniqueId: string, params?: ListAgentToolAssignmentsParams): Promise<PageResult<AgentToolAssignment>>;
  get(agentUniqueId: string, uniqueId: string): Promise<AgentToolAssignment>;
  create(agentUniqueId: string, data: CreateAgentToolAssignmentRequest): Promise<AgentToolAssignment>;
  update(agentUniqueId: string, uniqueId: string, data: UpdateAgentToolAssignmentRequest): Promise<AgentToolAssignment>;
  delete(agentUniqueId: string, uniqueId: string): Promise<void>;
}

export function createAgentToolAssignmentsService(transport: Transport, _config: { apiKey: string }): AgentToolAssignmentsService {
  return {
    async list(agentUniqueId: string, params?: ListAgentToolAssignmentsParams): Promise<PageResult<AgentToolAssignment>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/agents/${agentUniqueId}/tool_assignments`, { params: queryParams });
      return decodePageResult(response, agentToolAssignmentMapper);
    },

    async get(agentUniqueId: string, uniqueId: string): Promise<AgentToolAssignment> {
      const response = await transport.get<unknown>(`/agents/${agentUniqueId}/tool_assignments/${uniqueId}`);
      return decodeOne(response, agentToolAssignmentMapper);
    },

    async create(agentUniqueId: string, data: CreateAgentToolAssignmentRequest): Promise<AgentToolAssignment> {
      const body: Record<string, unknown> = {};
      if (data.toolUniqueId) body['tool_unique_id'] = data.toolUniqueId;
      if (data.enabled !== undefined) body['enabled'] = data.enabled;
      if (data.priority !== undefined) body['priority'] = data.priority;
      const response = await transport.post<unknown>(`/agents/${agentUniqueId}/tool_assignments`, {
        assignment: body,
      });
      return decodeOne(response, agentToolAssignmentMapper);
    },

    async update(agentUniqueId: string, uniqueId: string, data: UpdateAgentToolAssignmentRequest): Promise<AgentToolAssignment> {
      const body: Record<string, unknown> = {};
      if (data.enabled !== undefined) body['enabled'] = data.enabled;
      if (data.priority !== undefined) body['priority'] = data.priority;
      const response = await transport.put<unknown>(`/agents/${agentUniqueId}/tool_assignments/${uniqueId}`, {
        assignment: body,
      });
      return decodeOne(response, agentToolAssignmentMapper);
    },

    async delete(agentUniqueId: string, uniqueId: string): Promise<void> {
      await transport.delete(`/agents/${agentUniqueId}/tool_assignments/${uniqueId}`);
    },
  };
}
