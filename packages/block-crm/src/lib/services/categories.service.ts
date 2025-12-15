import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  ListCategoriesParams,
} from '../types/category';
import { categoryMapper } from '../mappers/category.mapper';

export interface CategoriesService {
  list(params?: ListCategoriesParams): Promise<PageResult<Category>>;
  get(uniqueId: string): Promise<Category>;
  create(data: CreateCategoryRequest): Promise<Category>;
  update(uniqueId: string, data: UpdateCategoryRequest): Promise<Category>;
  delete(uniqueId: string): Promise<void>;
}

export function createCategoriesService(transport: Transport, _config: { appId: string }): CategoriesService {
  return {
    async list(params?: ListCategoriesParams): Promise<PageResult<Category>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.parentUniqueId) queryParams['parent_unique_id'] = params.parentUniqueId;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/categories', { params: queryParams });
      return decodePageResult(response, categoryMapper);
    },

    async get(uniqueId: string): Promise<Category> {
      const response = await transport.get<unknown>(`/categories/${uniqueId}`);
      return decodeOne(response, categoryMapper);
    },

    async create(data: CreateCategoryRequest): Promise<Category> {
      const response = await transport.post<unknown>('/categories', {
        category: {
          name: data.name,
          code: data.code,
          description: data.description,
          parent_unique_id: data.parentUniqueId,
          order: data.order,
          color: data.color,
          icon: data.icon,
          payload: data.payload,
        },
      });
      return decodeOne(response, categoryMapper);
    },

    async update(uniqueId: string, data: UpdateCategoryRequest): Promise<Category> {
      const response = await transport.put<unknown>(`/categories/${uniqueId}`, {
        category: {
          name: data.name,
          code: data.code,
          description: data.description,
          parent_unique_id: data.parentUniqueId,
          order: data.order,
          color: data.color,
          icon: data.icon,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, categoryMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/categories/${uniqueId}`);
    },
  };
}
