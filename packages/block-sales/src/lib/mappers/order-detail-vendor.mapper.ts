import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { OrderDetailVendor } from '../types/vendor-payment.js';
import { parseString, parseDate } from './utils.js';

export const orderDetailVendorMapper: ResourceMapper<OrderDetailVendor> = {
  type: 'OrderDetailVendor',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || '',
    orderDetailUniqueId: parseString(resource.attributes['order_detail_unique_id']),
    vendorUniqueId: parseString(resource.attributes['vendor_unique_id']),
    vendorName: parseString(resource.attributes['vendor_name']),
    vendorEmail: parseString(resource.attributes['vendor_email']),
    vendorPhone: parseString(resource.attributes['vendor_phone']),
    vendorContact: parseString(resource.attributes['vendor_contact']),
    status: parseString(resource.attributes['status']),
    referredBy: parseString(resource.attributes['referred_by']),
    promoCode: parseString(resource.attributes['promo_code']),
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),
  }),
};
