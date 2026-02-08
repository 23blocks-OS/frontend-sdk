import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  ProductVariationReview,
  CreateVariationReviewRequest,
  UpdateVariationReviewRequest,
  ListVariationReviewsParams,
} from '../types/product-variation-review.js';
import { productVariationReviewMapper } from '../mappers/product-variation-review.mapper.js';

export interface ProductVariationReviewsService {
  /**
   * List reviews for a specific product variation with optional filtering and pagination.
   * @param variationUniqueId - The variation unique ID
   * @param params - Filter options including user, rating range, verified purchase, status, and pagination
   * @returns Paginated result containing an array of ProductVariationReview items and page metadata
   */
  list(variationUniqueId: string, params?: ListVariationReviewsParams): Promise<PageResult<ProductVariationReview>>;

  /**
   * Get a single variation review by its unique identifier.
   * @param variationUniqueId - The variation unique ID
   * @param reviewUniqueId - The review unique ID
   * @returns The matching ProductVariationReview
   */
  get(variationUniqueId: string, reviewUniqueId: string): Promise<ProductVariationReview>;

  /**
   * Create a new review for a product variation.
   * @param variationUniqueId - The variation unique ID
   * @param data - Review creation payload including rating, optional title, content, and payload
   * @returns The newly created ProductVariationReview
   */
  create(variationUniqueId: string, data: CreateVariationReviewRequest): Promise<ProductVariationReview>;

  /**
   * Update an existing variation review.
   * @param variationUniqueId - The variation unique ID
   * @param reviewUniqueId - The review unique ID
   * @param data - Fields to update on the review
   * @returns The updated ProductVariationReview
   */
  update(variationUniqueId: string, reviewUniqueId: string, data: UpdateVariationReviewRequest): Promise<ProductVariationReview>;

  /**
   * Delete a variation review.
   * @param variationUniqueId - The variation unique ID
   * @param reviewUniqueId - The review unique ID
   * @returns Resolves when the review has been deleted
   */
  delete(variationUniqueId: string, reviewUniqueId: string): Promise<void>;

  /**
   * Mark a variation review as helpful.
   * @param variationUniqueId - The variation unique ID
   * @param reviewUniqueId - The review unique ID
   * @returns The updated ProductVariationReview with incremented helpful count
   */
  markHelpful(variationUniqueId: string, reviewUniqueId: string): Promise<ProductVariationReview>;

  /**
   * Mark a variation review as not helpful.
   * @param variationUniqueId - The variation unique ID
   * @param reviewUniqueId - The review unique ID
   * @returns The updated ProductVariationReview with incremented not-helpful count
   */
  markNotHelpful(variationUniqueId: string, reviewUniqueId: string): Promise<ProductVariationReview>;

  /**
   * Flag a variation review for moderation.
   * @param variationUniqueId - The variation unique ID
   * @param reviewUniqueId - The review unique ID
   * @returns The flagged ProductVariationReview
   */
  flag(variationUniqueId: string, reviewUniqueId: string): Promise<ProductVariationReview>;

  /**
   * List all variation reviews submitted by a specific user.
   * @param userUniqueId - The user unique ID
   * @param params - Optional filter and pagination options
   * @returns Paginated result containing ProductVariationReview items by the user and page metadata
   */
  listByUser(userUniqueId: string, params?: ListVariationReviewsParams): Promise<PageResult<ProductVariationReview>>;

  /**
   * Get the average rating and total review count for a product variation.
   * @param variationUniqueId - The variation unique ID
   * @returns Object containing averageRating (number) and totalReviews (number)
   */
  getAverageRating(variationUniqueId: string): Promise<{ averageRating: number; totalReviews: number }>;
}

export function createProductVariationReviewsService(transport: Transport, _config: { appId: string }): ProductVariationReviewsService {
  return {
    async list(variationUniqueId: string, params?: ListVariationReviewsParams): Promise<PageResult<ProductVariationReview>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.userUniqueId) queryParams['user_unique_id'] = params.userUniqueId;
      if (params?.rating) queryParams['rating'] = String(params.rating);
      if (params?.minRating) queryParams['min_rating'] = String(params.minRating);
      if (params?.maxRating) queryParams['max_rating'] = String(params.maxRating);
      if (params?.isVerifiedPurchase !== undefined) queryParams['is_verified_purchase'] = String(params.isVerifiedPurchase);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/product_variations/${variationUniqueId}/reviews`, { params: queryParams });
      return decodePageResult(response, productVariationReviewMapper);
    },

    async get(variationUniqueId: string, reviewUniqueId: string): Promise<ProductVariationReview> {
      const response = await transport.get<unknown>(`/product_variations/${variationUniqueId}/reviews/${reviewUniqueId}`);
      return decodeOne(response, productVariationReviewMapper);
    },

    async create(variationUniqueId: string, data: CreateVariationReviewRequest): Promise<ProductVariationReview> {
      const response = await transport.post<unknown>(`/product_variations/${variationUniqueId}/reviews`, {
        review: {
          rating: data.rating,
          title: data.title,
          content: data.content,
          payload: data.payload,
        },
      });
      return decodeOne(response, productVariationReviewMapper);
    },

    async update(variationUniqueId: string, reviewUniqueId: string, data: UpdateVariationReviewRequest): Promise<ProductVariationReview> {
      const response = await transport.put<unknown>(`/product_variations/${variationUniqueId}/reviews/${reviewUniqueId}`, {
        review: {
          rating: data.rating,
          title: data.title,
          content: data.content,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, productVariationReviewMapper);
    },

    async delete(variationUniqueId: string, reviewUniqueId: string): Promise<void> {
      await transport.delete(`/product_variations/${variationUniqueId}/reviews/${reviewUniqueId}`);
    },

    async markHelpful(variationUniqueId: string, reviewUniqueId: string): Promise<ProductVariationReview> {
      const response = await transport.post<unknown>(`/product_variations/${variationUniqueId}/reviews/${reviewUniqueId}/helpful`, {});
      return decodeOne(response, productVariationReviewMapper);
    },

    async markNotHelpful(variationUniqueId: string, reviewUniqueId: string): Promise<ProductVariationReview> {
      const response = await transport.post<unknown>(`/product_variations/${variationUniqueId}/reviews/${reviewUniqueId}/not_helpful`, {});
      return decodeOne(response, productVariationReviewMapper);
    },

    async flag(variationUniqueId: string, reviewUniqueId: string): Promise<ProductVariationReview> {
      const response = await transport.put<unknown>(`/product_variations/${variationUniqueId}/reviews/${reviewUniqueId}/flag`, {});
      return decodeOne(response, productVariationReviewMapper);
    },

    async listByUser(userUniqueId: string, params?: ListVariationReviewsParams): Promise<PageResult<ProductVariationReview>> {
      const queryParams: Record<string, string> = {
        user_unique_id: userUniqueId,
      };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.rating) queryParams['rating'] = String(params.rating);
      if (params?.minRating) queryParams['min_rating'] = String(params.minRating);
      if (params?.maxRating) queryParams['max_rating'] = String(params.maxRating);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/product_variation_reviews', { params: queryParams });
      return decodePageResult(response, productVariationReviewMapper);
    },

    async getAverageRating(variationUniqueId: string): Promise<{ averageRating: number; totalReviews: number }> {
      const response = await transport.get<Record<string, unknown>>(`/product_variations/${variationUniqueId}/reviews/stats`);
      return {
        averageRating: Number(response.average_rating ?? response.averageRating ?? 0),
        totalReviews: Number(response.total_reviews ?? response.totalReviews ?? 0),
      };
    },
  };
}
