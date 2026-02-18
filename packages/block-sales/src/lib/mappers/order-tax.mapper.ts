import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { OrderTax } from '../types/order-tax.js';
import { parseString, parseDate, parseNumber } from './utils.js';

export const orderTaxMapper: ResourceMapper<OrderTax> = {
  type: 'OrderTax',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || '',
    orderUniqueId: parseString(resource.attributes['order_unique_id']) || '',
    taxUniqueId: parseString(resource.attributes['tax_unique_id']),
    name: parseString(resource.attributes['name']),
    description: parseString(resource.attributes['description']),
    level: parseString(resource.attributes['level']),
    taxValue: parseNumber(resource.attributes['tax_value']) || undefined,
    tax: parseNumber(resource.attributes['tax']) || undefined,
    displayOrder: parseNumber(resource.attributes['display_order']) || undefined,
    status: parseString(resource.attributes['status']),
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),
  }),
};
