import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Category,
  CreateCategoryRequest,
  ListCategoriesParams,
} from '../types/category.js';
import { categoryMapper } from '../mappers/category.mapper.js';

export interface CategoriesService {
  /**
   * List all categories
   * @param params - Optional filtering and pagination parameters
   * @returns Paginated list of Category records with pagination metadata
   */
  list(params?: ListCategoriesParams): Promise<PageResult<Category>>;

  /**
   * Get a category by unique ID
   * @param uniqueId - Unique ID of the category to retrieve
   * @returns The matching Category record
   */
  get(uniqueId: string): Promise<Category>;

  /**
   * Create a new category
   * @param data - Category creation payload
   * @returns The newly created Category record
   * @note The API does not support update or delete operations for categories
   */
  create(data: CreateCategoryRequest): Promise<Category>;
}

export function createCategoriesService(transport: Transport, _config: { apiKey: string }): CategoriesService {
  return {
    async list(params?: ListCategoriesParams): Promise<PageResult<Category>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.parentId) queryParams['parent_id'] = params.parentId;
      if (params?.withChildren) queryParams['with'] = 'children';
      if (params?.withPosts) {
        queryParams['with'] = params.withChildren ? 'children,posts' : 'posts';
      }

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
          code: data.code,
          name: data.name,
          description: data.description,
          parent_id: data.parentId,
          display_order: data.displayOrder,
          image_url: data.imageUrl,
          content_url: data.contentUrl,
          payload: data.payload,
        },
      });
      return decodeOne(response, categoryMapper);
    },
  };
}
