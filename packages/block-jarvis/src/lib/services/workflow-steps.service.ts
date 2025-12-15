import type { Transport } from '@23blocks/contracts';
import { decodeOne } from '@23blocks/jsonapi-codec';
import type {
  WorkflowStep,
  AddWorkflowStepRequest,
  UpdateWorkflowStepRequest,
  AddStepPromptRequest,
  AddStepAgentRequest,
} from '../types/workflow-step';
import { workflowStepMapper } from '../mappers/workflow-step.mapper';

export interface WorkflowStepsService {
  get(workflowUniqueId: string, stepUniqueId: string): Promise<WorkflowStep>;
  add(workflowUniqueId: string, data: AddWorkflowStepRequest): Promise<WorkflowStep>;
  update(workflowUniqueId: string, stepUniqueId: string, data: UpdateWorkflowStepRequest): Promise<WorkflowStep>;
  remove(workflowUniqueId: string, stepUniqueId: string): Promise<void>;
  addPrompt(stepUniqueId: string, data: AddStepPromptRequest): Promise<void>;
  addAgent(stepUniqueId: string, data: AddStepAgentRequest): Promise<void>;
}

export function createWorkflowStepsService(transport: Transport, _config: { appId: string }): WorkflowStepsService {
  return {
    async get(workflowUniqueId: string, stepUniqueId: string): Promise<WorkflowStep> {
      const response = await transport.get<unknown>(`/workflows/${workflowUniqueId}/steps/${stepUniqueId}`);
      return decodeOne(response, workflowStepMapper);
    },

    async add(workflowUniqueId: string, data: AddWorkflowStepRequest): Promise<WorkflowStep> {
      const response = await transport.put<unknown>(`/workflows/${workflowUniqueId}/steps`, {
        step: {
          name: data.name,
          description: data.description,
          step_type: data.stepType,
          order: data.order,
          config: data.config,
          payload: data.payload,
        },
      });
      return decodeOne(response, workflowStepMapper);
    },

    async update(workflowUniqueId: string, stepUniqueId: string, data: UpdateWorkflowStepRequest): Promise<WorkflowStep> {
      const response = await transport.put<unknown>(`/workflows/${workflowUniqueId}/steps/${stepUniqueId}`, {
        step: {
          name: data.name,
          description: data.description,
          step_type: data.stepType,
          order: data.order,
          config: data.config,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, workflowStepMapper);
    },

    async remove(workflowUniqueId: string, stepUniqueId: string): Promise<void> {
      await transport.delete(`/workflows/${workflowUniqueId}/steps/${stepUniqueId}`);
    },

    async addPrompt(stepUniqueId: string, data: AddStepPromptRequest): Promise<void> {
      await transport.post(`/steps/${stepUniqueId}/prompts`, {
        prompt_unique_id: data.promptUniqueId,
        payload: data.payload,
      });
    },

    async addAgent(stepUniqueId: string, data: AddStepAgentRequest): Promise<void> {
      await transport.post(`/steps/${stepUniqueId}/agents`, {
        agent_unique_id: data.agentUniqueId,
        payload: data.payload,
      });
    },
  };
}
