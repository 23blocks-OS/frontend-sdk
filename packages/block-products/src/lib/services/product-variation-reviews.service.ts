import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  ProductVariationReview,
  CreateVariationReviewRequest,
  UpdateVariationReviewRequest,
  ListVariationReviewsParams,
} from '../types/product-variation-review';
import { productVariationReviewMapper } from '../mappers/product-variation-review.mapper';

export interface ProductVariationReviewsService {
  list(variationUniqueId: string, params?: ListVariationReviewsParams): Promise<PageResult<ProductVariationReview>>;
  get(variationUniqueId: string, reviewUniqueId: string): Promise<ProductVariationReview>;
  create(variationUniqueId: string, data: CreateVariationReviewRequest): Promise<ProductVariationReview>;
  update(variationUniqueId: string, reviewUniqueId: string, data: UpdateVariationReviewRequest): Promise<ProductVariationReview>;
  delete(variationUniqueId: string, reviewUniqueId: string): Promise<void>;
  markHelpful(variationUniqueId: string, reviewUniqueId: string): Promise<ProductVariationReview>;
  markNotHelpful(variationUniqueId: string, reviewUniqueId: string): Promise<ProductVariationReview>;
  flag(variationUniqueId: string, reviewUniqueId: string): Promise<ProductVariationReview>;
  listByUser(userUniqueId: string, params?: ListVariationReviewsParams): Promise<PageResult<ProductVariationReview>>;
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
