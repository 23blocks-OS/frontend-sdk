import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  PostTemplate,
  CreatePostTemplateRequest,
  UpdatePostTemplateRequest,
  ListPostTemplatesParams,
} from '../types/post-template.js';
import { postTemplateMapper } from '../mappers/post-template.mapper.js';

export interface PostTemplatesService {
  list(params?: ListPostTemplatesParams): Promise<PageResult<PostTemplate>>;
  get(uniqueId: string): Promise<PostTemplate>;
  create(data: CreatePostTemplateRequest): Promise<PostTemplate>;
  update(uniqueId: string, data: UpdatePostTemplateRequest): Promise<PostTemplate>;
  delete(uniqueId: string): Promise<void>;
}

export function createPostTemplatesService(transport: Transport, _config: { appId: string }): PostTemplatesService {
  return {
    async list(params?: ListPostTemplatesParams): Promise<PageResult<PostTemplate>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.search) queryParams['search'] = params.search;

      const response = await transport.get<unknown>('/post_templates', { params: queryParams });
      return decodePageResult(response, postTemplateMapper);
    },

    async get(uniqueId: string): Promise<PostTemplate> {
      const response = await transport.get<unknown>(`/post_templates/${uniqueId}`);
      return decodeOne(response, postTemplateMapper);
    },

    async create(data: CreatePostTemplateRequest): Promise<PostTemplate> {
      const response = await transport.post<unknown>('/post_templates', {
        post_template: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          fields: data.fields.map(f => ({
            key: f.key,
            label: f.label,
            type: f.type,
            required: f.required,
            description: f.description,
            children: f.children,
          })),
          payload: data.payload,
        },
      });
      return decodeOne(response, postTemplateMapper);
    },

    async update(uniqueId: string, data: UpdatePostTemplateRequest): Promise<PostTemplate> {
      const response = await transport.put<unknown>(`/post_templates/${uniqueId}`, {
        post_template: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          fields: data.fields?.map(f => ({
            key: f.key,
            label: f.label,
            type: f.type,
            required: f.required,
            description: f.description,
            children: f.children,
          })),
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, postTemplateMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/post_templates/${uniqueId}`);
    },
  };
}
