import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Category, Brand, Vendor, Warehouse, Channel, Collection, ProductCatalog } from '../types/catalog';
import { parseString, parseDate, parseBoolean, parseOptionalNumber, parseStatus } from './utils';

export const categoryMapper: ResourceMapper<Category> = {
  type: 'Category',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    parentId: parseString(resource.attributes['parent_id']),
    parentUniqueId: parseString(resource.attributes['parent_unique_id']),

    // Display
    displayOrder: parseOptionalNumber(resource.attributes['display_order']),
    iconUrl: parseString(resource.attributes['icon_url']),
    imageUrl: parseString(resource.attributes['image_url']),
    contentUrl: parseString(resource.attributes['content_url']),
    slug: parseString(resource.attributes['slug']),

    // Business Logic
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),

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
    productCount: parseOptionalNumber(resource.attributes['product_count']),
  }),
};

export const brandMapper: ResourceMapper<Brand> = {
  type: 'Brand',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    slug: parseString(resource.attributes['slug']),

    // Media
    thumbnailUrl: parseString(resource.attributes['thumbnail_url']),
    imageUrl: parseString(resource.attributes['image_url']),
    contentUrl: parseString(resource.attributes['content_url']),
    mediaUrl: parseString(resource.attributes['media_url']),

    // Geo
    isGlobal: parseBoolean(resource.attributes['is_global']),
    countryId: parseString(resource.attributes['country_id']),
    countryName: parseString(resource.attributes['country_name']),

    // Business Logic
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),

    // SEO
    metaTitle: parseString(resource.attributes['meta_title']),
    metaDescription: parseString(resource.attributes['meta_description']),
    metaKeywords: parseString(resource.attributes['meta_keywords']),

    // Extra
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};

export const vendorMapper: ResourceMapper<Vendor> = {
  type: 'Vendor',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    email: parseString(resource.attributes['email']),
    phone: parseString(resource.attributes['phone']),
    contactName: parseString(resource.attributes['contact_name']),
    taxId: parseString(resource.attributes['tax_id']),

    // Media
    thumbnailUrl: parseString(resource.attributes['thumbnail_url']),
    imageUrl: parseString(resource.attributes['image_url']),
    contentUrl: parseString(resource.attributes['content_url']),
    mediaUrl: parseString(resource.attributes['media_url']),

    // Business Logic
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),

    // SEO
    metaTitle: parseString(resource.attributes['meta_title']),
    metaDescription: parseString(resource.attributes['meta_description']),
    metaKeywords: parseString(resource.attributes['meta_keywords']),
    slug: parseString(resource.attributes['slug']),

    // Source
    source: parseString(resource.attributes['source']),
    sourceAlias: parseString(resource.attributes['source_alias']),
    sourceId: parseString(resource.attributes['source_id']),
    sourceType: parseString(resource.attributes['source_type']),

    // Extra
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};

export const warehouseMapper: ResourceMapper<Warehouse> = {
  type: 'Warehouse',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    vendorUniqueId: parseString(resource.attributes['vendor_unique_id']) || '',

    // Location
    addressUniqueId: parseString(resource.attributes['address_unique_id']),
    locationUniqueId: parseString(resource.attributes['location_unique_id']),

    // Configuration
    isGlobal: parseBoolean(resource.attributes['is_global']),
    isMultichannel: parseBoolean(resource.attributes['is_multichannel']),
    channelUniqueId: parseString(resource.attributes['channel_unique_id']),
    channelCode: parseString(resource.attributes['channel_code']),
    channelName: parseString(resource.attributes['channel_name']),

    // Business Logic
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),

    // SEO
    metaTitle: parseString(resource.attributes['meta_title']),
    metaDescription: parseString(resource.attributes['meta_description']),
    metaKeywords: parseString(resource.attributes['meta_keywords']),
    slug: parseString(resource.attributes['slug']),

    // Source
    source: parseString(resource.attributes['source']),
    sourceAlias: parseString(resource.attributes['source_alias']),
    sourceId: parseString(resource.attributes['source_id']),
    sourceType: parseString(resource.attributes['source_type']),

    // Extra
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};

export const channelMapper: ResourceMapper<Channel> = {
  type: 'Channel',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};

export const collectionMapper: ResourceMapper<Collection> = {
  type: 'Collection',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    imageUrl: parseString(resource.attributes['image_url']),
    displayOrder: parseOptionalNumber(resource.attributes['display_order']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    productCount: parseOptionalNumber(resource.attributes['product_count']),
  }),
};

export const productCatalogMapper: ResourceMapper<ProductCatalog> = {
  type: 'ProductCatalog',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
