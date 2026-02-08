import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  ListCategoriesParams,
  CategoryPresignResponse,
  CreateCategoryImageRequest,
  CategoryImage,
} from '../types/category.js';
import { categoryMapper } from '../mappers/category.mapper.js';

export interface CategoriesService {
  /**
   * List categories with optional filtering and sorting.
   * @returns Paginated list of Category records with metadata.
   */
  list(params?: ListCategoriesParams): Promise<PageResult<Category>>;

  /**
   * Get a single category by unique ID.
   * @returns The matching Category record.
   */
  get(uniqueId: string): Promise<Category>;

  /**
   * Create a new category.
   * @returns The newly created Category record.
   */
  create(data: CreateCategoryRequest): Promise<Category>;

  /**
   * Update an existing category.
   * @returns The updated Category record.
   */
  update(uniqueId: string, data: UpdateCategoryRequest): Promise<Category>;

  /**
   * Delete a category.
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Delete a category and all its associated assets.
   * @note This is a cascading delete that removes all assets in the category.
   */
  deleteCascade(uniqueId: string): Promise<void>;

  /**
   * Get a presigned URL for uploading a category image.
   * @returns CategoryPresignResponse with `url`, `fields`, and `key`.
   */
  presignImage(uniqueId: string): Promise<CategoryPresignResponse>;

  /**
   * Create a category image record after upload.
   * @returns The newly created CategoryImage record with URL.
   */
  createImage(uniqueId: string, data: CreateCategoryImageRequest): Promise<CategoryImage>;

  /**
   * Delete a category image.
   */
  deleteImage(uniqueId: string, imageUniqueId: string): Promise<void>;
}

export function createCategoriesService(transport: Transport, _config: { appId: string }): CategoriesService {
  return {
    async list(params?: ListCategoriesParams): Promise<PageResult<Category>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.parentUniqueId) queryParams['parent_unique_id'] = params.parentUniqueId;
      if (params?.search) queryParams['search'] = params.search;

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
          description: data.description,
          parent_unique_id: data.parentUniqueId,
          payload: data.payload,
        },
      });
      return decodeOne(response, categoryMapper);
    },

    async update(uniqueId: string, data: UpdateCategoryRequest): Promise<Category> {
      const response = await transport.put<unknown>(`/categories/${uniqueId}`, {
        category: {
          name: data.name,
          description: data.description,
          parent_unique_id: data.parentUniqueId,
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

    async deleteCascade(uniqueId: string): Promise<void> {
      await transport.delete(`/categories/${uniqueId}/cascade`);
    },

    async presignImage(uniqueId: string): Promise<CategoryPresignResponse> {
      const response = await transport.put<any>(`/categories/${uniqueId}/presign`, {});
      return {
        url: response.url,
        fields: response.fields,
        key: response.key,
      };
    },

    async createImage(uniqueId: string, data: CreateCategoryImageRequest): Promise<CategoryImage> {
      const response = await transport.post<any>(`/categories/${uniqueId}/images`, {
        image: {
          key: data.key,
          filename: data.filename,
          content_type: data.contentType,
        },
      });
      return {
        uniqueId: response.unique_id,
        url: response.url,
        filename: response.filename,
        contentType: response.content_type,
        createdAt: new Date(response.created_at),
      };
    },

    async deleteImage(uniqueId: string, imageUniqueId: string): Promise<void> {
      await transport.delete(`/categories/${uniqueId}/images/${imageUniqueId}`);
    },
  };
}
