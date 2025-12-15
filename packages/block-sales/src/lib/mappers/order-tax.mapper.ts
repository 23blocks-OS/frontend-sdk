import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { OrderTax } from '../types/order-tax';
import { parseString, parseDate, parseNumber } from './utils';

export const orderTaxMapper: ResourceMapper<OrderTax> = {
  type: 'OrderTax',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    orderUniqueId: parseString(resource.attributes['order_unique_id']) || '',
    name: parseString(resource.attributes['name']) || '',
    rate: parseNumber(resource.attributes['rate']),
    amount: parseNumber(resource.attributes['amount']),
    type: parseString(resource.attributes['type']) || '',
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
