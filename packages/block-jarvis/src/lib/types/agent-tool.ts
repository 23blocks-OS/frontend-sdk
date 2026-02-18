export interface AgentTool {
  id: string;
  uniqueId: string;
  agentUniqueId: string;
  name: string;
  description?: string;
  toolType?: string;
  apiMethod?: string;
  apiUrl?: string;
  requiresAuth?: boolean;
  responseMapping?: string;
  parameters?: Record<string, unknown>;
  apiHeaders?: Record<string, unknown>;
  status: string;
  enabled?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Matches agent_tool_params in agent_tools_controller.rb */
export interface CreateAgentToolRequest {
  name: string;
  description?: string;
  toolType?: string;
  apiMethod?: string;
  apiUrl?: string;
  requiresAuth?: boolean;
  responseMapping?: string;
  parameters?: Record<string, unknown>;
  apiHeaders?: Record<string, unknown>;
  status?: string;
  enabled?: boolean;
}

export type UpdateAgentToolRequest = CreateAgentToolRequest;

export interface ListAgentToolsParams {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
