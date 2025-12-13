import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { OrderDetail } from '../types/order-detail';
import { parseString, parseDate, parseNumber, parseStatus } from './utils';

export const orderDetailMapper: ResourceMapper<OrderDetail> = {
  type: 'OrderDetail',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    orderUniqueId: parseString(resource.attributes['order_unique_id']) || '',
    productUniqueId: parseString(resource.attributes['product_unique_id']) || '',
    productVariationUniqueId: parseString(resource.attributes['product_variation_unique_id']),
    sku: parseString(resource.attributes['sku']) || '',
    name: parseString(resource.attributes['name']) || '',
    quantity: parseNumber(resource.attributes['quantity']),
    unitPrice: parseNumber(resource.attributes['unit_price']),
    discount: parseNumber(resource.attributes['discount']),
    tax: parseNumber(resource.attributes['tax']),
    total: parseNumber(resource.attributes['total']),
    status: parseStatus(resource.attributes['status']),
    vendorUniqueId: parseString(resource.attributes['vendor_unique_id']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
