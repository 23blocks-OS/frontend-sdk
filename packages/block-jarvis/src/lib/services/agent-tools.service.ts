import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  AgentTool,
  CreateAgentToolRequest,
  UpdateAgentToolRequest,
  ListAgentToolsParams,
} from '../types/agent-tool.js';
import { agentToolMapper } from '../mappers/agent-tool.mapper.js';

function buildAgentToolBody(data: CreateAgentToolRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.name) body['name'] = data.name;
  if (data.description) body['description'] = data.description;
  if (data.toolType) body['tool_type'] = data.toolType;
  if (data.apiMethod) body['api_method'] = data.apiMethod;
  if (data.apiUrl) body['api_url'] = data.apiUrl;
  if (data.requiresAuth !== undefined) body['requires_auth'] = data.requiresAuth;
  if (data.responseMapping) body['response_mapping'] = data.responseMapping;
  if (data.parameters) body['parameters'] = data.parameters;
  if (data.apiHeaders) body['api_headers'] = data.apiHeaders;
  if (data.status) body['status'] = data.status;
  if (data.enabled !== undefined) body['enabled'] = data.enabled;
  return body;
}

export interface AgentToolsService {
  list(agentUniqueId: string, params?: ListAgentToolsParams): Promise<PageResult<AgentTool>>;
  get(agentUniqueId: string, uniqueId: string): Promise<AgentTool>;
  create(agentUniqueId: string, data: CreateAgentToolRequest): Promise<AgentTool>;
  update(agentUniqueId: string, uniqueId: string, data: UpdateAgentToolRequest): Promise<AgentTool>;
  delete(agentUniqueId: string, uniqueId: string): Promise<void>;
}

export function createAgentToolsService(transport: Transport, _config: { appId: string }): AgentToolsService {
  return {
    async list(agentUniqueId: string, params?: ListAgentToolsParams): Promise<PageResult<AgentTool>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/agents/${agentUniqueId}/tools`, { params: queryParams });
      return decodePageResult(response, agentToolMapper);
    },

    async get(agentUniqueId: string, uniqueId: string): Promise<AgentTool> {
      const response = await transport.get<unknown>(`/agents/${agentUniqueId}/tools/${uniqueId}`);
      return decodeOne(response, agentToolMapper);
    },

    async create(agentUniqueId: string, data: CreateAgentToolRequest): Promise<AgentTool> {
      const response = await transport.post<unknown>(`/agents/${agentUniqueId}/tools`, {
        agent_tool: buildAgentToolBody(data),
      });
      return decodeOne(response, agentToolMapper);
    },

    async update(agentUniqueId: string, uniqueId: string, data: UpdateAgentToolRequest): Promise<AgentTool> {
      const response = await transport.put<unknown>(`/agents/${agentUniqueId}/tools/${uniqueId}`, {
        agent_tool: buildAgentToolBody(data),
      });
      return decodeOne(response, agentToolMapper);
    },

    async delete(agentUniqueId: string, uniqueId: string): Promise<void> {
      await transport.delete(`/agents/${agentUniqueId}/tools/${uniqueId}`);
    },
  };
}
