import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  ProductPromotion,
  CreateProductPromotionRequest,
  UpdateProductPromotionRequest,
  ListProductPromotionsParams,
} from '../types/product-promotion.js';
import { productPromotionMapper } from '../mappers/product-promotion.mapper.js';

export interface ProductPromotionsService {
  /**
   * List product promotions with optional filtering, sorting, and pagination.
   * @param params - Filter options including status, product, promotion type, active state, and pagination
   * @returns Paginated result containing an array of ProductPromotion items and page metadata
   */
  list(params?: ListProductPromotionsParams): Promise<PageResult<ProductPromotion>>;

  /**
   * Get a single product promotion by its unique identifier.
   * @param uniqueId - The promotion unique ID
   * @returns The matching ProductPromotion
   */
  get(uniqueId: string): Promise<ProductPromotion>;

  /**
   * Create a new product promotion.
   * @param data - Promotion creation payload including product, discount details, date range, and quantity constraints
   * @returns The newly created ProductPromotion
   */
  create(data: CreateProductPromotionRequest): Promise<ProductPromotion>;

  /**
   * Update an existing product promotion.
   * @param uniqueId - The promotion unique ID
   * @param data - Fields to update on the promotion
   * @returns The updated ProductPromotion
   */
  update(uniqueId: string, data: UpdateProductPromotionRequest): Promise<ProductPromotion>;

  /**
   * Delete a product promotion.
   * @param uniqueId - The promotion unique ID
   * @returns Resolves when the promotion has been deleted
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Activate a product promotion.
   * @param uniqueId - The promotion unique ID
   * @returns The activated ProductPromotion
   */
  activate(uniqueId: string): Promise<ProductPromotion>;

  /**
   * Deactivate a product promotion.
   * @param uniqueId - The promotion unique ID
   * @returns The deactivated ProductPromotion
   */
  deactivate(uniqueId: string): Promise<ProductPromotion>;
}

export function createProductPromotionsService(transport: Transport, _config: { apiKey: string }): ProductPromotionsService {
  return {
    async list(params?: ListProductPromotionsParams): Promise<PageResult<ProductPromotion>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.productUniqueId) queryParams['product_unique_id'] = params.productUniqueId;
      if (params?.promotionType) queryParams['promotion_type'] = params.promotionType;
      if (params?.active !== undefined) queryParams['active'] = String(params.active);
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/promotions/', { params: queryParams });
      return decodePageResult(response, productPromotionMapper);
    },

    async get(uniqueId: string): Promise<ProductPromotion> {
      const response = await transport.get<unknown>(`/promotions/${uniqueId}/`);
      return decodeOne(response, productPromotionMapper);
    },

    async create(data: CreateProductPromotionRequest): Promise<ProductPromotion> {
      const response = await transport.post<unknown>('/promotions/', {
        promotion: {
          price_unique_id: data.priceUniqueId,
          code: data.code,
          name: data.name,
          description: data.description,
          discount_money: data.discountMoney,
          discount_percentage: data.discountPercentage,
          additional_points: data.additionalPoints,
          minimum_purchase: data.minimumPurchase,
          discount_money_field: data.discountMoneyField,
          discount_percentage_field: data.discountPercentageField,
          valid_from: data.validFrom,
          valid_to: data.validTo,
          content_url: data.contentUrl,
          image_url: data.imageUrl,
          media_url: data.mediaUrl,
          thumbnail_url: data.thumbnailUrl,
          qcode: data.qcode,
          status: data.status,
          source: data.source,
          source_alias: data.sourceAlias,
          source_id: data.sourceId,
          source_type: data.sourceType,
          time_zone: data.timeZone,
        },
      });
      return decodeOne(response, productPromotionMapper);
    },

    async update(uniqueId: string, data: UpdateProductPromotionRequest): Promise<ProductPromotion> {
      const response = await transport.put<unknown>(`/promotions/${uniqueId}`, {
        promotion: {
          price_unique_id: data.priceUniqueId,
          code: data.code,
          name: data.name,
          description: data.description,
          discount_money: data.discountMoney,
          discount_percentage: data.discountPercentage,
          additional_points: data.additionalPoints,
          minimum_purchase: data.minimumPurchase,
          discount_money_field: data.discountMoneyField,
          discount_percentage_field: data.discountPercentageField,
          valid_from: data.validFrom,
          valid_to: data.validTo,
          content_url: data.contentUrl,
          image_url: data.imageUrl,
          media_url: data.mediaUrl,
          thumbnail_url: data.thumbnailUrl,
          qcode: data.qcode,
          status: data.status,
          source: data.source,
          source_alias: data.sourceAlias,
          source_id: data.sourceId,
          source_type: data.sourceType,
          time_zone: data.timeZone,
        },
      });
      return decodeOne(response, productPromotionMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/promotions/${uniqueId}`);
    },

    async activate(uniqueId: string): Promise<ProductPromotion> {
      const response = await transport.put<unknown>(`/promotions/${uniqueId}/activate`, {});
      return decodeOne(response, productPromotionMapper);
    },

    async deactivate(uniqueId: string): Promise<ProductPromotion> {
      const response = await transport.put<unknown>(`/promotions/${uniqueId}/deactivate`, {});
      return decodeOne(response, productPromotionMapper);
    },
  };
}
