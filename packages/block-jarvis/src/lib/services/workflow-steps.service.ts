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

function buildStepBody(data: AddWorkflowStepRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.name) body['name'] = data.name;
  if (data.description) body['description'] = data.description;
  if (data.source) body['source'] = data.source;
  if (data.sourceId) body['source_id'] = data.sourceId;
  if (data.sourceType) body['source_type'] = data.sourceType;
  if (data.sourceAlias) body['source_alias'] = data.sourceAlias;
  if (data.order !== undefined) body['order'] = data.order;
  if (data.stepUrl) body['step_url'] = data.stepUrl;
  if (data.stepParams) body['step_params'] = data.stepParams;
  if (data.agentUniqueId) body['agent_unique_id'] = data.agentUniqueId;
  if (data.agentName) body['agent_name'] = data.agentName;
  if (data.promptUniqueId) body['prompt_unique_id'] = data.promptUniqueId;
  if (data.promptName) body['prompt_name'] = data.promptName;
  if (data.customPrompt) body['custom_prompt'] = data.customPrompt;
  if (data.contentUrl) body['content_url'] = data.contentUrl;
  if (data.imageUrl) body['image_url'] = data.imageUrl;
  if (data.videoUrl) body['video_url'] = data.videoUrl;
  if (data.status) body['status'] = data.status;
  if (data.enabled !== undefined) body['enabled'] = data.enabled;
  return body;
}

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
      const response = await transport.post<unknown>(`/workflows/${workflowUniqueId}/steps`, {
        step: buildStepBody(data),
      });
      return decodeOne(response, workflowStepMapper);
    },

    async update(workflowUniqueId: string, stepUniqueId: string, data: UpdateWorkflowStepRequest): Promise<WorkflowStep> {
      const response = await transport.put<unknown>(`/workflows/${workflowUniqueId}/steps/${stepUniqueId}`, {
        step: buildStepBody(data),
      });
      return decodeOne(response, workflowStepMapper);
    },

    async remove(workflowUniqueId: string, stepUniqueId: string): Promise<void> {
      await transport.delete(`/workflows/${workflowUniqueId}/steps/${stepUniqueId}`);
    },

    async addPrompt(stepUniqueId: string, data: AddStepPromptRequest): Promise<void> {
      await transport.post(`/steps/${stepUniqueId}/prompts`, {
        prompt: { unique_id: data.uniqueId },
      });
    },

    async addAgent(stepUniqueId: string, data: AddStepAgentRequest): Promise<void> {
      await transport.post(`/steps/${stepUniqueId}/agents`, {
        agent: { unique_id: data.uniqueId },
      });
    },
  };
}
