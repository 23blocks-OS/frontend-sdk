import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { OrderDetailVendor } from '../types/vendor-payment.js';
import { parseDate, parseNumber, parseOptionalNumber } from './utils.js';

export const orderDetailVendorMapper: ResourceMapper<OrderDetailVendor> = {
  type: 'OrderDetailVendor',
  map: (resource) => ({
    id: resource.id,
    uniqueId: resource.attributes['unique_id'] as string,
    orderDetailUniqueId: resource.attributes['order_detail_unique_id'] as string | undefined,
    sourceId: resource.attributes['source_id'] as string | undefined,
    vendorUniqueId: resource.attributes['vendor_unique_id'] as string,
    vendorName: resource.attributes['vendor_name'] as string | undefined,
    amount: parseNumber(resource.attributes['amount']),
    commission: parseOptionalNumber(resource.attributes['commission']),
    status: resource.attributes['status'] as string,
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']) ?? new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) ?? new Date(),
  }),
};
