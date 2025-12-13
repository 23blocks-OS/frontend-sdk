import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Coupon, DiscountType, CouponApplication } from '../types/coupon';
import { parseString, parseDate, parseBoolean, parseNumber, parseOptionalNumber, parseStatus } from './utils';

function parseDiscountType(value: unknown): DiscountType {
  const type = parseString(value);
  if (type === 'percentage' || type === 'fixed') {
    return type;
  }
  return 'fixed';
}

export const couponMapper: ResourceMapper<Coupon> = {
  type: 'Coupon',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    discountType: parseDiscountType(resource.attributes['discount_type']),
    discountValue: parseNumber(resource.attributes['discount_value']),
    minPurchase: parseOptionalNumber(resource.attributes['min_purchase']),
    maxDiscount: parseOptionalNumber(resource.attributes['max_discount']),
    usageLimit: parseOptionalNumber(resource.attributes['usage_limit']),
    usedCount: parseNumber(resource.attributes['used_count']),
    startDate: parseDate(resource.attributes['start_date']),
    endDate: parseDate(resource.attributes['end_date']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};

export const couponApplicationMapper: ResourceMapper<CouponApplication> = {
  type: 'CouponApplication',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    couponUniqueId: parseString(resource.attributes['coupon_unique_id']) || '',
    code: parseString(resource.attributes['code']) || '',
    userUniqueId: parseString(resource.attributes['user_unique_id']) || '',
    orderUniqueId: parseString(resource.attributes['order_unique_id']),
    cartUniqueId: parseString(resource.attributes['cart_unique_id']),
    purchaseAmount: parseNumber(resource.attributes['purchase_amount']),
    discountAmount: parseNumber(resource.attributes['discount_amount']),
    appliedAt: parseDate(resource.attributes['applied_at']) || new Date(),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
