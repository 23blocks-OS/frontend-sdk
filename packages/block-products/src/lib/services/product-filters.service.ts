import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  ProductFilter,
  CreateProductFilterRequest,
  UpdateProductFilterRequest,
  ListProductFiltersParams,
} from '../types/product-filter';
import { productFilterMapper } from '../mappers/product-filter.mapper';

export interface ProductFiltersService {
  list(params?: ListProductFiltersParams): Promise<PageResult<ProductFilter>>;
  get(uniqueId: string): Promise<ProductFilter>;
  create(data: CreateProductFilterRequest): Promise<ProductFilter>;
  update(uniqueId: string, data: UpdateProductFilterRequest): Promise<ProductFilter>;
  delete(uniqueId: string): Promise<void>;
  reorder(filterIds: string[]): Promise<void>;
}

export function createProductFiltersService(transport: Transport, _config: { appId: string }): ProductFiltersService {
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
          filter_key: data.filterKey,
          filter_type: data.filterType,
          options: data.options,
          min_value: data.minValue,
          max_value: data.maxValue,
          sort_order: data.sortOrder,
          is_active: data.isActive,
          payload: data.payload,
        },
      });
      return decodeOne(response, productFilterMapper);
    },

    async update(uniqueId: string, data: UpdateProductFilterRequest): Promise<ProductFilter> {
      const response = await transport.put<unknown>(`/filters/${uniqueId}`, {
        filter: {
          name: data.name,
          filter_key: data.filterKey,
          filter_type: data.filterType,
          options: data.options,
          min_value: data.minValue,
          max_value: data.maxValue,
          sort_order: data.sortOrder,
          is_active: data.isActive,
          status: data.status,
          payload: data.payload,
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
