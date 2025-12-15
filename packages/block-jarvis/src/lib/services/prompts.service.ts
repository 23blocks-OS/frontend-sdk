import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Prompt,
  CreatePromptRequest,
  UpdatePromptRequest,
  ListPromptsParams,
  ExecutePromptRequest,
  ExecutePromptResponse,
  TestPromptRequest,
  TestPromptResponse,
} from '../types/prompt';
import { promptMapper } from '../mappers/prompt.mapper';

export interface PromptsService {
  list(params?: ListPromptsParams): Promise<PageResult<Prompt>>;
  get(uniqueId: string): Promise<Prompt>;
  create(data: CreatePromptRequest): Promise<Prompt>;
  update(uniqueId: string, data: UpdatePromptRequest): Promise<Prompt>;
  delete(uniqueId: string): Promise<void>;
  execute(uniqueId: string, data: ExecutePromptRequest): Promise<ExecutePromptResponse>;
  test(data: TestPromptRequest): Promise<TestPromptResponse>;
}

export function createPromptsService(transport: Transport, _config: { appId: string }): PromptsService {
  return {
    async list(params?: ListPromptsParams): Promise<PageResult<Prompt>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.agentUniqueId) queryParams['agent_unique_id'] = params.agentUniqueId;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/prompts', { params: queryParams });
      return decodePageResult(response, promptMapper);
    },

    async get(uniqueId: string): Promise<Prompt> {
      const response = await transport.get<unknown>(`/prompts/${uniqueId}`);
      return decodeOne(response, promptMapper);
    },

    async create(data: CreatePromptRequest): Promise<Prompt> {
      const response = await transport.post<unknown>('/prompts', {
        prompt: {
            agent_unique_id: data.agentUniqueId,
            code: data.code,
            name: data.name,
            description: data.description,
            template: data.template,
            variables: data.variables,
            payload: data.payload,
          },
      });
      return decodeOne(response, promptMapper);
    },

    async update(uniqueId: string, data: UpdatePromptRequest): Promise<Prompt> {
      const response = await transport.put<unknown>(`/prompts/${uniqueId}`, {
        prompt: {
            name: data.name,
            description: data.description,
            template: data.template,
            variables: data.variables,
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
          },
      });
      return decodeOne(response, promptMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/prompts/${uniqueId}`);
    },

    async execute(uniqueId: string, data: ExecutePromptRequest): Promise<ExecutePromptResponse> {
      const response = await transport.post<any>(`/prompts/${uniqueId}/execute`, {
        agent_unique_id: data.agentUniqueId,
        variables: data.variables,
        payload: data.payload,
      });

      return {
        output: response.output,
        executionUniqueId: response.execution_unique_id,
        tokens: response.tokens,
        cost: response.cost,
        duration: response.duration,
      };
    },

    async test(data: TestPromptRequest): Promise<TestPromptResponse> {
      const response = await transport.post<any>('/prompts/test', {
        template: data.template,
        variables: data.variables,
        agent_unique_id: data.agentUniqueId,
      });

      return {
        renderedPrompt: response.rendered_prompt,
        isValid: response.is_valid,
        errors: response.errors,
      };
    },
  };
}
