import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Order } from '../types/order.js';
import { parseString, parseDate, parseNumber, parseOrderStatus } from './utils.js';

export const orderMapper: ResourceMapper<Order> = {
  type: 'Order',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || '',
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    displayId: parseString(resource.attributes['display_id']),
    userUniqueId: parseString(resource.attributes['user_unique_id']) || '',
    customerUniqueId: parseString(resource.attributes['customer_unique_id']),
    status: parseOrderStatus(resource.attributes['status']),
    subtotal: parseNumber(resource.attributes['subtotal']),
    tax: parseNumber(resource.attributes['tax']),
    shipping: parseNumber(resource.attributes['shipping']),
    delivery: parseNumber(resource.attributes['delivery']) || undefined,
    discount: parseNumber(resource.attributes['discount']),
    total: parseNumber(resource.attributes['total']),
    source: parseString(resource.attributes['source']),
    sourceAlias: parseString(resource.attributes['source_alias']),
    sourceId: parseString(resource.attributes['source_id']),
    sourceType: parseString(resource.attributes['source_type']),
    code: parseString(resource.attributes['code']),
    discountValue: parseNumber(resource.attributes['discount_value']) || undefined,
    taxValue: parseNumber(resource.attributes['tax_value']) || undefined,
    fees: parseNumber(resource.attributes['fees']) || undefined,
    feesValue: parseNumber(resource.attributes['fees_value']) || undefined,
    promoCode: parseString(resource.attributes['promo_code']),
    internalNotes: parseString(resource.attributes['internal_notes']),
    cartUniqueId: parseString(resource.attributes['cart_unique_id']),
    referredBy: parseString(resource.attributes['referred_by']),
    shippingAddressUniqueId: parseString(resource.attributes['shipping_address_unique_id']),
    billingAddressUniqueId: parseString(resource.attributes['billing_address_unique_id']),
    notes: parseString(resource.attributes['notes']),
    paidAt: parseDate(resource.attributes['paid_at']),
    shippedAt: parseDate(resource.attributes['shipped_at']),
    deliveredAt: parseDate(resource.attributes['delivered_at']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
