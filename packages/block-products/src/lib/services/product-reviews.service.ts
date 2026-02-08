import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type { ProductReview } from '../types/product.js';
import { productReviewMapper } from '../mappers/product.mapper.js';

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
  /**
   * List reviews for a specific product with optional pagination.
   * @param productUniqueId - The product unique ID
   * @param page - Page number for pagination
   * @param perPage - Number of items per page
   * @returns Paginated result containing an array of ProductReview items and page metadata
   */
  list(productUniqueId: string, page?: number, perPage?: number): Promise<PageResult<ProductReview>>;

  /**
   * Create a new review for a product.
   * @param productUniqueId - The product unique ID
   * @param data - Review creation payload including rating, optional title, content, and payload
   * @returns The newly created ProductReview
   */
  create(productUniqueId: string, data: CreateReviewRequest): Promise<ProductReview>;

  /**
   * Update an existing product review.
   * @param productUniqueId - The product unique ID
   * @param reviewUniqueId - The review unique ID
   * @param data - Fields to update on the review
   * @returns The updated ProductReview
   */
  update(productUniqueId: string, reviewUniqueId: string, data: UpdateReviewRequest): Promise<ProductReview>;

  /**
   * Delete a product review.
   * @param productUniqueId - The product unique ID
   * @param reviewUniqueId - The review unique ID
   * @returns Resolves when the review has been deleted
   */
  delete(productUniqueId: string, reviewUniqueId: string): Promise<void>;

  /**
   * Flag a product review for moderation.
   * @param productUniqueId - The product unique ID
   * @param reviewUniqueId - The review unique ID
   * @returns The flagged ProductReview
   */
  flag(productUniqueId: string, reviewUniqueId: string): Promise<ProductReview>;

  /**
   * List all reviews submitted by a specific user.
   * @param userUniqueId - The user unique ID
   * @param page - Page number for pagination
   * @param perPage - Number of items per page
   * @returns Paginated result containing ProductReview items by the user and page metadata
   */
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
