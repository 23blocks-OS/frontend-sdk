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
} from '../types/product.js';
import {
  productMapper,
  productVariationMapper,
  productImageMapper,
  productStockMapper,
  productReviewMapper,
} from '../mappers/product.mapper.js';

export interface ProductsService {
  // Products

  /**
   * List products with optional filtering, sorting, and pagination.
   * @param params - Filter, sort, and pagination options
   * @returns Paginated result containing an array of Product items and page metadata
   * @note Supports including related stock, prices, and categories via `withStock`, `withPrices`, and `withCategories` params
   */
  list(params?: ListProductsParams): Promise<PageResult<Product>>;

  /**
   * Get a single product by its unique identifier.
   * @param uniqueId - The product unique ID
   * @returns The matching Product
   */
  get(uniqueId: string): Promise<Product>;

  /**
   * Create a new product.
   * @param data - Product creation payload including SKU, name, price, and optional metadata
   * @returns The newly created Product
   */
  create(data: CreateProductRequest): Promise<Product>;

  /**
   * Update an existing product.
   * @param uniqueId - The product unique ID
   * @param data - Fields to update on the product
   * @returns The updated Product
   */
  update(uniqueId: string, data: UpdateProductRequest): Promise<Product>;

  /**
   * Soft-delete a product.
   * @param uniqueId - The product unique ID
   * @returns Resolves when the product has been deleted
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Recover a previously soft-deleted product.
   * @param uniqueId - The product unique ID
   * @returns The recovered Product
   */
  recover(uniqueId: string): Promise<Product>;

  /**
   * Search products by a query string with optional pagination.
   * @param query - The search query
   * @param params - Optional pagination and filter options
   * @returns Paginated result containing matching Product items and page metadata
   * @note Sends the search query both as a query parameter and in the request body
   */
  search(query: string, params?: ListProductsParams): Promise<PageResult<Product>>;

  /**
   * List soft-deleted products.
   * @param params - Optional pagination options
   * @returns Paginated result containing deleted Product items and page metadata
   */
  listDeleted(params?: ListProductsParams): Promise<PageResult<Product>>;

  // Variations

  /**
   * List all variations for a given product.
   * @param productUniqueId - The parent product unique ID
   * @returns Array of ProductVariation items
   */
  listVariations(productUniqueId: string): Promise<ProductVariation[]>;

  /**
   * Get a single product variation by its unique identifier.
   * @param uniqueId - The variation unique ID
   * @returns The matching ProductVariation
   */
  getVariation(uniqueId: string): Promise<ProductVariation>;

  /**
   * Create a new product variation.
   * @param data - Variation creation payload including parent product ID, SKU, name, and attributes
   * @returns The newly created ProductVariation
   */
  createVariation(data: CreateVariationRequest): Promise<ProductVariation>;

  /**
   * Update an existing product variation.
   * @param uniqueId - The variation unique ID
   * @param data - Fields to update on the variation
   * @returns The updated ProductVariation
   */
  updateVariation(uniqueId: string, data: UpdateVariationRequest): Promise<ProductVariation>;

  /**
   * Delete a product variation.
   * @param uniqueId - The variation unique ID
   * @returns Resolves when the variation has been deleted
   */
  deleteVariation(uniqueId: string): Promise<void>;

  // Images

  /**
   * List all images for a given product.
   * @param productUniqueId - The product unique ID
   * @returns Array of ProductImage items
   */
  listImages(productUniqueId: string): Promise<ProductImage[]>;

  /**
   * Add an image to a product.
   * @param productUniqueId - The product unique ID
   * @param imageUrl - URL of the image to attach
   * @param isPrimary - Whether this image should be the primary product image (defaults to false)
   * @returns The newly created ProductImage
   */
  addImage(productUniqueId: string, imageUrl: string, isPrimary?: boolean): Promise<ProductImage>;

  /**
   * Delete a product image.
   * @param uniqueId - The image unique ID
   * @returns Resolves when the image has been deleted
   */
  deleteImage(uniqueId: string): Promise<void>;

  // Stock

  /**
   * Get stock entries for a product, optionally filtered by vendor.
   * @param productUniqueId - The product unique ID
   * @param vendorUniqueId - Optional vendor unique ID to filter stock by
   * @returns Array of ProductStock entries
   */
  getStock(productUniqueId: string, vendorUniqueId?: string): Promise<ProductStock[]>;

  /**
   * Update stock quantity for a product at a specific vendor and warehouse.
   * @param productUniqueId - The product unique ID
   * @param vendorUniqueId - The vendor unique ID
   * @param warehouseUniqueId - The warehouse unique ID
   * @param quantity - The new stock quantity
   * @returns The updated ProductStock entry
   */
  updateStock(productUniqueId: string, vendorUniqueId: string, warehouseUniqueId: string, quantity: number): Promise<ProductStock>;

  // Reviews

  /**
   * List reviews for a product.
   * @param productUniqueId - The product unique ID
   * @returns Paginated result containing ProductReview items and page metadata
   */
  listReviews(productUniqueId: string): Promise<PageResult<ProductReview>>;

  /**
   * Add a review to a product.
   * @param productUniqueId - The product unique ID
   * @param rating - Numeric rating value
   * @param title - Optional review title
   * @param content - Optional review body text
   * @returns The newly created ProductReview
   */
  addReview(productUniqueId: string, rating: number, comment?: string): Promise<ProductReview>;
}

export function createProductsService(transport: Transport, _config: { apiKey: string }): ProductsService {
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
        product: {
          sku: data.sku,
          name: data.name,
          description: data.description,
          product_type: data.productType,
          price: data.price,
          cost: data.cost,
          image_url: data.imageUrl,
          content_url: data.contentUrl,
          discount: data.discount,
          tax: data.tax,
          fees: data.fees,
          fees_value: data.feesValue,
          vendor_discount: data.vendorDiscount,
          vendor_discount_value: data.vendorDiscountValue,
          vendor_price: data.vendorPrice,
          open_price: data.openPrice,
          open_stock: data.openStock,
          qcode: data.qcode,
          product_id: data.productId,
          category_unique_id: data.categoryUniqueId,
          product_unique_id: data.productUniqueId,
          status: data.status,
          meta_title: data.metaTitle,
          meta_description: data.metaDescription,
          meta_keywords: data.metaKeywords,
          slug: data.slug,
          enforce_stock: data.enforceStock,
          allow_proximity: data.allowProximity,
          stock: data.stock,
          stock_unit: data.stockUnit,
          source: data.source,
          source_alias: data.sourceAlias,
          source_id: data.sourceId,
          source_type: data.sourceType,
          show_in: data.showIn,
        },
      });
      return decodeOne(response, productMapper);
    },

    async update(uniqueId: string, data: UpdateProductRequest): Promise<Product> {
      const response = await transport.put<unknown>(`/products/${uniqueId}`, {
        product: {
          name: data.name,
          description: data.description,
          product_type: data.productType,
          sku: data.sku,
          price: data.price,
          cost: data.cost,
          discount: data.discount,
          tax: data.tax,
          fees: data.fees,
          fees_value: data.feesValue,
          image_url: data.imageUrl,
          content_url: data.contentUrl,
          vendor_discount: data.vendorDiscount,
          vendor_discount_value: data.vendorDiscountValue,
          vendor_price: data.vendorPrice,
          open_price: data.openPrice,
          open_stock: data.openStock,
          qcode: data.qcode,
          product_id: data.productId,
          category_unique_id: data.categoryUniqueId,
          product_unique_id: data.productUniqueId,
          status: data.status,
          meta_title: data.metaTitle,
          meta_description: data.metaDescription,
          meta_keywords: data.metaKeywords,
          slug: data.slug,
          enforce_stock: data.enforceStock,
          allow_proximity: data.allowProximity,
          stock: data.stock,
          stock_unit: data.stockUnit,
          source: data.source,
          source_alias: data.sourceAlias,
          source_id: data.sourceId,
          source_type: data.sourceType,
          show_in: data.showIn,
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

      const response = await transport.post<unknown>('/products/search', { search: { search_by: query } }, { params: queryParams });
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
        variation: {
          product_unique_id: data.productUniqueId,
          sku: data.sku,
          name: data.name,
          size: data.size,
          color: data.color,
          extra_variation: data.extraVariation,
          price: data.price,
          image_url: data.imageUrl,
          description: data.description,
          content_url: data.contentUrl,
          cost: data.cost,
          discount: data.discount,
          tax: data.tax,
          fees: data.fees,
          fees_value: data.feesValue,
          vendor_discount: data.vendorDiscount,
          vendor_discount_value: data.vendorDiscountValue,
          vendor_price: data.vendorPrice,
          open_price: data.openPrice,
          open_stock: data.openStock,
          qcode: data.qcode,
          product_id: data.productId,
          category_unique_id: data.categoryUniqueId,
          status: data.status,
          meta_title: data.metaTitle,
          meta_description: data.metaDescription,
          meta_keywords: data.metaKeywords,
          slug: data.slug,
          enforce_stock: data.enforceStock,
          allow_proximity: data.allowProximity,
          product_type: data.productType,
          stock: data.stock,
          stock_unit: data.stockUnit,
          source: data.source,
          source_alias: data.sourceAlias,
          source_id: data.sourceId,
          source_type: data.sourceType,
        },
      });
      return decodeOne(response, productVariationMapper);
    },

    async updateVariation(uniqueId: string, data: UpdateVariationRequest): Promise<ProductVariation> {
      const response = await transport.put<unknown>(`/product_variations/${uniqueId}`, {
        variation: {
          name: data.name,
          size: data.size,
          color: data.color,
          extra_variation: data.extraVariation,
          price: data.price,
          image_url: data.imageUrl,
          sku: data.sku,
          description: data.description,
          content_url: data.contentUrl,
          cost: data.cost,
          discount: data.discount,
          tax: data.tax,
          fees: data.fees,
          fees_value: data.feesValue,
          vendor_discount: data.vendorDiscount,
          vendor_discount_value: data.vendorDiscountValue,
          vendor_price: data.vendorPrice,
          open_price: data.openPrice,
          open_stock: data.openStock,
          qcode: data.qcode,
          product_id: data.productId,
          category_unique_id: data.categoryUniqueId,
          product_unique_id: data.productUniqueId,
          status: data.status,
          meta_title: data.metaTitle,
          meta_description: data.metaDescription,
          meta_keywords: data.metaKeywords,
          slug: data.slug,
          enforce_stock: data.enforceStock,
          allow_proximity: data.allowProximity,
          product_type: data.productType,
          stock: data.stock,
          stock_unit: data.stockUnit,
          source: data.source,
          source_alias: data.sourceAlias,
          source_id: data.sourceId,
          source_type: data.sourceType,
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
        image: {
          url: imageUrl,
          is_main_image: isPrimary,
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
        stock: {
          vendor_unique_id: vendorUniqueId,
          warehouse_unique_id: warehouseUniqueId,
          available: quantity,
        },
      });
      return decodeOne(response, productStockMapper);
    },

    // Reviews
    async listReviews(productUniqueId: string): Promise<PageResult<ProductReview>> {
      const response = await transport.get<unknown>(`/products/${productUniqueId}/reviews`);
      return decodePageResult(response, productReviewMapper);
    },

    async addReview(productUniqueId: string, rating: number, comment?: string): Promise<ProductReview> {
      const response = await transport.post<unknown>(`/products/${productUniqueId}/reviews`, {
        review: {
          rating,
          comment,
        },
      });
      return decodeOne(response, productReviewMapper);
    },
  };
}
