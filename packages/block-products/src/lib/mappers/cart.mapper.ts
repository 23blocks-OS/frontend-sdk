import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Cart, CartDetail } from '../types/cart';
import { parseString, parseDate, parseBoolean, parseNumber, parseOptionalNumber, parseStatus } from './utils';

export const cartMapper: ResourceMapper<Cart> = {
  type: 'Cart',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    userUniqueId: parseString(resource.attributes['user_unique_id']) || '',
    qcode: parseString(resource.attributes['qcode']),

    // Financial summary
    subtotal: parseNumber(resource.attributes['subtotal']),
    subtotalFees: parseOptionalNumber(resource.attributes['subtotal_fees']),
    discount: parseOptionalNumber(resource.attributes['discount']),
    delivery: parseOptionalNumber(resource.attributes['delivery']),
    tax: parseOptionalNumber(resource.attributes['tax']),
    fees: parseOptionalNumber(resource.attributes['fees']),
    feesValue: parseOptionalNumber(resource.attributes['fees_value']),
    total: parseNumber(resource.attributes['total']),
    totalItems: parseNumber(resource.attributes['total_items']),

    // Configuration
    notes: parseString(resource.attributes['notes']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    openPrice: parseBoolean(resource.attributes['open_price']),
    openStock: parseBoolean(resource.attributes['open_stock']),

    // Order linking
    orderUniqueId: parseString(resource.attributes['order_unique_id']),
    orderSystem: parseString(resource.attributes['order_system']),
    orderDisplayId: parseString(resource.attributes['order_display_id']),
    orderStatus: parseString(resource.attributes['order_status']),

    // Extra
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};

export const cartDetailMapper: ResourceMapper<CartDetail> = {
  type: 'CartDetail',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    cartUniqueId: parseString(resource.attributes['cart_unique_id']) || '',
    productUniqueId: parseString(resource.attributes['product_unique_id']) || '',
    productVariationUniqueId: parseString(resource.attributes['product_variation_unique_id']),
    vendorUniqueId: parseString(resource.attributes['vendor_unique_id']),
    warehouseUniqueId: parseString(resource.attributes['warehouse_unique_id']),

    // Product info
    sku: parseString(resource.attributes['sku']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    imageUrl: parseString(resource.attributes['image_url']),

    // Quantity
    quantity: parseNumber(resource.attributes['quantity']),

    // Pricing
    unitPrice: parseNumber(resource.attributes['unit_price']),
    discount: parseOptionalNumber(resource.attributes['discount']),
    tax: parseOptionalNumber(resource.attributes['tax']),
    taxValue: parseOptionalNumber(resource.attributes['tax_value']),
    fees: parseOptionalNumber(resource.attributes['fees']),
    feesValue: parseOptionalNumber(resource.attributes['fees_value']),
    subtotal: parseNumber(resource.attributes['subtotal']),
    total: parseNumber(resource.attributes['total']),

    // Status
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    orderStatus: parseString(resource.attributes['order_status']),

    // Extra
    notes: parseString(resource.attributes['notes']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
