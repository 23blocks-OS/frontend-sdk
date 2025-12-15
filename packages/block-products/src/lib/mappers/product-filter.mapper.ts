import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { ProductFilter } from '../types/product-filter';
import { parseString, parseDate, parseStatus, parseOptionalNumber, parseBoolean, parseStringArray } from './utils';

export const productFilterMapper: ResourceMapper<ProductFilter> = {
  type: 'product_filter',
  map: (resource) => ({
    uniqueId: resource.id,
    name: parseString(resource.attributes['name']) ?? '',
    filterKey: parseString(resource.attributes['filter_key']) ?? '',
    filterType: (parseString(resource.attributes['filter_type']) as 'select' | 'range' | 'boolean' | 'text') ?? 'select',
    options: parseStringArray(resource.attributes['options']),
    minValue: parseOptionalNumber(resource.attributes['min_value']),
    maxValue: parseOptionalNumber(resource.attributes['max_value']),
    sortOrder: parseOptionalNumber(resource.attributes['sort_order']),
    isActive: parseBoolean(resource.attributes['is_active']),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
