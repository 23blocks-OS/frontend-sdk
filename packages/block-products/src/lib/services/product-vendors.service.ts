import type { Transport, PageResult } from '@23blocks/contracts';
import { decodePageResult } from '@23blocks/jsonapi-codec';
import type { ProductVendor, ListProductVendorsParams } from '../types/product-vendor.js';
import { productVendorMapper } from '../mappers/product-vendor.mapper.js';

/**
 * Product Vendors Service - Get vendors that sell a specific product
 */
export interface ProductVendorsService {
  /**
   * Get all vendors that sell a specific product.
   * @param productUniqueId - The product unique ID
   * @param params - Optional filter and pagination options including availability and primary flags
   * @returns Paginated result containing an array of ProductVendor items and page metadata
   */
  listByProduct(productUniqueId: string, params?: ListProductVendorsParams): Promise<PageResult<ProductVendor>>;

  /**
   * Get the primary vendor for a product.
   * @param productUniqueId - The product unique ID
   * @returns The primary ProductVendor, or null if no primary vendor is assigned
   * @note Internally fetches with isPrimary filter and perPage=1
   */
  getPrimaryVendor(productUniqueId: string): Promise<ProductVendor | null>;

  /**
   * Get available vendors for a product (those with stock).
   * @param productUniqueId - The product unique ID
   * @param params - Optional additional filter and pagination options
   * @returns Paginated result containing available ProductVendor items and page metadata
   * @note Internally delegates to listByProduct with isAvailable=true
   */
  getAvailableVendors(productUniqueId: string, params?: ListProductVendorsParams): Promise<PageResult<ProductVendor>>;
}

/**
 * Create the Product Vendors service
 */
export function createProductVendorsService(
  transport: Transport,
  _config: { appId: string }
): ProductVendorsService {
  return {
    async listByProduct(
      productUniqueId: string,
      params?: ListProductVendorsParams
    ): Promise<PageResult<ProductVendor>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.isAvailable !== undefined) queryParams['is_available'] = String(params.isAvailable);
      if (params?.isPrimary !== undefined) queryParams['is_primary'] = String(params.isPrimary);
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/products/${productUniqueId}/vendors`, {
        params: queryParams,
      });
      return decodePageResult(response, productVendorMapper);
    },

    async getPrimaryVendor(productUniqueId: string): Promise<ProductVendor | null> {
      const result = await this.listByProduct(productUniqueId, {
        isPrimary: true,
        perPage: 1,
      });
      return result.data.length > 0 ? result.data[0] : null;
    },

    async getAvailableVendors(
      productUniqueId: string,
      params?: ListProductVendorsParams
    ): Promise<PageResult<ProductVendor>> {
      return this.listByProduct(productUniqueId, {
        ...params,
        isAvailable: true,
      });
    },
  };
}
