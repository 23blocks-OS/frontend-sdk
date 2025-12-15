import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Workflow,
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
  ListWorkflowsParams,
  RunWorkflowRequest,
  RunWorkflowResponse,
} from '../types/workflow';
import { workflowMapper } from '../mappers/workflow.mapper';

export interface WorkflowsService {
  list(params?: ListWorkflowsParams): Promise<PageResult<Workflow>>;
  get(uniqueId: string): Promise<Workflow>;
  create(data: CreateWorkflowRequest): Promise<Workflow>;
  update(uniqueId: string, data: UpdateWorkflowRequest): Promise<Workflow>;
  delete(uniqueId: string): Promise<void>;
  run(uniqueId: string, data: RunWorkflowRequest): Promise<RunWorkflowResponse>;
  pause(uniqueId: string): Promise<Workflow>;
  resume(uniqueId: string): Promise<Workflow>;
}

export function createWorkflowsService(transport: Transport, _config: { appId: string }): WorkflowsService {
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
        workflow: {
            code: data.code,
            name: data.name,
            description: data.description,
            steps: data.steps,
            triggers: data.triggers,
            payload: data.payload,
          },
      });
      return decodeOne(response, workflowMapper);
    },

    async update(uniqueId: string, data: UpdateWorkflowRequest): Promise<Workflow> {
      const response = await transport.put<unknown>(`/workflows/${uniqueId}`, {
        workflow: {
            name: data.name,
            description: data.description,
            steps: data.steps,
            triggers: data.triggers,
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
          },
      });
      return decodeOne(response, workflowMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/workflows/${uniqueId}`);
    },

    async run(uniqueId: string, data: RunWorkflowRequest): Promise<RunWorkflowResponse> {
      const response = await transport.post<any>(`/workflows/${uniqueId}/run`, {
        input: data.input,
        payload: data.payload,
      });

      return {
        executionUniqueId: response.execution_unique_id,
        status: response.status,
        output: response.output,
      };
    },

    async pause(uniqueId: string): Promise<Workflow> {
      const response = await transport.post<unknown>(`/workflows/${uniqueId}/pause`, {});
      return decodeOne(response, workflowMapper);
    },

    async resume(uniqueId: string): Promise<Workflow> {
      const response = await transport.post<unknown>(`/workflows/${uniqueId}/resume`, {});
      return decodeOne(response, workflowMapper);
    },
  };
}
