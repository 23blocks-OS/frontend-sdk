import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  ProductPrice,
  CreateProductPriceRequest,
  UpdateProductPriceRequest,
  ListProductPricesParams,
} from '../types/product-price';
import { productPriceMapper } from '../mappers/product-price.mapper';

export interface ProductPricesService {
  list(params?: ListProductPricesParams): Promise<PageResult<ProductPrice>>;
  get(uniqueId: string): Promise<ProductPrice>;
  create(data: CreateProductPriceRequest): Promise<ProductPrice>;
  update(uniqueId: string, data: UpdateProductPriceRequest): Promise<ProductPrice>;
  delete(uniqueId: string): Promise<void>;
  getForProduct(productUniqueId: string, params?: ListProductPricesParams): Promise<PageResult<ProductPrice>>;
  getForVariation(variationUniqueId: string, params?: ListProductPricesParams): Promise<PageResult<ProductPrice>>;
}

export function createProductPricesService(transport: Transport, _config: { appId: string }): ProductPricesService {
  return {
    async list(params?: ListProductPricesParams): Promise<PageResult<ProductPrice>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.productUniqueId) queryParams['product_unique_id'] = params.productUniqueId;
      if (params?.variationUniqueId) queryParams['variation_unique_id'] = params.variationUniqueId;
      if (params?.channelUniqueId) queryParams['channel_unique_id'] = params.channelUniqueId;
      if (params?.priceListUniqueId) queryParams['price_list_unique_id'] = params.priceListUniqueId;
      if (params?.currency) queryParams['currency'] = params.currency;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/prices/', { params: queryParams });
      return decodePageResult(response, productPriceMapper);
    },

    async get(uniqueId: string): Promise<ProductPrice> {
      const response = await transport.get<unknown>(`/prices/${uniqueId}/`);
      return decodeOne(response, productPriceMapper);
    },

    async create(data: CreateProductPriceRequest): Promise<ProductPrice> {
      const response = await transport.post<unknown>('/prices/', {
        price: {
          product_unique_id: data.productUniqueId,
          variation_unique_id: data.variationUniqueId,
          channel_unique_id: data.channelUniqueId,
          price_list_unique_id: data.priceListUniqueId,
          price: data.price,
          compare_at_price: data.compareAtPrice,
          cost: data.cost,
          currency: data.currency,
          min_quantity: data.minQuantity,
          max_quantity: data.maxQuantity,
          start_date: data.startDate?.toISOString(),
          end_date: data.endDate?.toISOString(),
          payload: data.payload,
        },
      });
      return decodeOne(response, productPriceMapper);
    },

    async update(uniqueId: string, data: UpdateProductPriceRequest): Promise<ProductPrice> {
      const response = await transport.put<unknown>(`/prices/${uniqueId}`, {
        price: {
          price: data.price,
          compare_at_price: data.compareAtPrice,
          cost: data.cost,
          currency: data.currency,
          min_quantity: data.minQuantity,
          max_quantity: data.maxQuantity,
          start_date: data.startDate?.toISOString(),
          end_date: data.endDate?.toISOString(),
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, productPriceMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/prices/${uniqueId}`);
    },

    async getForProduct(productUniqueId: string, params?: ListProductPricesParams): Promise<PageResult<ProductPrice>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.channelUniqueId) queryParams['channel_unique_id'] = params.channelUniqueId;
      if (params?.currency) queryParams['currency'] = params.currency;

      const response = await transport.get<unknown>(`/products/${productUniqueId}/prices`, { params: queryParams });
      return decodePageResult(response, productPriceMapper);
    },

    async getForVariation(variationUniqueId: string, params?: ListProductPricesParams): Promise<PageResult<ProductPrice>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.channelUniqueId) queryParams['channel_unique_id'] = params.channelUniqueId;
      if (params?.currency) queryParams['currency'] = params.currency;

      const response = await transport.get<unknown>(`/variations/${variationUniqueId}/prices`, { params: queryParams });
      return decodePageResult(response, productPriceMapper);
    },
  };
}
