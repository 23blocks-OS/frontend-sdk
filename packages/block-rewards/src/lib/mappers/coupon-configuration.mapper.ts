import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { CouponConfiguration } from '../types/coupon-configuration';
import { parseString, parseDate, parseStatus, parseNumber, parseOptionalNumber, parseBoolean } from './utils';

export const couponConfigurationMapper: ResourceMapper<CouponConfiguration> = {
  type: 'coupon_configuration',
  map: (resource) => ({
    uniqueId: resource.id,
    name: parseString(resource.attributes['name']) ?? '',
    description: parseString(resource.attributes['description']),
    code: parseString(resource.attributes['code']),
    discountType: (parseString(resource.attributes['discount_type']) as 'percentage' | 'fixed') ?? 'percentage',
    discountValue: parseNumber(resource.attributes['discount_value']),
    minPurchase: parseOptionalNumber(resource.attributes['min_purchase']),
    maxDiscount: parseOptionalNumber(resource.attributes['max_discount']),
    usageLimit: parseOptionalNumber(resource.attributes['usage_limit']),
    usageCount: parseOptionalNumber(resource.attributes['usage_count']),
    perUserLimit: parseOptionalNumber(resource.attributes['per_user_limit']),
    startDate: parseDate(resource.attributes['start_date']),
    endDate: parseDate(resource.attributes['end_date']),
    isActive: parseBoolean(resource.attributes['is_active']),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
