import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Tag,
  CreateTagRequest,
  UpdateTagRequest,
  ListTagsParams,
} from '../types/tag.js';
import { tagMapper } from '../mappers/tag.mapper.js';

export interface TagsService {
  /**
   * List all tags
   * @param params - Optional filtering and pagination parameters
   * @returns Paginated list of Tag records with pagination metadata
   */
  list(params?: ListTagsParams): Promise<PageResult<Tag>>;

  /**
   * Get a tag by unique ID
   * @param uniqueId - Unique ID of the tag to retrieve
   * @returns The matching Tag record
   */
  get(uniqueId: string): Promise<Tag>;

  /**
   * Create a new tag
   * @param data - Tag creation payload
   * @returns The newly created Tag record
   */
  create(data: CreateTagRequest): Promise<Tag>;

  /**
   * Update a tag
   * @param uniqueId - Unique ID of the tag to update
   * @param data - Fields to update on the tag
   * @returns The updated Tag record
   */
  update(uniqueId: string, data: UpdateTagRequest): Promise<Tag>;

  /**
   * Delete a tag
   * @param uniqueId - Unique ID of the tag to delete
   * @returns void on successful deletion
   */
  delete(uniqueId: string): Promise<void>;
}

export function createTagsService(transport: Transport, _config: { apiKey: string }): TagsService {
  return {
    async list(params?: ListTagsParams): Promise<PageResult<Tag>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.search) queryParams['search'] = params.search;

      const response = await transport.get<unknown>('/tags', { params: queryParams });
      return decodePageResult(response, tagMapper);
    },

    async get(uniqueId: string): Promise<Tag> {
      const response = await transport.get<unknown>(`/tags/${uniqueId}`);
      return decodeOne(response, tagMapper);
    },

    async create(data: CreateTagRequest): Promise<Tag> {
      const response = await transport.post<unknown>('/tags', {
        tag: {
          tag: data.tag,
          thumbnail_url: data.thumbnailUrl,
          image_url: data.imageUrl,
          content_url: data.contentUrl,
          media_url: data.mediaUrl,
          payload: data.payload,
        },
      });
      return decodeOne(response, tagMapper);
    },

    async update(uniqueId: string, data: UpdateTagRequest): Promise<Tag> {
      const response = await transport.put<unknown>(`/tags/${uniqueId}`, {
        tag: {
          tag: data.tag,
          thumbnail_url: data.thumbnailUrl,
          image_url: data.imageUrl,
          content_url: data.contentUrl,
          media_url: data.mediaUrl,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, tagMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/tags/${uniqueId}`);
    },
  };
}
