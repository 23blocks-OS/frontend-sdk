import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type { Execution, ListExecutionsParams } from '../types/execution.js';
import { executionMapper } from '../mappers/execution.mapper.js';

export interface ExecutionsService {
  /**
   * List executions with optional filtering and sorting.
   * @returns Paginated list of Execution records with metadata.
   */
  list(params?: ListExecutionsParams): Promise<PageResult<Execution>>;

  /**
   * Get a single execution by unique ID.
   * @returns The matching Execution record.
   */
  get(uniqueId: string): Promise<Execution>;

  /**
   * List executions for a specific agent.
   * @returns Paginated list of Execution records with metadata.
   */
  listByAgent(agentUniqueId: string, params?: ListExecutionsParams): Promise<PageResult<Execution>>;

  /**
   * List executions for a specific prompt.
   * @returns Paginated list of Execution records with metadata.
   */
  listByPrompt(promptUniqueId: string, params?: ListExecutionsParams): Promise<PageResult<Execution>>;

  /**
   * Cancel a running execution.
   * @returns The updated Execution record with cancelled status.
   */
  cancel(uniqueId: string): Promise<Execution>;
}

export function createExecutionsService(transport: Transport, _config: { appId: string }): ExecutionsService {
  return {
    async list(params?: ListExecutionsParams): Promise<PageResult<Execution>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.agentUniqueId) queryParams['agent_unique_id'] = params.agentUniqueId;
      if (params?.promptUniqueId) queryParams['prompt_unique_id'] = params.promptUniqueId;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/executions', { params: queryParams });
      return decodePageResult(response, executionMapper);
    },

    async get(uniqueId: string): Promise<Execution> {
      const response = await transport.get<unknown>(`/executions/${uniqueId}`);
      return decodeOne(response, executionMapper);
    },

    async listByAgent(agentUniqueId: string, params?: ListExecutionsParams): Promise<PageResult<Execution>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/agents/${agentUniqueId}/executions`, { params: queryParams });
      return decodePageResult(response, executionMapper);
    },

    async listByPrompt(promptUniqueId: string, params?: ListExecutionsParams): Promise<PageResult<Execution>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/prompts/${promptUniqueId}/executions`, { params: queryParams });
      return decodePageResult(response, executionMapper);
    },

    async cancel(uniqueId: string): Promise<Execution> {
      const response = await transport.post<unknown>(`/executions/${uniqueId}/cancel`, {});
      return decodeOne(response, executionMapper);
    },
  };
}
