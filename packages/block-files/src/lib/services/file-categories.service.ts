import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  FileCategory,
  CreateFileCategoryRequest,
  UpdateFileCategoryRequest,
  ListFileCategoriesParams,
} from '../types/file-category';
import { fileCategoryMapper } from '../mappers/file-category.mapper';

export interface FileCategoriesService {
  list(params?: ListFileCategoriesParams): Promise<PageResult<FileCategory>>;
  get(uniqueId: string): Promise<FileCategory>;
  create(data: CreateFileCategoryRequest): Promise<FileCategory>;
  update(uniqueId: string, data: UpdateFileCategoryRequest): Promise<FileCategory>;
  delete(uniqueId: string): Promise<void>;
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
