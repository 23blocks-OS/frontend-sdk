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
  RenderPromptRequest,
  RenderPromptResponse,
} from '../types/prompt.js';
import { promptMapper } from '../mappers/prompt.mapper.js';

export interface PromptsService {
  /**
   * List prompts with optional filtering and sorting.
   * @returns Paginated list of Prompt records with metadata.
   */
  list(params?: ListPromptsParams): Promise<PageResult<Prompt>>;

  /**
   * Get a single prompt by unique ID.
   * @returns The matching Prompt record.
   */
  get(uniqueId: string): Promise<Prompt>;

  /**
   * Create a new prompt.
   * @returns The newly created Prompt record.
   */
  create(data: CreatePromptRequest): Promise<Prompt>;

  /**
   * Update an existing prompt.
   * @returns The updated Prompt record.
   */
  update(uniqueId: string, data: UpdatePromptRequest): Promise<Prompt>;

  /**
   * Delete a prompt.
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Execute a prompt with variables against an agent.
   * @returns ExecutePromptResponse with output, token usage, cost, and duration.
   */
  execute(uniqueId: string, data: ExecutePromptRequest): Promise<ExecutePromptResponse>;

  /**
   * Test a prompt template for validity without executing it.
   * @returns TestPromptResponse with rendered prompt, validation status, and errors.
   */
  test(data: TestPromptRequest): Promise<TestPromptResponse>;

  /**
   * Render a prompt template with placeholder values.
   * @returns RenderPromptResponse with rendered content and placeholder metadata.
   */
  render(uniqueId: string, data: RenderPromptRequest): Promise<RenderPromptResponse>;
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
            template_data: data.templateData,
            template_schema: data.templateSchema,
            template_info: data.templateInfo,
            placeholders: data.placeholders,
            provider: data.provider,
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
            template_data: data.templateData,
            template_schema: data.templateSchema,
            template_info: data.templateInfo,
            placeholders: data.placeholders,
            provider: data.provider,
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

    async render(uniqueId: string, data: RenderPromptRequest): Promise<RenderPromptResponse> {
      const response = await transport.post<any>(`/prompts/${uniqueId}/render`, {
        placeholders: data.placeholders,
      });

      // Parse JSON:API response - the rendered prompt comes in data.attributes
      const attributes = response.data?.attributes || response;

      return {
        id: response.data?.id ?? response.id,
        renderedContent: attributes.rendered_content || attributes.renderedContent,
        promptUniqueId: attributes.prompt_unique_id || attributes.promptUniqueId,
        versionUniqueId: attributes.version_unique_id || attributes.versionUniqueId,
        name: attributes.name,
        promptType: attributes.prompt_type || attributes.promptType,
        model: attributes.model,
        temperature: attributes.temperature,
        maxTokens: attributes.max_tokens || attributes.maxTokens,
        provider: attributes.provider,
        meta: {
          placeholdersProvided: response.data?.meta?.placeholders_provided || response.meta?.placeholders_provided || [],
          placeholdersMissing: response.data?.meta?.placeholders_missing || response.meta?.placeholders_missing || [],
          allPlaceholders: response.data?.meta?.all_placeholders || response.meta?.all_placeholders || [],
          renderedAt: response.data?.meta?.rendered_at || response.meta?.rendered_at || new Date().toISOString(),
        },
      };
    },
  };
}
