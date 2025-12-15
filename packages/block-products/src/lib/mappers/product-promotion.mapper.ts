import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { ProductPromotion } from '../types/product-promotion';
import { parseString, parseDate, parseStatus, parseNumber, parseOptionalNumber, parseBoolean } from './utils';

export const productPromotionMapper: ResourceMapper<ProductPromotion> = {
  type: 'product_promotion',
  map: (resource) => ({
    uniqueId: resource.id,
    productUniqueId: parseString(resource.attributes['product_unique_id']) ?? '',
    name: parseString(resource.attributes['name']) ?? '',
    description: parseString(resource.attributes['description']),
    promotionType: parseString(resource.attributes['promotion_type']) ?? '',
    discountType: (parseString(resource.attributes['discount_type']) as 'percentage' | 'fixed') ?? 'percentage',
    discountValue: parseNumber(resource.attributes['discount_value']),
    startDate: parseDate(resource.attributes['start_date']),
    endDate: parseDate(resource.attributes['end_date']),
    minQuantity: parseOptionalNumber(resource.attributes['min_quantity']),
    maxQuantity: parseOptionalNumber(resource.attributes['max_quantity']),
    isStackable: parseBoolean(resource.attributes['is_stackable']),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
