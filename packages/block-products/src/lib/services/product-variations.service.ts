import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type { ProductVariation, CreateVariationRequest, UpdateVariationRequest } from '../types/product';
import { productVariationMapper, productReviewMapper } from '../mappers/product.mapper';

export interface ProductVariationsService {
  list(productUniqueId: string): Promise<ProductVariation[]>;
  get(productUniqueId: string, variationUniqueId: string): Promise<ProductVariation>;
  create(productUniqueId: string, data: CreateVariationRequest): Promise<ProductVariation>;
  update(productUniqueId: string, variationUniqueId: string, data: UpdateVariationRequest): Promise<ProductVariation>;
  delete(productUniqueId: string, variationUniqueId: string): Promise<void>;
  // Variation Reviews
  listReviews(productUniqueId: string, variationUniqueId: string): Promise<PageResult<any>>;
  createReview(productUniqueId: string, variationUniqueId: string, data: { rating: number; title?: string; content?: string }): Promise<any>;
  updateReview(productUniqueId: string, variationUniqueId: string, reviewUniqueId: string, data: { rating?: number; title?: string; content?: string }): Promise<any>;
  deleteReview(productUniqueId: string, variationUniqueId: string, reviewUniqueId: string): Promise<void>;
  flagReview(productUniqueId: string, variationUniqueId: string, reviewUniqueId: string): Promise<any>;
}

export function createProductVariationsService(transport: Transport, _config: { appId: string }): ProductVariationsService {
  return {
    async list(productUniqueId: string): Promise<ProductVariation[]> {
      const response = await transport.get<unknown>(`/products/${productUniqueId}/variations`);
      return decodeMany(response, productVariationMapper);
    },

    async get(productUniqueId: string, variationUniqueId: string): Promise<ProductVariation> {
      const response = await transport.get<unknown>(`/products/${productUniqueId}/variations/${variationUniqueId}`);
      return decodeOne(response, productVariationMapper);
    },

    async create(productUniqueId: string, data: CreateVariationRequest): Promise<ProductVariation> {
      const response = await transport.post<unknown>(`/products/${productUniqueId}/variations`, {
        variation: {
          sku: data.sku,
          name: data.name,
          size: data.size,
          color: data.color,
          extra_variation: data.extraVariation,
          price: data.price,
          image_url: data.imageUrl,
        },
      });
      return decodeOne(response, productVariationMapper);
    },

    async update(productUniqueId: string, variationUniqueId: string, data: UpdateVariationRequest): Promise<ProductVariation> {
      const response = await transport.put<unknown>(`/products/${productUniqueId}/variations/${variationUniqueId}`, {
        variation: {
          name: data.name,
          size: data.size,
          color: data.color,
          extra_variation: data.extraVariation,
          price: data.price,
          image_url: data.imageUrl,
          enabled: data.enabled,
          status: data.status,
        },
      });
      return decodeOne(response, productVariationMapper);
    },

    async delete(productUniqueId: string, variationUniqueId: string): Promise<void> {
      await transport.delete(`/products/${productUniqueId}/variations/${variationUniqueId}`);
    },

    async listReviews(productUniqueId: string, variationUniqueId: string): Promise<PageResult<any>> {
      const response = await transport.get<unknown>(`/products/${productUniqueId}/variations/${variationUniqueId}/reviews`);
      return decodePageResult(response, productReviewMapper);
    },

    async createReview(productUniqueId: string, variationUniqueId: string, data: { rating: number; title?: string; content?: string }): Promise<any> {
      const response = await transport.post<unknown>(`/products/${productUniqueId}/variations/${variationUniqueId}/reviews`, {
        review: {
          rating: data.rating,
          title: data.title,
          content: data.content,
        },
      });
      return decodeOne(response, productReviewMapper);
    },

    async updateReview(productUniqueId: string, variationUniqueId: string, reviewUniqueId: string, data: { rating?: number; title?: string; content?: string }): Promise<any> {
      const response = await transport.put<unknown>(`/products/${productUniqueId}/variations/${variationUniqueId}/reviews/${reviewUniqueId}`, {
        review: {
          rating: data.rating,
          title: data.title,
          content: data.content,
        },
      });
      return decodeOne(response, productReviewMapper);
    },

    async deleteReview(productUniqueId: string, variationUniqueId: string, reviewUniqueId: string): Promise<void> {
      await transport.delete(`/products/${productUniqueId}/variations/${variationUniqueId}/reviews/${reviewUniqueId}`);
    },

    async flagReview(productUniqueId: string, variationUniqueId: string, reviewUniqueId: string): Promise<any> {
      const response = await transport.put<unknown>(`/products/${productUniqueId}/variations/${variationUniqueId}/reviews/${reviewUniqueId}/flag`, {});
      return decodeOne(response, productReviewMapper);
    },
  };
}
