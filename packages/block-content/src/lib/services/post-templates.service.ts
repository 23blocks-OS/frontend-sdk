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
  /**
   * List all post templates
   * @param params - Optional filtering and pagination parameters
   * @returns Paginated list of PostTemplate records with pagination metadata
   */
  list(params?: ListPostTemplatesParams): Promise<PageResult<PostTemplate>>;

  /**
   * Get a post template by unique ID
   * @param uniqueId - Unique ID of the template to retrieve
   * @returns The matching PostTemplate record
   */
  get(uniqueId: string): Promise<PostTemplate>;

  /**
   * Create a new post template
   * @param data - Template creation payload including name, slug, and field definitions
   * @returns The newly created PostTemplate record
   */
  create(data: CreatePostTemplateRequest): Promise<PostTemplate>;

  /**
   * Update a post template
   * @param uniqueId - Unique ID of the template to update
   * @param data - Fields to update on the template
   * @returns The updated PostTemplate record
   */
  update(uniqueId: string, data: UpdatePostTemplateRequest): Promise<PostTemplate>;

  /**
   * Delete a post template
   * @param uniqueId - Unique ID of the template to delete
   * @returns void on successful deletion
   */
  delete(uniqueId: string): Promise<void>;
}

export function createPostTemplatesService(transport: Transport, _config: { apiKey: string }): PostTemplatesService {
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
