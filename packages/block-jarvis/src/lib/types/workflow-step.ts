export interface WorkflowStep {
  id: string;
  uniqueId: string;
  workflowUniqueId: string;
  name: string;
  description?: string;
  stepType: string;
  order: number;
  config?: Record<string, unknown>;
  promptUniqueId?: string;
  agentUniqueId?: string;
  enabled: boolean;
  status: string;
  payload?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddWorkflowStepRequest {
  name: string;
  description?: string;
  stepType: string;
  order?: number;
  config?: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

export interface UpdateWorkflowStepRequest {
  name?: string;
  description?: string;
  stepType?: string;
  order?: number;
  config?: Record<string, unknown>;
  enabled?: boolean;
  status?: string;
  payload?: Record<string, unknown>;
}

export interface AddStepPromptRequest {
  promptUniqueId: string;
  payload?: Record<string, unknown>;
}

export interface AddStepAgentRequest {
  agentUniqueId: string;
  payload?: Record<string, unknown>;
}
