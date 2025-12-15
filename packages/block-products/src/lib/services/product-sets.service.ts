import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  ProductSet,
  CreateProductSetRequest,
  UpdateProductSetRequest,
  ListProductSetsParams,
} from '../types/product-set';
import { productSetMapper } from '../mappers/product-set.mapper';

export interface ProductSetsService {
  list(params?: ListProductSetsParams): Promise<PageResult<ProductSet>>;
  get(uniqueId: string): Promise<ProductSet>;
  create(data: CreateProductSetRequest): Promise<ProductSet>;
  update(uniqueId: string, data: UpdateProductSetRequest): Promise<ProductSet>;
  delete(uniqueId: string): Promise<void>;
  recover(uniqueId: string): Promise<ProductSet>;
  addProduct(uniqueId: string, productUniqueId: string, quantity?: number): Promise<ProductSet>;
  removeProduct(uniqueId: string, productUniqueId: string): Promise<void>;
  addCategory(uniqueId: string, categoryUniqueId: string): Promise<ProductSet>;
  removeCategory(uniqueId: string, categoryUniqueId: string): Promise<void>;
}

export function createProductSetsService(transport: Transport, _config: { appId: string }): ProductSetsService {
  return {
    async list(params?: ListProductSetsParams): Promise<PageResult<ProductSet>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/sets/', { params: queryParams });
      return decodePageResult(response, productSetMapper);
    },

    async get(uniqueId: string): Promise<ProductSet> {
      const response = await transport.get<unknown>(`/sets/${uniqueId}/`);
      return decodeOne(response, productSetMapper);
    },

    async create(data: CreateProductSetRequest): Promise<ProductSet> {
      const response = await transport.post<unknown>('/sets/', {
        product_set: {
          name: data.name,
          description: data.description,
          sku: data.sku,
          price: data.price,
          discount_price: data.discountPrice,
          image_url: data.imageUrl,
          payload: data.payload,
        },
      });
      return decodeOne(response, productSetMapper);
    },

    async update(uniqueId: string, data: UpdateProductSetRequest): Promise<ProductSet> {
      const response = await transport.put<unknown>(`/sets/${uniqueId}`, {
        product_set: {
          name: data.name,
          description: data.description,
          sku: data.sku,
          price: data.price,
          discount_price: data.discountPrice,
          image_url: data.imageUrl,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, productSetMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/sets/${uniqueId}`);
    },

    async recover(uniqueId: string): Promise<ProductSet> {
      const response = await transport.put<unknown>(`/sets/${uniqueId}/recover`, {});
      return decodeOne(response, productSetMapper);
    },

    async addProduct(uniqueId: string, productUniqueId: string, quantity = 1): Promise<ProductSet> {
      const response = await transport.post<unknown>(`/sets/${uniqueId}/products`, {
        product: {
          product_unique_id: productUniqueId,
          quantity,
        },
      });
      return decodeOne(response, productSetMapper);
    },

    async removeProduct(uniqueId: string, productUniqueId: string): Promise<void> {
      await transport.delete(`/sets/${uniqueId}/products/${productUniqueId}`);
    },

    async addCategory(uniqueId: string, categoryUniqueId: string): Promise<ProductSet> {
      const response = await transport.post<unknown>(`/sets/${uniqueId}/categories`, {
        category: {
          category_unique_id: categoryUniqueId,
        },
      });
      return decodeOne(response, productSetMapper);
    },

    async removeCategory(uniqueId: string, categoryUniqueId: string): Promise<void> {
      await transport.delete(`/sets/${uniqueId}/categories/${categoryUniqueId}`);
    },
  };
}
