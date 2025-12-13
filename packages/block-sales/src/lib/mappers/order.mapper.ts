import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Order } from '../types/order';
import { parseString, parseDate, parseNumber, parseOrderStatus } from './utils';

export const orderMapper: ResourceMapper<Order> = {
  type: 'Order',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    displayId: parseString(resource.attributes['display_id']) || resource.id,
    userUniqueId: parseString(resource.attributes['user_unique_id']) || '',
    status: parseOrderStatus(resource.attributes['status']),
    subtotal: parseNumber(resource.attributes['subtotal']),
    tax: parseNumber(resource.attributes['tax']),
    shipping: parseNumber(resource.attributes['shipping']),
    discount: parseNumber(resource.attributes['discount']),
    total: parseNumber(resource.attributes['total']),
    shippingAddressUniqueId: parseString(resource.attributes['shipping_address_unique_id']),
    billingAddressUniqueId: parseString(resource.attributes['billing_address_unique_id']),
    notes: parseString(resource.attributes['notes']),
    paidAt: parseDate(resource.attributes['paid_at']),
    shippedAt: parseDate(resource.attributes['shipped_at']),
    deliveredAt: parseDate(resource.attributes['delivered_at']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
