import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type { ProductReview } from '../types/product';
import { productReviewMapper } from '../mappers/product.mapper';

export interface CreateReviewRequest {
  rating: number;
  title?: string;
  content?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateReviewRequest {
  rating?: number;
  title?: string;
  content?: string;
  payload?: Record<string, unknown>;
}

export interface ProductReviewsService {
  list(productUniqueId: string, page?: number, perPage?: number): Promise<PageResult<ProductReview>>;
  create(productUniqueId: string, data: CreateReviewRequest): Promise<ProductReview>;
  update(productUniqueId: string, reviewUniqueId: string, data: UpdateReviewRequest): Promise<ProductReview>;
  delete(productUniqueId: string, reviewUniqueId: string): Promise<void>;
  flag(productUniqueId: string, reviewUniqueId: string): Promise<ProductReview>;
  listByUser(userUniqueId: string, page?: number, perPage?: number): Promise<PageResult<ProductReview>>;
}

export function createProductReviewsService(transport: Transport, _config: { appId: string }): ProductReviewsService {
  return {
    async list(productUniqueId: string, page?: number, perPage?: number): Promise<PageResult<ProductReview>> {
      const params: Record<string, string> = {};
      if (page) params['page'] = String(page);
      if (perPage) params['records'] = String(perPage);

      const response = await transport.get<unknown>(`/products/${productUniqueId}/reviews`, { params });
      return decodePageResult(response, productReviewMapper);
    },

    async create(productUniqueId: string, data: CreateReviewRequest): Promise<ProductReview> {
      const response = await transport.post<unknown>(`/products/${productUniqueId}/reviews`, {
        review: {
          rating: data.rating,
          title: data.title,
          content: data.content,
          payload: data.payload,
        },
      });
      return decodeOne(response, productReviewMapper);
    },

    async update(productUniqueId: string, reviewUniqueId: string, data: UpdateReviewRequest): Promise<ProductReview> {
      const response = await transport.put<unknown>(`/products/${productUniqueId}/reviews/${reviewUniqueId}`, {
        review: {
          rating: data.rating,
          title: data.title,
          content: data.content,
          payload: data.payload,
        },
      });
      return decodeOne(response, productReviewMapper);
    },

    async delete(productUniqueId: string, reviewUniqueId: string): Promise<void> {
      await transport.delete(`/products/${productUniqueId}/reviews/${reviewUniqueId}`);
    },

    async flag(productUniqueId: string, reviewUniqueId: string): Promise<ProductReview> {
      const response = await transport.put<unknown>(`/products/${productUniqueId}/reviews/${reviewUniqueId}/flag`, {});
      return decodeOne(response, productReviewMapper);
    },

    async listByUser(userUniqueId: string, page?: number, perPage?: number): Promise<PageResult<ProductReview>> {
      const params: Record<string, string> = {};
      if (page) params['page'] = String(page);
      if (perPage) params['records'] = String(perPage);

      const response = await transport.get<unknown>(`/users/${userUniqueId}/reviews`, { params });
      return decodePageResult(response, productReviewMapper);
    },
  };
}
