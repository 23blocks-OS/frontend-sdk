import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type { PromptTemplate, ListPromptTemplatesParams } from '../types/prompt-template.js';
import { promptTemplateMapper } from '../mappers/prompt-template.mapper.js';

export interface PromptTemplatesService {
  list(params?: ListPromptTemplatesParams): Promise<PageResult<PromptTemplate>>;
  get(id: string): Promise<PromptTemplate>;
}

export function createPromptTemplatesService(transport: Transport, _config: { apiKey: string }): PromptTemplatesService {
  return {
    async list(params?: ListPromptTemplatesParams): Promise<PageResult<PromptTemplate>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.includeSchema) queryParams['include_schema'] = 'true';

      const response = await transport.get<unknown>('/prompt_templates', { params: queryParams });
      return decodePageResult(response, promptTemplateMapper);
    },

    async get(id: string): Promise<PromptTemplate> {
      const response = await transport.get<unknown>(`/prompt_templates/${id}`);
      return decodeOne(response, promptTemplateMapper);
    },
  };
}
