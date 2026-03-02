import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  ListCategoriesParams,
} from '../types/category.js';
import { categoryMapper } from '../mappers/category.mapper.js';

export interface CategoriesService {
  /**
   * List categories with optional filtering, pagination, and sorting.
   * @param params - Optional filtering (status, parentUniqueId, search), pagination, and sorting parameters.
   * @returns Paginated result containing Category objects and metadata.
   */
  list(params?: ListCategoriesParams): Promise<PageResult<Category>>;

  /**
   * Retrieve a single category by its unique identifier.
   * @param uniqueId - The unique identifier of the category.
   * @returns The matching Category object.
   */
  get(uniqueId: string): Promise<Category>;

  /**
   * Create a new category.
   * @param data - The category creation payload including name, code, and optional hierarchy/display fields.
   * @returns The newly created Category object.
   */
  create(data: CreateCategoryRequest): Promise<Category>;

  /**
   * Update an existing category.
   * @param uniqueId - The unique identifier of the category to update.
   * @param data - The fields to update on the category.
   * @returns The updated Category object.
   * @note Uses PUT (not PATCH) as required by the 23blocks backend.
   */
  update(uniqueId: string, data: UpdateCategoryRequest): Promise<Category>;

  /**
   * Delete a category.
   * @param uniqueId - The unique identifier of the category to delete.
   * @returns Resolves when the category has been deleted.
   */
  delete(uniqueId: string): Promise<void>;
}

export function createCategoriesService(transport: Transport, _config: { apiKey: string }): CategoriesService {
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
          parent_id: data.parentId,
          display_order: data.displayOrder,
          thumbnail_url: data.thumbnailUrl,
          image_url: data.imageUrl,
          content_url: data.contentUrl,
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
          parent_id: data.parentId,
          display_order: data.displayOrder,
          thumbnail_url: data.thumbnailUrl,
          image_url: data.imageUrl,
          content_url: data.contentUrl,
        },
      });
      return decodeOne(response, categoryMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/categories/${uniqueId}`);
    },
  };
}
