import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  ProductPromotion,
  CreateProductPromotionRequest,
  UpdateProductPromotionRequest,
  ListProductPromotionsParams,
} from '../types/product-promotion';
import { productPromotionMapper } from '../mappers/product-promotion.mapper';

export interface ProductPromotionsService {
  list(params?: ListProductPromotionsParams): Promise<PageResult<ProductPromotion>>;
  get(uniqueId: string): Promise<ProductPromotion>;
  create(data: CreateProductPromotionRequest): Promise<ProductPromotion>;
  update(uniqueId: string, data: UpdateProductPromotionRequest): Promise<ProductPromotion>;
  delete(uniqueId: string): Promise<void>;
  activate(uniqueId: string): Promise<ProductPromotion>;
  deactivate(uniqueId: string): Promise<ProductPromotion>;
}

export function createProductPromotionsService(transport: Transport, _config: { appId: string }): ProductPromotionsService {
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
          product_unique_id: data.productUniqueId,
          name: data.name,
          description: data.description,
          promotion_type: data.promotionType,
          discount_type: data.discountType,
          discount_value: data.discountValue,
          start_date: data.startDate?.toISOString(),
          end_date: data.endDate?.toISOString(),
          min_quantity: data.minQuantity,
          max_quantity: data.maxQuantity,
          is_stackable: data.isStackable,
          payload: data.payload,
        },
      });
      return decodeOne(response, productPromotionMapper);
    },

    async update(uniqueId: string, data: UpdateProductPromotionRequest): Promise<ProductPromotion> {
      const response = await transport.put<unknown>(`/promotions/${uniqueId}`, {
        promotion: {
          name: data.name,
          description: data.description,
          promotion_type: data.promotionType,
          discount_type: data.discountType,
          discount_value: data.discountValue,
          start_date: data.startDate?.toISOString(),
          end_date: data.endDate?.toISOString(),
          min_quantity: data.minQuantity,
          max_quantity: data.maxQuantity,
          is_stackable: data.isStackable,
          status: data.status,
          payload: data.payload,
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
