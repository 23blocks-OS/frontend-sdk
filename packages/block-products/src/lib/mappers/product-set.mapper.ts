import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { ProductSet } from '../types/product-set';
import { parseString, parseDate, parseStatus, parseOptionalNumber, parseBoolean } from './utils';

export const productSetMapper: ResourceMapper<ProductSet> = {
  type: 'product_set',
  map: (resource) => ({
    uniqueId: resource.id,
    name: parseString(resource.attributes['name']) ?? '',
    description: parseString(resource.attributes['description']),
    sku: parseString(resource.attributes['sku']),
    price: parseOptionalNumber(resource.attributes['price']),
    discountPrice: parseOptionalNumber(resource.attributes['discount_price']),
    imageUrl: parseString(resource.attributes['image_url']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    productCount: parseOptionalNumber(resource.attributes['product_count']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
