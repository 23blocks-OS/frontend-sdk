import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  FileTag,
  CreateFileTagRequest,
  UpdateFileTagRequest,
  ListFileTagsParams,
} from '../types/file-tag';
import { fileTagMapper } from '../mappers/file-tag.mapper';

export interface FileTagsService {
  list(params?: ListFileTagsParams): Promise<PageResult<FileTag>>;
  get(uniqueId: string): Promise<FileTag>;
  create(data: CreateFileTagRequest): Promise<FileTag>;
  update(uniqueId: string, data: UpdateFileTagRequest): Promise<FileTag>;
  delete(uniqueId: string): Promise<void>;
  addToFile(userUniqueId: string, fileUniqueId: string, tagUniqueId: string): Promise<void>;
  removeFromFile(userUniqueId: string, fileUniqueId: string, tagUniqueId: string): Promise<void>;
}

export function createFileTagsService(transport: Transport, _config: { appId: string }): FileTagsService {
  return {
    async list(params?: ListFileTagsParams): Promise<PageResult<FileTag>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/tags', { params: queryParams });
      return decodePageResult(response, fileTagMapper);
    },

    async get(uniqueId: string): Promise<FileTag> {
      const response = await transport.get<unknown>(`/tags/${uniqueId}`);
      return decodeOne(response, fileTagMapper);
    },

    async create(data: CreateFileTagRequest): Promise<FileTag> {
      const response = await transport.post<unknown>('/tags', {
        tag: {
          code: data.code,
          name: data.name,
          description: data.description,
          color: data.color,
          icon: data.icon,
          payload: data.payload,
        },
      });
      return decodeOne(response, fileTagMapper);
    },

    async update(uniqueId: string, data: UpdateFileTagRequest): Promise<FileTag> {
      const response = await transport.put<unknown>(`/tags/${uniqueId}`, {
        tag: {
          name: data.name,
          description: data.description,
          color: data.color,
          icon: data.icon,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, fileTagMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/tags/${uniqueId}`);
    },

    async addToFile(userUniqueId: string, fileUniqueId: string, tagUniqueId: string): Promise<void> {
      await transport.post(`/users/${userUniqueId}/files/${fileUniqueId}/tags`, {
        tag_unique_id: tagUniqueId,
      });
    },

    async removeFromFile(userUniqueId: string, fileUniqueId: string, tagUniqueId: string): Promise<void> {
      await transport.delete(`/users/${userUniqueId}/files/${fileUniqueId}/tags/${tagUniqueId}`);
    },
  };
}
