import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type { Tag, CreateTagRequest, UpdateTagRequest } from '../types/tag.js';
import { tagMapper } from '../mappers/tag.mapper.js';

export interface TagsService {
  list(page?: number, perPage?: number): Promise<PageResult<Tag>>;
  get(uniqueId: string): Promise<Tag>;
  create(data: CreateTagRequest): Promise<Tag>;
  update(uniqueId: string, data: UpdateTagRequest): Promise<Tag>;
  delete(uniqueId: string): Promise<void>;
}

export function createTagsService(transport: Transport, _config: { apiKey: string }): TagsService {
  return {
    async list(page?: number, perPage?: number): Promise<PageResult<Tag>> {
      const params: Record<string, string> = {};
      if (page) params['page'] = String(page);
      if (perPage) params['records'] = String(perPage);

      const response = await transport.get<unknown>('/tags', { params });
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
          status: data.status,
          meta_title: data.metaTitle,
          meta_description: data.metaDescription,
          meta_keywords: data.metaKeywords,
          slug: data.slug,
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
          status: data.status,
          meta_title: data.metaTitle,
          meta_description: data.metaDescription,
          meta_keywords: data.metaKeywords,
          slug: data.slug,
        },
      });
      return decodeOne(response, tagMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/tags/${uniqueId}`);
    },
  };
}
