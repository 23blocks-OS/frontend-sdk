import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  FileCategory,
  CreateFileCategoryRequest,
  UpdateFileCategoryRequest,
  ListFileCategoriesParams,
} from '../types/file-category.js';
import { fileCategoryMapper } from '../mappers/file-category.mapper.js';

export interface FileCategoriesService {
  /**
   * List all file categories
   * @param params - Optional filtering by parent, status, search term, and pagination
   * @returns Paginated result containing FileCategory items and metadata
   */
  list(params?: ListFileCategoriesParams): Promise<PageResult<FileCategory>>;

  /**
   * Get a specific file category
   * @param uniqueId - The unique identifier of the category
   * @returns The matching FileCategory record
   */
  get(uniqueId: string): Promise<FileCategory>;

  /**
   * Create a new file category
   * @param data - Category details including code, name, and optional parent
   * @returns The newly created FileCategory record
   */
  create(data: CreateFileCategoryRequest): Promise<FileCategory>;

  /**
   * Update an existing file category
   * @param uniqueId - The unique identifier of the category to update
   * @param data - Fields to update such as name, description, or parent
   * @returns The updated FileCategory record
   */
  update(uniqueId: string, data: UpdateFileCategoryRequest): Promise<FileCategory>;

  /**
   * Delete a file category
   * @param uniqueId - The unique identifier of the category to delete
   * @returns Resolves when the category has been deleted
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * List child categories of a parent category
   * @param parentUniqueId - The unique identifier of the parent category
   * @returns Array of FileCategory records that are children of the given parent
   */
  listChildren(parentUniqueId: string): Promise<FileCategory[]>;
}

export function createFileCategoriesService(transport: Transport, _config: { appId: string }): FileCategoriesService {
  return {
    async list(params?: ListFileCategoriesParams): Promise<PageResult<FileCategory>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.parentUniqueId) queryParams['parent_unique_id'] = params.parentUniqueId;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/categories', { params: queryParams });
      return decodePageResult(response, fileCategoryMapper);
    },

    async get(uniqueId: string): Promise<FileCategory> {
      const response = await transport.get<unknown>(`/categories/${uniqueId}`);
      return decodeOne(response, fileCategoryMapper);
    },

    async create(data: CreateFileCategoryRequest): Promise<FileCategory> {
      const response = await transport.post<unknown>('/categories', {
        category: {
          code: data.code,
          name: data.name,
          description: data.description,
          parent_unique_id: data.parentUniqueId,
          color: data.color,
          icon: data.icon,
          sort_order: data.sortOrder,
          payload: data.payload,
        },
      });
      return decodeOne(response, fileCategoryMapper);
    },

    async update(uniqueId: string, data: UpdateFileCategoryRequest): Promise<FileCategory> {
      const response = await transport.put<unknown>(`/categories/${uniqueId}`, {
        category: {
          name: data.name,
          description: data.description,
          parent_unique_id: data.parentUniqueId,
          color: data.color,
          icon: data.icon,
          sort_order: data.sortOrder,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, fileCategoryMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/categories/${uniqueId}`);
    },

    async listChildren(parentUniqueId: string): Promise<FileCategory[]> {
      const response = await transport.get<unknown>(`/categories/${parentUniqueId}/children`);
      return decodeMany(response, fileCategoryMapper);
    },
  };
}
