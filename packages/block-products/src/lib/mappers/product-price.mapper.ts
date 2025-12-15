import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { ProductPrice } from '../types/product-price';
import { parseString, parseDate, parseStatus, parseNumber, parseOptionalNumber } from './utils';

export const productPriceMapper: ResourceMapper<ProductPrice> = {
  type: 'product_price',
  map: (resource) => ({
    uniqueId: resource.id,
    productUniqueId: parseString(resource.attributes['product_unique_id']),
    variationUniqueId: parseString(resource.attributes['variation_unique_id']),
    channelUniqueId: parseString(resource.attributes['channel_unique_id']),
    priceListUniqueId: parseString(resource.attributes['price_list_unique_id']),
    price: parseNumber(resource.attributes['price']),
    compareAtPrice: parseOptionalNumber(resource.attributes['compare_at_price']),
    cost: parseOptionalNumber(resource.attributes['cost']),
    currency: parseString(resource.attributes['currency']),
    minQuantity: parseOptionalNumber(resource.attributes['min_quantity']),
    maxQuantity: parseOptionalNumber(resource.attributes['max_quantity']),
    startDate: parseDate(resource.attributes['start_date']),
    endDate: parseDate(resource.attributes['end_date']),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
