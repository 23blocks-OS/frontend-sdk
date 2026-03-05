import type { Transport } from '@23blocks/contracts';
import { decodeOne, decodeMany } from '@23blocks/jsonapi-codec';
import type {
  CategoryImage,
  CreateCategoryImageRequest,
  UpdateCategoryImageRequest,
} from '../types/category-image.js';
import { categoryImageMapper } from '../mappers/category-image.mapper.js';

export interface CategoryImagesService {
  list(categoryId: string): Promise<CategoryImage[]>;
  get(categoryId: string, imageId: string): Promise<CategoryImage>;
  create(categoryId: string, data: CreateCategoryImageRequest): Promise<CategoryImage>;
  update(categoryId: string, imageId: string, data: UpdateCategoryImageRequest): Promise<CategoryImage>;
  delete(categoryId: string, imageId: string): Promise<void>;
}

export function createCategoryImagesService(transport: Transport, _config: { apiKey: string }): CategoryImagesService {
  return {
    async list(categoryId: string): Promise<CategoryImage[]> {
      const response = await transport.get<unknown>(`/categories/${categoryId}/images`);
      return decodeMany(response, categoryImageMapper);
    },

    async get(categoryId: string, imageId: string): Promise<CategoryImage> {
      const response = await transport.get<unknown>(`/categories/${categoryId}/images/${imageId}`);
      return decodeOne(response, categoryImageMapper);
    },

    async create(categoryId: string, data: CreateCategoryImageRequest): Promise<CategoryImage> {
      const response = await transport.post<unknown>(`/categories/${categoryId}/images`, {
        image: {
          name: data.name,
          url: data.url,
          thumbnail: data.thumbnail,
          file_type: data.fileType,
          file_size: data.fileSize,
          description: data.description,
          original_name: data.originalName,
          is_public: data.isPublic,
          is_main_image: data.isMainImage,
          ai_enabled: data.aiEnabled,
          payload: data.payload,
        },
      });
      return decodeOne(response, categoryImageMapper);
    },

    async update(categoryId: string, imageId: string, data: UpdateCategoryImageRequest): Promise<CategoryImage> {
      const response = await transport.put<unknown>(`/categories/${categoryId}/images/${imageId}`, {
        image: {
          name: data.name,
          url: data.url,
          thumbnail: data.thumbnail,
          file_type: data.fileType,
          file_size: data.fileSize,
          description: data.description,
          original_name: data.originalName,
          is_public: data.isPublic,
          is_main_image: data.isMainImage,
          ai_enabled: data.aiEnabled,
          payload: data.payload,
        },
      });
      return decodeOne(response, categoryImageMapper);
    },

    async delete(categoryId: string, imageId: string): Promise<void> {
      await transport.delete(`/categories/${categoryId}/images/${imageId}`);
    },
  };
}
