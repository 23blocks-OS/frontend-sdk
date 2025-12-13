import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
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
  recover(uniqueId: string): Promise<Category>;
  getChildren(uniqueId: string): Promise<Category[]>;
}

export function createCategoriesService(transport: Transport, _config: { appId: string }): CategoriesService {
  return {
    async list(params?: ListCategoriesParams): Promise<PageResult<Category>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.parentUniqueId) queryParams['parent_unique_id'] = params.parentUniqueId;
      if (params?.withChildren) queryParams['with'] = 'children';
      if (params?.withPosts) queryParams['with'] = params.withChildren ? 'children,posts' : 'posts';

      const response = await transport.get<unknown>('/content/categories', { params: queryParams });
      return decodePageResult(response, categoryMapper);
    },

    async get(uniqueId: string): Promise<Category> {
      const response = await transport.get<unknown>(`/content/categories/${uniqueId}`);
      return decodeOne(response, categoryMapper);
    },

    async create(data: CreateCategoryRequest): Promise<Category> {
      const response = await transport.post<unknown>('/content/categories', {
        data: {
          type: 'Category',
          attributes: {
            name: data.name,
            description: data.description,
            parent_unique_id: data.parentUniqueId,
            display_order: data.displayOrder,
            image_url: data.imageUrl,
            icon_url: data.iconUrl,
          },
        },
      });
      return decodeOne(response, categoryMapper);
    },

    async update(uniqueId: string, data: UpdateCategoryRequest): Promise<Category> {
      const response = await transport.put<unknown>(`/content/categories/${uniqueId}`, {
        data: {
          type: 'Category',
          attributes: {
            name: data.name,
            description: data.description,
            parent_unique_id: data.parentUniqueId,
            display_order: data.displayOrder,
            image_url: data.imageUrl,
            icon_url: data.iconUrl,
            enabled: data.enabled,
            status: data.status,
          },
        },
      });
      return decodeOne(response, categoryMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/content/categories/${uniqueId}`);
    },

    async recover(uniqueId: string): Promise<Category> {
      const response = await transport.put<unknown>(`/content/categories/${uniqueId}/recover`, {});
      return decodeOne(response, categoryMapper);
    },

    async getChildren(uniqueId: string): Promise<Category[]> {
      const response = await transport.get<unknown>(`/content/categories/${uniqueId}/children`);
      return decodeMany(response, categoryMapper);
    },
  };
}
