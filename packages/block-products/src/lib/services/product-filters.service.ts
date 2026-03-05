import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  ProductFilter,
  CreateProductFilterRequest,
  UpdateProductFilterRequest,
  ListProductFiltersParams,
} from '../types/product-filter.js';
import { productFilterMapper } from '../mappers/product-filter.mapper.js';

export interface ProductFiltersService {
  /**
   * List product filters with optional filtering, sorting, and pagination.
   * @param params - Filter, sort, and pagination options including status, filter type, and active state
   * @returns Paginated result containing an array of ProductFilter items and page metadata
   */
  list(params?: ListProductFiltersParams): Promise<PageResult<ProductFilter>>;

  /**
   * Get a single product filter by its unique identifier.
   * @param uniqueId - The filter unique ID
   * @returns The matching ProductFilter
   */
  get(uniqueId: string): Promise<ProductFilter>;

  /**
   * Create a new product filter.
   * @param data - Filter creation payload including name, key, type, options, and value range
   * @returns The newly created ProductFilter
   */
  create(data: CreateProductFilterRequest): Promise<ProductFilter>;

  /**
   * Update an existing product filter.
   * @param uniqueId - The filter unique ID
   * @param data - Fields to update on the filter
   * @returns The updated ProductFilter
   */
  update(uniqueId: string, data: UpdateProductFilterRequest): Promise<ProductFilter>;

  /**
   * Delete a product filter.
   * @param uniqueId - The filter unique ID
   * @returns Resolves when the filter has been deleted
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Reorder product filters by providing the desired order of filter IDs.
   * @param filterIds - Array of filter unique IDs in the desired display order
   * @returns Resolves when the reorder has been applied
   */
  reorder(filterIds: string[]): Promise<void>;
}

export function createProductFiltersService(transport: Transport, _config: { apiKey: string }): ProductFiltersService {
  return {
    async list(params?: ListProductFiltersParams): Promise<PageResult<ProductFilter>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.filterType) queryParams['filter_type'] = params.filterType;
      if (params?.isActive !== undefined) queryParams['is_active'] = String(params.isActive);
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/filters/', { params: queryParams });
      return decodePageResult(response, productFilterMapper);
    },

    async get(uniqueId: string): Promise<ProductFilter> {
      const response = await transport.get<unknown>(`/filters/${uniqueId}/`);
      return decodeOne(response, productFilterMapper);
    },

    async create(data: CreateProductFilterRequest): Promise<ProductFilter> {
      const response = await transport.post<unknown>('/filters/', {
        filter: {
          name: data.name,
          value: data.value,
          order: data.order,
          icon_url: data.iconUrl,
          image_url: data.imageUrl,
          language: data.language,
        },
      });
      return decodeOne(response, productFilterMapper);
    },

    async update(uniqueId: string, data: UpdateProductFilterRequest): Promise<ProductFilter> {
      const response = await transport.put<unknown>(`/filters/${uniqueId}`, {
        filter: {
          name: data.name,
          value: data.value,
          order: data.order,
          icon_url: data.iconUrl,
          image_url: data.imageUrl,
          language: data.language,
          status: data.status,
        },
      });
      return decodeOne(response, productFilterMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/filters/${uniqueId}`);
    },

    async reorder(filterIds: string[]): Promise<void> {
      await transport.put('/filters/reorder', {
        filter_ids: filterIds,
      });
    },
  };
}
