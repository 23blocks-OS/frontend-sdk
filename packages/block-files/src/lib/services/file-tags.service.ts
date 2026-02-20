import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  FileTag,
  CreateFileTagRequest,
  UpdateFileTagRequest,
  ListFileTagsParams,
} from '../types/file-tag.js';
import { fileTagMapper } from '../mappers/file-tag.mapper.js';

export interface FileTagsService {
  /**
   * List all file tags
   * @param params - Optional filtering by status, search term, and pagination
   * @returns Paginated result containing FileTag items and metadata
   */
  list(params?: ListFileTagsParams): Promise<PageResult<FileTag>>;

  /**
   * Get a specific file tag
   * @param uniqueId - The unique identifier of the tag
   * @returns The matching FileTag record
   */
  get(uniqueId: string): Promise<FileTag>;

  /**
   * Create a new file tag
   * @param data - Tag details including code, name, and optional color/icon
   * @returns The newly created FileTag record
   */
  create(data: CreateFileTagRequest): Promise<FileTag>;

  /**
   * Update an existing file tag
   * @param uniqueId - The unique identifier of the tag to update
   * @param data - Fields to update such as name, color, or icon
   * @returns The updated FileTag record
   */
  update(uniqueId: string, data: UpdateFileTagRequest): Promise<FileTag>;

  /**
   * Delete a file tag
   * @param uniqueId - The unique identifier of the tag to delete
   * @returns Resolves when the tag has been deleted
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Add a tag to a user's file
   * @param userUniqueId - The unique identifier of the file owner
   * @param fileUniqueId - The unique identifier of the file
   * @param tagUniqueId - The unique identifier of the tag to add
   * @returns Resolves when the tag has been added to the file
   */
  addToFile(userUniqueId: string, fileUniqueId: string, tagUniqueId: string): Promise<void>;

  /**
   * Remove a tag from a user's file
   * @param userUniqueId - The unique identifier of the file owner
   * @param fileUniqueId - The unique identifier of the file
   * @param tagUniqueId - The unique identifier of the tag to remove
   * @returns Resolves when the tag has been removed from the file
   */
  removeFromFile(userUniqueId: string, fileUniqueId: string, tagUniqueId: string): Promise<void>;
}

export function createFileTagsService(transport: Transport, _config: { apiKey: string }): FileTagsService {
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
