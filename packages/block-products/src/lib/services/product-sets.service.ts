import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  ProductSet,
  CreateProductSetRequest,
  UpdateProductSetRequest,
  ListProductSetsParams,
} from '../types/product-set.js';
import { productSetMapper } from '../mappers/product-set.mapper.js';

export interface ProductSetsService {
  /**
   * List product sets with optional filtering, sorting, and pagination.
   * @param params - Filter options including status, search query, and pagination
   * @returns Paginated result containing an array of ProductSet items and page metadata
   */
  list(params?: ListProductSetsParams): Promise<PageResult<ProductSet>>;

  /**
   * Get a single product set by its unique identifier.
   * @param uniqueId - The product set unique ID
   * @returns The matching ProductSet
   */
  get(uniqueId: string): Promise<ProductSet>;

  /**
   * Create a new product set (bundle).
   * @param data - Product set creation payload including name, SKU, pricing, and optional image
   * @returns The newly created ProductSet
   */
  create(data: CreateProductSetRequest): Promise<ProductSet>;

  /**
   * Update an existing product set.
   * @param uniqueId - The product set unique ID
   * @param data - Fields to update on the product set
   * @returns The updated ProductSet
   */
  update(uniqueId: string, data: UpdateProductSetRequest): Promise<ProductSet>;

  /**
   * Soft-delete a product set.
   * @param uniqueId - The product set unique ID
   * @returns Resolves when the product set has been deleted
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Recover a previously soft-deleted product set.
   * @param uniqueId - The product set unique ID
   * @returns The recovered ProductSet
   */
  recover(uniqueId: string): Promise<ProductSet>;

  /**
   * Add a product to the set with an optional quantity.
   * @param uniqueId - The product set unique ID
   * @param productUniqueId - The product unique ID to add
   * @param quantity - Quantity of the product in the set (defaults to 1)
   * @returns The updated ProductSet
   */
  addProduct(uniqueId: string, productUniqueId: string, quantity?: number): Promise<ProductSet>;

  /**
   * Remove a product from the set.
   * @param uniqueId - The product set unique ID
   * @param productUniqueId - The product unique ID to remove
   * @returns Resolves when the product has been removed from the set
   */
  removeProduct(uniqueId: string, productUniqueId: string): Promise<void>;

  /**
   * Add a category association to the product set.
   * @param uniqueId - The product set unique ID
   * @param categoryUniqueId - The category unique ID to associate
   * @returns The updated ProductSet
   */
  addCategory(uniqueId: string, categoryUniqueId: string): Promise<ProductSet>;

  /**
   * Remove a category association from the product set.
   * @param uniqueId - The product set unique ID
   * @param categoryUniqueId - The category unique ID to disassociate
   * @returns Resolves when the category has been removed from the set
   */
  removeCategory(uniqueId: string, categoryUniqueId: string): Promise<void>;
}

export function createProductSetsService(transport: Transport, _config: { apiKey: string }): ProductSetsService {
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
        set: {
          name: data.name,
          description: data.description,
          sku: data.sku,
          price: data.price,
          image_url: data.imageUrl,
          code: data.code,
          content_url: data.contentUrl,
          media_url: data.mediaUrl,
          tax: data.tax,
          discount: data.discount,
          status: data.status,
          open_price: data.openPrice,
          open_stock: data.openStock,
          qcode: data.qcode,
          meta_title: data.metaTitle,
          meta_description: data.metaDescription,
          meta_keywords: data.metaKeywords,
          slug: data.slug,
          category_unique_id: data.categoryUniqueId,
        },
      });
      return decodeOne(response, productSetMapper);
    },

    async update(uniqueId: string, data: UpdateProductSetRequest): Promise<ProductSet> {
      const response = await transport.put<unknown>(`/sets/${uniqueId}`, {
        set: {
          name: data.name,
          description: data.description,
          sku: data.sku,
          price: data.price,
          image_url: data.imageUrl,
          code: data.code,
          content_url: data.contentUrl,
          media_url: data.mediaUrl,
          tax: data.tax,
          discount: data.discount,
          status: data.status,
          open_price: data.openPrice,
          open_stock: data.openStock,
          qcode: data.qcode,
          meta_title: data.metaTitle,
          meta_description: data.metaDescription,
          meta_keywords: data.metaKeywords,
          slug: data.slug,
          category_unique_id: data.categoryUniqueId,
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
