import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { VendorPayment } from '../types/vendor-payment.js';
import { parseDate, parseNumber } from './utils.js';

export const vendorPaymentMapper: ResourceMapper<VendorPayment> = {
  type: 'VendorPayment',
  map: (resource) => ({
    id: resource.id,
    uniqueId: resource.attributes['unique_id'] as string,
    orderUniqueId: resource.attributes['order_unique_id'] as string,
    detailUniqueId: resource.attributes['detail_unique_id'] as string,
    vendorUniqueId: resource.attributes['vendor_unique_id'] as string,
    amount: parseNumber(resource.attributes['amount']),
    currency: resource.attributes['currency'] as string,
    status: resource.attributes['status'] as string,
    paidAt: parseDate(resource.attributes['paid_at']),
    reference: resource.attributes['reference'] as string | undefined,
    notes: resource.attributes['notes'] as string | undefined,
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']) ?? new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) ?? new Date(),
  }),
};
