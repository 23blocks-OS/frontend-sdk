export interface WorkflowStep {
  id: string;
  uniqueId: string;
  workflowUniqueId: string;
  name: string;
  description?: string;
  source?: string;
  sourceId?: string;
  sourceType?: string;
  sourceAlias?: string;
  order?: number;
  stepUrl?: string;
  stepParams?: string;
  agentUniqueId?: string;
  agentName?: string;
  promptUniqueId?: string;
  promptName?: string;
  customPrompt?: string;
  contentUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  status: string;
  enabled?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Matches step_params in workflows_controller.rb (add_step, update_step) */
export interface AddWorkflowStepRequest {
  name: string;
  description?: string;
  source?: string;
  sourceId?: string;
  sourceType?: string;
  sourceAlias?: string;
  order?: number;
  stepUrl?: string;
  stepParams?: string;
  agentUniqueId?: string;
  agentName?: string;
  promptUniqueId?: string;
  promptName?: string;
  customPrompt?: string;
  contentUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  status?: string;
  enabled?: boolean;
}

export type UpdateWorkflowStepRequest = AddWorkflowStepRequest;

/** Matches prompt_params in steps_controller.rb (add_prompt) */
export interface AddStepPromptRequest {
  uniqueId: string;
}

/** Matches agent_params in steps_controller.rb (add_agent) */
export interface AddStepAgentRequest {
  uniqueId: string;
}
