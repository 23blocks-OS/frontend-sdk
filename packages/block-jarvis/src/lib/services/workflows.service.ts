import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Workflow,
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
  ListWorkflowsParams,
  RunWorkflowRequest,
  RunWorkflowResponse,
} from '../types/workflow.js';
import { workflowMapper } from '../mappers/workflow.mapper.js';

export interface WorkflowsService {
  /**
   * List workflows with optional filtering and sorting.
   * @returns Paginated list of Workflow records with metadata.
   */
  list(params?: ListWorkflowsParams): Promise<PageResult<Workflow>>;

  /**
   * Get a single workflow by unique ID.
   * @returns The matching Workflow record.
   */
  get(uniqueId: string): Promise<Workflow>;

  /**
   * Create a new workflow.
   * @returns The newly created Workflow record.
   */
  create(data: CreateWorkflowRequest): Promise<Workflow>;

  /**
   * Update an existing workflow.
   * @returns The updated Workflow record.
   */
  update(uniqueId: string, data: UpdateWorkflowRequest): Promise<Workflow>;

  /**
   * Delete a workflow.
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Run a workflow with input data.
   * @returns RunWorkflowResponse with execution ID, status, and output.
   */
  run(uniqueId: string, data: RunWorkflowRequest): Promise<RunWorkflowResponse>;

  /**
   * Pause a running workflow.
   * @returns The updated Workflow record with paused status.
   */
  pause(uniqueId: string): Promise<Workflow>;

  /**
   * Resume a paused workflow.
   * @returns The updated Workflow record with resumed status.
   */
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
