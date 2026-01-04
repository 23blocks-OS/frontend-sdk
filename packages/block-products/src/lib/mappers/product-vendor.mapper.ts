import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { ProductVendor } from '../types/product-vendor';
import { parseString, parseDate, parseBoolean, parseStatus, parseNumber } from './utils';

export const productVendorMapper: ResourceMapper<ProductVendor> = {
  type: 'product_vendor',
  map: (resource) => ({
    uniqueId: resource.id,
    createdAt: parseDate(resource.attributes?.['created_at']) ?? new Date(),
    updatedAt: parseDate(resource.attributes?.['updated_at']) ?? new Date(),
    productUniqueId: parseString(resource.attributes?.['product_unique_id']) ?? '',
    vendorUniqueId: parseString(resource.attributes?.['vendor_unique_id']) ?? '',
    vendorName: parseString(resource.attributes?.['vendor_name']) ?? '',
    vendorEmail: parseString(resource.attributes?.['vendor_email']),
    vendorPhone: parseString(resource.attributes?.['vendor_phone']),
    vendorImageUrl: parseString(resource.attributes?.['vendor_image_url']),
    price: resource.attributes?.['price'] as number | undefined,
    currency: parseString(resource.attributes?.['currency']),
    stockQuantity: parseNumber(resource.attributes?.['stock_quantity']),
    leadTime: resource.attributes?.['lead_time'] as number | undefined,
    minOrderQuantity: resource.attributes?.['min_order_quantity'] as number | undefined,
    isPrimary: parseBoolean(resource.attributes?.['is_primary']),
    isAvailable: parseBoolean(resource.attributes?.['is_available']),
    status: parseStatus(resource.attributes?.['status']),
    enabled: parseBoolean(resource.attributes?.['enabled']),
    payload: resource.attributes?.['payload'] as Record<string, unknown> | undefined,
  }),
};
