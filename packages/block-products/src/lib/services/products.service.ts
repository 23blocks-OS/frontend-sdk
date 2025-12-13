import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Product,
  ProductVariation,
  ProductImage,
  ProductStock,
  ProductReview,
  CreateProductRequest,
  UpdateProductRequest,
  ListProductsParams,
  CreateVariationRequest,
  UpdateVariationRequest,
} from '../types/product';
import {
  productMapper,
  productVariationMapper,
  productImageMapper,
  productStockMapper,
  productReviewMapper,
} from '../mappers/product.mapper';

export interface ProductsService {
  // Products
  list(params?: ListProductsParams): Promise<PageResult<Product>>;
  get(uniqueId: string): Promise<Product>;
  create(data: CreateProductRequest): Promise<Product>;
  update(uniqueId: string, data: UpdateProductRequest): Promise<Product>;
  delete(uniqueId: string): Promise<void>;
  recover(uniqueId: string): Promise<Product>;
  search(query: string, params?: ListProductsParams): Promise<PageResult<Product>>;
  listDeleted(params?: ListProductsParams): Promise<PageResult<Product>>;

  // Variations
  listVariations(productUniqueId: string): Promise<ProductVariation[]>;
  getVariation(uniqueId: string): Promise<ProductVariation>;
  createVariation(data: CreateVariationRequest): Promise<ProductVariation>;
  updateVariation(uniqueId: string, data: UpdateVariationRequest): Promise<ProductVariation>;
  deleteVariation(uniqueId: string): Promise<void>;

  // Images
  listImages(productUniqueId: string): Promise<ProductImage[]>;
  addImage(productUniqueId: string, imageUrl: string, isPrimary?: boolean): Promise<ProductImage>;
  deleteImage(uniqueId: string): Promise<void>;

  // Stock
  getStock(productUniqueId: string, vendorUniqueId?: string): Promise<ProductStock[]>;
  updateStock(productUniqueId: string, vendorUniqueId: string, warehouseUniqueId: string, quantity: number): Promise<ProductStock>;

  // Reviews
  listReviews(productUniqueId: string): Promise<PageResult<ProductReview>>;
  addReview(productUniqueId: string, rating: number, title?: string, content?: string): Promise<ProductReview>;
}

export function createProductsService(transport: Transport, _config: { appId: string }): ProductsService {
  return {
    async list(params?: ListProductsParams): Promise<PageResult<Product>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.categoryUniqueId) queryParams['category_unique_id'] = params.categoryUniqueId;
      if (params?.brandUniqueId) queryParams['brand_unique_id'] = params.brandUniqueId;
      if (params?.vendorUniqueId) queryParams['vendor_unique_id'] = params.vendorUniqueId;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.withStock) queryParams['with'] = 'stock';
      if (params?.withPrices) queryParams['with'] = params.withStock ? 'stock,prices' : 'prices';
      if (params?.withCategories) queryParams['with'] = queryParams['with'] ? `${queryParams['with']},categories` : 'categories';
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/products', { params: queryParams });
      return decodePageResult(response, productMapper);
    },

    async get(uniqueId: string): Promise<Product> {
      const response = await transport.get<unknown>(`/products/${uniqueId}`);
      return decodeOne(response, productMapper);
    },

    async create(data: CreateProductRequest): Promise<Product> {
      const response = await transport.post<unknown>('/products', {
        data: {
          type: 'Product',
          attributes: {
            sku: data.sku,
            name: data.name,
            description: data.description,
            product_type: data.productType,
            price: data.price,
            cost: data.cost,
            image_url: data.imageUrl,
            brand_unique_id: data.brandUniqueId,
            category_unique_ids: data.categoryUniqueIds,
            payload: data.payload,
          },
        },
      });
      return decodeOne(response, productMapper);
    },

    async update(uniqueId: string, data: UpdateProductRequest): Promise<Product> {
      const response = await transport.put<unknown>(`/products/${uniqueId}`, {
        data: {
          type: 'Product',
          attributes: {
            name: data.name,
            description: data.description,
            product_type: data.productType,
            price: data.price,
            cost: data.cost,
            discount: data.discount,
            tax: data.tax,
            fees: data.fees,
            image_url: data.imageUrl,
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
          },
        },
      });
      return decodeOne(response, productMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/products/${uniqueId}`);
    },

    async recover(uniqueId: string): Promise<Product> {
      const response = await transport.put<unknown>(`/products/${uniqueId}/recover`, {});
      return decodeOne(response, productMapper);
    },

    async search(query: string, params?: ListProductsParams): Promise<PageResult<Product>> {
      const queryParams: Record<string, string> = { search: query };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.post<unknown>('/products/search', { search: query }, { params: queryParams });
      return decodePageResult(response, productMapper);
    },

    async listDeleted(params?: ListProductsParams): Promise<PageResult<Product>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.get<unknown>('/products/trash/show', { params: queryParams });
      return decodePageResult(response, productMapper);
    },

    // Variations
    async listVariations(productUniqueId: string): Promise<ProductVariation[]> {
      const response = await transport.get<unknown>(`/products/${productUniqueId}/variations`);
      return decodeMany(response, productVariationMapper);
    },

    async getVariation(uniqueId: string): Promise<ProductVariation> {
      const response = await transport.get<unknown>(`/product_variations/${uniqueId}`);
      return decodeOne(response, productVariationMapper);
    },

    async createVariation(data: CreateVariationRequest): Promise<ProductVariation> {
      const response = await transport.post<unknown>('/product_variations', {
        data: {
          type: 'Variation',
          attributes: {
            product_unique_id: data.productUniqueId,
            sku: data.sku,
            name: data.name,
            size: data.size,
            color: data.color,
            extra_variation: data.extraVariation,
            price: data.price,
            image_url: data.imageUrl,
          },
        },
      });
      return decodeOne(response, productVariationMapper);
    },

    async updateVariation(uniqueId: string, data: UpdateVariationRequest): Promise<ProductVariation> {
      const response = await transport.put<unknown>(`/product_variations/${uniqueId}`, {
        data: {
          type: 'Variation',
          attributes: {
            name: data.name,
            size: data.size,
            color: data.color,
            extra_variation: data.extraVariation,
            price: data.price,
            image_url: data.imageUrl,
            enabled: data.enabled,
            status: data.status,
          },
        },
      });
      return decodeOne(response, productVariationMapper);
    },

    async deleteVariation(uniqueId: string): Promise<void> {
      await transport.delete(`/product_variations/${uniqueId}`);
    },

    // Images
    async listImages(productUniqueId: string): Promise<ProductImage[]> {
      const response = await transport.get<unknown>(`/products/${productUniqueId}/images`);
      return decodeMany(response, productImageMapper);
    },

    async addImage(productUniqueId: string, imageUrl: string, isPrimary = false): Promise<ProductImage> {
      const response = await transport.post<unknown>(`/products/${productUniqueId}/images`, {
        data: {
          type: 'ProductImage',
          attributes: {
            image_url: imageUrl,
            is_primary: isPrimary,
          },
        },
      });
      return decodeOne(response, productImageMapper);
    },

    async deleteImage(uniqueId: string): Promise<void> {
      await transport.delete(`/product_images/${uniqueId}`);
    },

    // Stock
    async getStock(productUniqueId: string, vendorUniqueId?: string): Promise<ProductStock[]> {
      const params: Record<string, string> = {};
      if (vendorUniqueId) params['vendor_unique_id'] = vendorUniqueId;

      const response = await transport.get<unknown>(`/products/${productUniqueId}/stock`, { params });
      return decodeMany(response, productStockMapper);
    },

    async updateStock(
      productUniqueId: string,
      vendorUniqueId: string,
      warehouseUniqueId: string,
      quantity: number
    ): Promise<ProductStock> {
      const response = await transport.put<unknown>(`/stock_manager/${productUniqueId}`, {
        data: {
          type: 'ProductStock',
          attributes: {
            vendor_unique_id: vendorUniqueId,
            warehouse_unique_id: warehouseUniqueId,
            quantity: quantity,
          },
        },
      });
      return decodeOne(response, productStockMapper);
    },

    // Reviews
    async listReviews(productUniqueId: string): Promise<PageResult<ProductReview>> {
      const response = await transport.get<unknown>(`/products/${productUniqueId}/reviews`);
      return decodePageResult(response, productReviewMapper);
    },

    async addReview(productUniqueId: string, rating: number, title?: string, content?: string): Promise<ProductReview> {
      const response = await transport.post<unknown>(`/products/${productUniqueId}/reviews`, {
        data: {
          type: 'ProductReview',
          attributes: {
            rating,
            title,
            content,
          },
        },
      });
      return decodeOne(response, productReviewMapper);
    },
  };
}
