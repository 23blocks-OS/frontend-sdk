import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Workflow,
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
  ListWorkflowsParams,
} from '../types/workflow.js';
import type {
  WorkflowStep,
  AddWorkflowStepRequest,
  UpdateWorkflowStepRequest,
} from '../types/workflow-step.js';
import { workflowMapper } from '../mappers/workflow.mapper.js';
import { workflowStepMapper } from '../mappers/workflow-step.mapper.js';

function buildWorkflowBody(data: CreateWorkflowRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.name) body['name'] = data.name;
  if (data.description) body['description'] = data.description;
  if (data.source) body['source'] = data.source;
  if (data.sourceId) body['source_id'] = data.sourceId;
  if (data.sourceType) body['source_type'] = data.sourceType;
  if (data.sourceAlias) body['source_alias'] = data.sourceAlias;
  if (data.contentUrl) body['content_url'] = data.contentUrl;
  if (data.imageUrl) body['image_url'] = data.imageUrl;
  if (data.videoUrl) body['video_url'] = data.videoUrl;
  if (data.status) body['status'] = data.status;
  return body;
}

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

export interface WorkflowsService {
  list(params?: ListWorkflowsParams): Promise<PageResult<Workflow>>;
  get(uniqueId: string): Promise<Workflow>;
  create(data: CreateWorkflowRequest): Promise<Workflow>;
  update(uniqueId: string, data: UpdateWorkflowRequest): Promise<Workflow>;
  delete(uniqueId: string): Promise<void>;
  addStep(uniqueId: string, data: AddWorkflowStepRequest): Promise<WorkflowStep>;
  updateStep(uniqueId: string, stepUniqueId: string, data: UpdateWorkflowStepRequest): Promise<WorkflowStep>;
  removeStep(uniqueId: string, stepUniqueId: string): Promise<void>;
}

export function createWorkflowsService(transport: Transport, _config: { apiKey: string }): WorkflowsService {
  return {
    async list(params?: ListWorkflowsParams): Promise<PageResult<Workflow>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/workflows', { params: queryParams });
      return decodePageResult(response, workflowMapper);
    },

    async get(uniqueId: string): Promise<Workflow> {
      const response = await transport.get<unknown>(`/workflows/${uniqueId}`);
      return decodeOne(response, workflowMapper);
    },

    async create(data: CreateWorkflowRequest): Promise<Workflow> {
      const response = await transport.post<unknown>('/workflows', {
        workflow: buildWorkflowBody(data),
      });
      return decodeOne(response, workflowMapper);
    },

    async update(uniqueId: string, data: UpdateWorkflowRequest): Promise<Workflow> {
      const response = await transport.put<unknown>(`/workflows/${uniqueId}`, {
        workflow: buildWorkflowBody(data),
      });
      return decodeOne(response, workflowMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/workflows/${uniqueId}`);
    },

    async addStep(uniqueId: string, data: AddWorkflowStepRequest): Promise<WorkflowStep> {
      const response = await transport.post<unknown>(`/workflows/${uniqueId}/add_step`, {
        step: buildStepBody(data),
      });
      return decodeOne(response, workflowStepMapper);
    },

    async updateStep(uniqueId: string, stepUniqueId: string, data: UpdateWorkflowStepRequest): Promise<WorkflowStep> {
      const response = await transport.put<unknown>(`/workflows/${uniqueId}/steps/${stepUniqueId}`, {
        step: buildStepBody(data),
      });
      return decodeOne(response, workflowStepMapper);
    },

    async removeStep(uniqueId: string, stepUniqueId: string): Promise<void> {
      await transport.delete(`/workflows/${uniqueId}/steps/${stepUniqueId}`);
    },
  };
}
