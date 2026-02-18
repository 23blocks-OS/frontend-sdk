import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { VendorPayment } from '../types/vendor-payment.js';
import { parseString, parseDate, parseNumber } from './utils.js';

export const vendorPaymentMapper: ResourceMapper<VendorPayment> = {
  type: 'VendorPayment',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || '',
    vendorUniqueId: parseString(resource.attributes['vendor_unique_id']),
    vendorName: parseString(resource.attributes['vendor_name']),
    vendorEmail: parseString(resource.attributes['vendor_email']),
    vendorPhone: parseString(resource.attributes['vendor_phone']),
    vendorContact: parseString(resource.attributes['vendor_contact']),
    paymentType: parseString(resource.attributes['payment_type']),
    price: parseNumber(resource.attributes['price']) || undefined,
    discount: parseNumber(resource.attributes['discount']) || undefined,
    discountValue: parseNumber(resource.attributes['discount_value']) || undefined,
    fees: parseNumber(resource.attributes['fees']) || undefined,
    feesValue: parseNumber(resource.attributes['fees_value']) || undefined,
    tips: parseNumber(resource.attributes['tips']) || undefined,
    tipsValue: parseNumber(resource.attributes['tips_value']) || undefined,
    subtotal: parseNumber(resource.attributes['subtotal']) || undefined,
    delivery: parseNumber(resource.attributes['delivery']) || undefined,
    tax: parseNumber(resource.attributes['tax']) || undefined,
    taxValue: parseNumber(resource.attributes['tax_value']) || undefined,
    status: parseString(resource.attributes['status']),
    paidAt: parseDate(resource.attributes['paid_at']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),
  }),
};
