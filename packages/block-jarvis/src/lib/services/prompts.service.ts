import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Prompt,
  CreatePromptRequest,
  UpdatePromptRequest,
  ListPromptsParams,
  ExecutePromptRequest,
  ExecutePromptResponse,
  RenderPromptRequest,
  RenderPromptResponse,
} from '../types/prompt.js';
import { promptMapper } from '../mappers/prompt.mapper.js';

function buildPromptBody(data: CreatePromptRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.name) body['name'] = data.name;
  if (data.promptType) body['prompt_type'] = data.promptType;
  if (data.abstract) body['abstract'] = data.abstract;
  if (data.keywords) body['keywords'] = data.keywords;
  if (data.content) body['content'] = data.content;
  if (data.thumbnailUrl) body['thumbnail_url'] = data.thumbnailUrl;
  if (data.imageUrl) body['image_url'] = data.imageUrl;
  if (data.mediaUrl) body['media_url'] = data.mediaUrl;
  if (data.publishAt) body['publish_at'] = data.publishAt;
  if (data.publishUntil) body['publish_until'] = data.publishUntil;
  if (data.model) body['model'] = data.model;
  if (data.frequencyPenalty !== undefined) body['frequency_penalty'] = data.frequencyPenalty;
  if (data.maxTokens !== undefined) body['max_tokens'] = data.maxTokens;
  if (data.responses !== undefined) body['responses'] = data.responses;
  if (data.responseFormat) body['response_format'] = data.responseFormat;
  if (data.seed !== undefined) body['seed'] = data.seed;
  if (data.temperature !== undefined) body['temperature'] = data.temperature;
  if (data.topP !== undefined) body['top_p'] = data.topP;
  if (data.user) body['user'] = data.user;
  if (data.persona) body['persona'] = data.persona;
  if (data.guidelines) body['guidelines'] = data.guidelines;
  if (data.actions) body['actions'] = data.actions;
  if (data.references) body['references'] = data.references;
  if (data.sample) body['sample'] = data.sample;
  if (data.outputTemplate) body['output_template'] = data.outputTemplate;
  if (data.safeguard) body['safeguard'] = data.safeguard;
  if (data.promptTemplateId) body['prompt_template_id'] = data.promptTemplateId;
  if (data.contentUrl) body['content_url'] = data.contentUrl;
  if (data.repoUrl) body['repo_url'] = data.repoUrl;
  if (data.status) body['status'] = data.status;
  if (data.isPublic !== undefined) body['is_public'] = data.isPublic;
  if (data.source) body['source'] = data.source;
  if (data.templateData) body['template_data'] = data.templateData;
  return body;
}

export interface PromptsService {
  list(params?: ListPromptsParams): Promise<PageResult<Prompt>>;
  get(uniqueId: string): Promise<Prompt>;
  create(data: CreatePromptRequest): Promise<Prompt>;
  update(uniqueId: string, data: UpdatePromptRequest): Promise<Prompt>;
  delete(uniqueId: string): Promise<void>;
  execute(uniqueId: string, data: ExecutePromptRequest): Promise<ExecutePromptResponse>;
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
        prompt: buildPromptBody(data),
      });
      return decodeOne(response, promptMapper);
    },

    async update(uniqueId: string, data: UpdatePromptRequest): Promise<Prompt> {
      const response = await transport.put<unknown>(`/prompts/${uniqueId}`, {
        prompt: buildPromptBody(data),
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
      });

      return {
        output: response.output,
        executionUniqueId: response.execution_unique_id,
        tokens: response.tokens,
        cost: response.cost,
        duration: response.duration,
      };
    },

    async render(uniqueId: string, data: RenderPromptRequest): Promise<RenderPromptResponse> {
      const response = await transport.post<any>(`/prompts/${uniqueId}/render`, {
        placeholders: data.placeholders,
      });

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
