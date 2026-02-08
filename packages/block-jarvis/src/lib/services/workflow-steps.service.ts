import type { Transport } from '@23blocks/contracts';
import { decodeOne } from '@23blocks/jsonapi-codec';
import type {
  WorkflowStep,
  AddWorkflowStepRequest,
  UpdateWorkflowStepRequest,
  AddStepPromptRequest,
  AddStepAgentRequest,
} from '../types/workflow-step.js';
import { workflowStepMapper } from '../mappers/workflow-step.mapper.js';

export interface WorkflowStepsService {
  /**
   * Get a single workflow step by unique ID.
   * @returns The matching WorkflowStep record.
   */
  get(workflowUniqueId: string, stepUniqueId: string): Promise<WorkflowStep>;

  /**
   * Add a new step to a workflow.
   * @returns The newly created WorkflowStep record.
   */
  add(workflowUniqueId: string, data: AddWorkflowStepRequest): Promise<WorkflowStep>;

  /**
   * Update an existing workflow step.
   * @returns The updated WorkflowStep record.
   */
  update(workflowUniqueId: string, stepUniqueId: string, data: UpdateWorkflowStepRequest): Promise<WorkflowStep>;

  /**
   * Remove a step from a workflow.
   */
  remove(workflowUniqueId: string, stepUniqueId: string): Promise<void>;

  /**
   * Associate a prompt with a workflow step.
   */
  addPrompt(stepUniqueId: string, data: AddStepPromptRequest): Promise<void>;

  /**
   * Associate an agent with a workflow step.
   */
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
