import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Product, ProductVariation, ProductImage, ProductStock, ProductReview } from '../types/product';
import { parseString, parseDate, parseBoolean, parseNumber, parseOptionalNumber, parseStatus, parseStringArray } from './utils';

export const productMapper: ResourceMapper<Product> = {
  type: 'Product',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    sku: parseString(resource.attributes['sku']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    productType: parseString(resource.attributes['product_type']),
    slug: parseString(resource.attributes['slug']),

    // Pricing
    price: parseOptionalNumber(resource.attributes['price']),
    cost: parseOptionalNumber(resource.attributes['cost']),
    discount: parseOptionalNumber(resource.attributes['discount']),
    tax: parseOptionalNumber(resource.attributes['tax']),
    taxValue: parseOptionalNumber(resource.attributes['tax_value']),
    fees: parseOptionalNumber(resource.attributes['fees']),
    feesValue: parseOptionalNumber(resource.attributes['fees_value']),
    priceWithFees: parseOptionalNumber(resource.attributes['price_with_fees']),
    priceWithTaxes: parseOptionalNumber(resource.attributes['price_with_taxes']),
    totalPrice: parseOptionalNumber(resource.attributes['total_price']),
    vendorDiscount: parseOptionalNumber(resource.attributes['vendor_discount']),
    vendorDiscountValue: parseOptionalNumber(resource.attributes['vendor_discount_value']),
    vendorPrice: parseOptionalNumber(resource.attributes['vendor_price']),

    // Media
    imageUrl: parseString(resource.attributes['image_url']),
    contentUrl: parseString(resource.attributes['content_url']),

    // Business Logic
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    openPrice: parseBoolean(resource.attributes['open_price']),
    openStock: parseBoolean(resource.attributes['open_stock']),
    enforceStock: parseBoolean(resource.attributes['enforce_stock']),
    allowProximity: parseBoolean(resource.attributes['allow_proximity']),

    // SEO
    metaTitle: parseString(resource.attributes['meta_title']),
    metaDescription: parseString(resource.attributes['meta_description']),
    metaKeywords: parseString(resource.attributes['meta_keywords']),

    // Brand
    brandUniqueId: parseString(resource.attributes['brand_unique_id']),
    brandCode: parseString(resource.attributes['brand_code']),
    brandName: parseString(resource.attributes['brand_name']),
    brandImageUrl: parseString(resource.attributes['brand_image_url']),

    // Source
    source: parseString(resource.attributes['source']),
    sourceAlias: parseString(resource.attributes['source_alias']),
    sourceId: parseString(resource.attributes['source_id']),
    sourceType: parseString(resource.attributes['source_type']),

    // Extra
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    tags: parseStringArray(resource.attributes['tags']),
    qcode: parseString(resource.attributes['qcode']),
    showIn: parseString(resource.attributes['show_in']),
  }),
};

export const productVariationMapper: ResourceMapper<ProductVariation> = {
  type: 'Variation',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    sku: parseString(resource.attributes['sku']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    productSku: parseString(resource.attributes['product_sku']) || '',
    productUniqueId: parseString(resource.attributes['product_unique_id']) || '',
    productType: parseString(resource.attributes['product_type']),

    // Variation attributes
    size: parseString(resource.attributes['size']),
    color: parseString(resource.attributes['color']),
    extraVariation: parseString(resource.attributes['extra_variation']),

    // Pricing
    price: parseOptionalNumber(resource.attributes['price']),
    cost: parseOptionalNumber(resource.attributes['cost']),
    discount: parseOptionalNumber(resource.attributes['discount']),
    tax: parseOptionalNumber(resource.attributes['tax']),
    taxValue: parseOptionalNumber(resource.attributes['tax_value']),
    fees: parseOptionalNumber(resource.attributes['fees']),
    feesValue: parseOptionalNumber(resource.attributes['fees_value']),
    priceWithFees: parseOptionalNumber(resource.attributes['price_with_fees']),
    priceWithTaxes: parseOptionalNumber(resource.attributes['price_with_taxes']),
    totalPrice: parseOptionalNumber(resource.attributes['total_price']),
    vendorDiscount: parseOptionalNumber(resource.attributes['vendor_discount']),
    vendorDiscountValue: parseOptionalNumber(resource.attributes['vendor_discount_value']),
    vendorPrice: parseOptionalNumber(resource.attributes['vendor_price']),

    // Media
    imageUrl: parseString(resource.attributes['image_url']),
    contentUrl: parseString(resource.attributes['content_url']),

    // Business Logic
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    openPrice: parseBoolean(resource.attributes['open_price']),
    openStock: parseBoolean(resource.attributes['open_stock']),
    enforceStock: parseBoolean(resource.attributes['enforce_stock']),
    allowProximity: parseBoolean(resource.attributes['allow_proximity']),

    // Brand
    brandUniqueId: parseString(resource.attributes['brand_unique_id']),
    brandCode: parseString(resource.attributes['brand_code']),
    brandName: parseString(resource.attributes['brand_name']),
    brandImageUrl: parseString(resource.attributes['brand_image_url']),

    // SEO
    metaTitle: parseString(resource.attributes['meta_title']),
    metaDescription: parseString(resource.attributes['meta_description']),
    metaKeywords: parseString(resource.attributes['meta_keywords']),

    // Source
    source: parseString(resource.attributes['source']),
    sourceAlias: parseString(resource.attributes['source_alias']),
    sourceId: parseString(resource.attributes['source_id']),
    sourceType: parseString(resource.attributes['source_type']),

    // Extra
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    qcode: parseString(resource.attributes['qcode']),
  }),
};

export const productImageMapper: ResourceMapper<ProductImage> = {
  type: 'ProductImage',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    productUniqueId: parseString(resource.attributes['product_unique_id']) || '',
    imageUrl: parseString(resource.attributes['image_url']) || '',
    thumbnailUrl: parseString(resource.attributes['thumbnail_url']),
    displayOrder: parseOptionalNumber(resource.attributes['display_order']),
    isPrimary: parseBoolean(resource.attributes['is_primary']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
  }),
};

export const productStockMapper: ResourceMapper<ProductStock> = {
  type: 'ProductStock',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    productUniqueId: parseString(resource.attributes['product_unique_id']) || '',
    productVariationUniqueId: parseString(resource.attributes['product_variation_unique_id']),
    vendorUniqueId: parseString(resource.attributes['vendor_unique_id']) || '',
    warehouseUniqueId: parseString(resource.attributes['warehouse_unique_id']) || '',
    quantity: parseNumber(resource.attributes['quantity']),
    reservedQuantity: parseOptionalNumber(resource.attributes['reserved_quantity']),
    availableQuantity: parseOptionalNumber(resource.attributes['available_quantity']),
    minQuantity: parseOptionalNumber(resource.attributes['min_quantity']),
    maxQuantity: parseOptionalNumber(resource.attributes['max_quantity']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
  }),
};

export const productReviewMapper: ResourceMapper<ProductReview> = {
  type: 'ProductReview',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    productUniqueId: parseString(resource.attributes['product_unique_id']) || '',
    userUniqueId: parseString(resource.attributes['user_unique_id']) || '',
    userName: parseString(resource.attributes['user_name']),
    rating: parseNumber(resource.attributes['rating']),
    title: parseString(resource.attributes['title']),
    content: parseString(resource.attributes['content']),
    isVerifiedPurchase: parseBoolean(resource.attributes['is_verified_purchase']),
    helpfulCount: parseOptionalNumber(resource.attributes['helpful_count']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
  }),
};
