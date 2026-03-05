import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Product, ProductVariation, ProductImage, ProductStock, ProductReview } from '../types/product.js';
import { parseString, parseDate, parseBoolean, parseNumber, parseOptionalNumber, parseStatus, parseStringArray } from './utils.js';

export const productMapper: ResourceMapper<Product> = {
  type: 'Product',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) ?? '',
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
    uniqueId: parseString(resource.attributes['unique_id']) ?? '',
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
    uniqueId: parseString(resource.attributes['unique_id']) ?? '',
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    productUniqueId: parseString(resource.attributes['product_unique_id']) || '',
    name: parseString(resource.attributes['name']),
    url: parseString(resource.attributes['url']),
    imageUrl: parseString(resource.attributes['image_url']),
    thumbnail: parseString(resource.attributes['thumbnail']),
    thumbnailUrl: parseString(resource.attributes['thumbnail_url']),
    fileType: parseString(resource.attributes['file_type']),
    fileSize: parseOptionalNumber(resource.attributes['file_size']),
    description: parseString(resource.attributes['description']),
    originalName: parseString(resource.attributes['original_name']),
    originalFile: parseString(resource.attributes['original_file']),
    isPublic: parseBoolean(resource.attributes['is_public']),
    isMainImage: parseBoolean(resource.attributes['is_main_image']),
    aiEnabled: parseBoolean(resource.attributes['ai_enabled']),
    rawContent: parseString(resource.attributes['raw_content']),
    content: parseString(resource.attributes['content']),
    structuredContent: resource.attributes['structured_content'] as Record<string, unknown> | undefined,
    fileStructure: resource.attributes['file_structure'] as Record<string, unknown> | undefined,
    metadata: resource.attributes['metadata'] as Record<string, unknown> | undefined,
    schemaModel: parseString(resource.attributes['schema_model']),
    vectorDb: parseString(resource.attributes['vector_db']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
  }),
};

export const productStockMapper: ResourceMapper<ProductStock> = {
  type: 'ProductStock',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) ?? '',
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    productUniqueId: parseString(resource.attributes['product_unique_id']) || '',
    productVariationUniqueId: parseString(resource.attributes['product_variation_unique_id']),
    vendorUniqueId: parseString(resource.attributes['vendor_unique_id']) || '',
    warehouseUniqueId: parseString(resource.attributes['warehouse_unique_id']) || '',
    available: parseNumber(resource.attributes['available']),
    reserved: parseOptionalNumber(resource.attributes['reserved']),
    enforceAvailability: parseBoolean(resource.attributes['enforce_availability']),
    stockUnit: parseString(resource.attributes['stock_unit']),
    priority: parseOptionalNumber(resource.attributes['priority']),
    onTransaction: parseOptionalNumber(resource.attributes['on_transaction']),
    onTransit: parseOptionalNumber(resource.attributes['on_transit']),
    prime: parseBoolean(resource.attributes['prime']),
    source: parseString(resource.attributes['source']),
    sourceAlias: parseString(resource.attributes['source_alias']),
    sourceId: parseString(resource.attributes['source_id']),
    sourceType: parseString(resource.attributes['source_type']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
  }),
};

export const productReviewMapper: ResourceMapper<ProductReview> = {
  type: 'ProductReview',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) ?? '',
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    productUniqueId: parseString(resource.attributes['product_unique_id']) || '',
    userUniqueId: parseString(resource.attributes['user_unique_id']) || '',
    userName: parseString(resource.attributes['user_name']),
    rating: parseNumber(resource.attributes['rating']),
    comment: parseString(resource.attributes['comment']),
    isVerifiedPurchase: parseBoolean(resource.attributes['is_verified_purchase']),
    helpfulCount: parseOptionalNumber(resource.attributes['helpful_count']),
    moderationNotes: parseString(resource.attributes['moderation_notes']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
  }),
};
