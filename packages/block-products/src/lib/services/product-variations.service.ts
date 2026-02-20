import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type { ProductVariation, CreateVariationRequest, UpdateVariationRequest } from '../types/product.js';
import { productVariationMapper, productReviewMapper } from '../mappers/product.mapper.js';

export interface ProductVariationsService {
  /**
   * List all variations for a given product.
   * @param productUniqueId - The parent product unique ID
   * @returns Array of ProductVariation items
   */
  list(productUniqueId: string): Promise<ProductVariation[]>;

  /**
   * Get a single product variation by its unique identifier.
   * @param productUniqueId - The parent product unique ID
   * @param variationUniqueId - The variation unique ID
   * @returns The matching ProductVariation
   */
  get(productUniqueId: string, variationUniqueId: string): Promise<ProductVariation>;

  /**
   * Create a new variation for a product.
   * @param productUniqueId - The parent product unique ID
   * @param data - Variation creation payload including SKU, name, attributes (size, color), and price
   * @returns The newly created ProductVariation
   */
  create(productUniqueId: string, data: CreateVariationRequest): Promise<ProductVariation>;

  /**
   * Update an existing product variation.
   * @param productUniqueId - The parent product unique ID
   * @param variationUniqueId - The variation unique ID
   * @param data - Fields to update on the variation
   * @returns The updated ProductVariation
   */
  update(productUniqueId: string, variationUniqueId: string, data: UpdateVariationRequest): Promise<ProductVariation>;

  /**
   * Delete a product variation.
   * @param productUniqueId - The parent product unique ID
   * @param variationUniqueId - The variation unique ID
   * @returns Resolves when the variation has been deleted
   */
  delete(productUniqueId: string, variationUniqueId: string): Promise<void>;

  // Variation Reviews

  /**
   * List reviews for a specific variation under a product.
   * @param productUniqueId - The parent product unique ID
   * @param variationUniqueId - The variation unique ID
   * @returns Paginated result containing review items and page metadata
   */
  listReviews(productUniqueId: string, variationUniqueId: string): Promise<PageResult<any>>;

  /**
   * Create a review for a product variation.
   * @param productUniqueId - The parent product unique ID
   * @param variationUniqueId - The variation unique ID
   * @param data - Review data including rating, optional title, and content
   * @returns The newly created review
   */
  createReview(productUniqueId: string, variationUniqueId: string, data: { rating: number; title?: string; content?: string }): Promise<any>;

  /**
   * Update an existing review for a product variation.
   * @param productUniqueId - The parent product unique ID
   * @param variationUniqueId - The variation unique ID
   * @param reviewUniqueId - The review unique ID
   * @param data - Fields to update on the review
   * @returns The updated review
   */
  updateReview(productUniqueId: string, variationUniqueId: string, reviewUniqueId: string, data: { rating?: number; title?: string; content?: string }): Promise<any>;

  /**
   * Delete a review for a product variation.
   * @param productUniqueId - The parent product unique ID
   * @param variationUniqueId - The variation unique ID
   * @param reviewUniqueId - The review unique ID
   * @returns Resolves when the review has been deleted
   */
  deleteReview(productUniqueId: string, variationUniqueId: string, reviewUniqueId: string): Promise<void>;

  /**
   * Flag a variation review for moderation.
   * @param productUniqueId - The parent product unique ID
   * @param variationUniqueId - The variation unique ID
   * @param reviewUniqueId - The review unique ID
   * @returns The flagged review
   */
  flagReview(productUniqueId: string, variationUniqueId: string, reviewUniqueId: string): Promise<any>;
}

export function createProductVariationsService(transport: Transport, _config: { apiKey: string }): ProductVariationsService {
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
