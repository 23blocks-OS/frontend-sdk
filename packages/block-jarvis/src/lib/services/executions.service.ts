import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type { Execution, ListExecutionsParams } from '../types/execution';
import { executionMapper } from '../mappers/execution.mapper';

export interface ExecutionsService {
  list(params?: ListExecutionsParams): Promise<PageResult<Execution>>;
  get(uniqueId: string): Promise<Execution>;
  listByAgent(agentUniqueId: string, params?: ListExecutionsParams): Promise<PageResult<Execution>>;
  listByPrompt(promptUniqueId: string, params?: ListExecutionsParams): Promise<PageResult<Execution>>;
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
