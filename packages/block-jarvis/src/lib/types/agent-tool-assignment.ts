export interface AgentToolAssignment {
  id: string;
  uniqueId: string;
  agentUniqueId: string;
  toolUniqueId: string;
  enabled?: boolean;
  priority?: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Matches assignment_params in agent_tool_assignments_controller.rb (create) */
export interface CreateAgentToolAssignmentRequest {
  toolUniqueId: string;
  enabled?: boolean;
  priority?: number;
}

/** Matches assignment_update_params in agent_tool_assignments_controller.rb (update) */
export interface UpdateAgentToolAssignmentRequest {
  enabled?: boolean;
  priority?: number;
}

export interface ListAgentToolAssignmentsParams {
  page?: number;
  perPage?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
