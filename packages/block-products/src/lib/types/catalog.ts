import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Category extends IdentityCore {
  code: string;
  name: string;
  description?: string;
  parentId?: string;
  parentUniqueId?: string;

  // Display
  displayOrder?: number;
  iconUrl?: string;
  imageUrl?: string;
  contentUrl?: string;
  slug?: string;

  // Business Logic
  status: EntityStatus;
  enabled: boolean;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;

  // Source tracking
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;

  // Extra
  payload?: Record<string, unknown>;

  // Nested
  children?: Category[];
  productCount?: number;
}

export interface Brand extends IdentityCore {
  code: string;
  name: string;
  slug?: string;

  // Media
  thumbnailUrl?: string;
  imageUrl?: string;
  contentUrl?: string;
  mediaUrl?: string;

  // Geo
  isGlobal?: boolean;
  countryId?: string;
  countryName?: string;

  // Business Logic
  status: EntityStatus;
  enabled: boolean;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;

  // Extra
  payload?: Record<string, unknown>;
}

export interface Vendor extends IdentityCore {
  code: string;
  name: string;
  email?: string;
  phone?: string;
  contactName?: string;
  taxId?: string;

  // Media
  thumbnailUrl?: string;
  imageUrl?: string;
  contentUrl?: string;
  mediaUrl?: string;

  // Business Logic
  status: EntityStatus;
  enabled: boolean;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  slug?: string;

  // Source tracking
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;

  // Extra
  payload?: Record<string, unknown>;
}

export interface Warehouse extends IdentityCore {
  code: string;
  name: string;
  vendorUniqueId: string;

  // Location
  addressUniqueId?: string;
  locationUniqueId?: string;

  // Configuration
  isGlobal?: boolean;
  isMultichannel?: boolean;
  channelUniqueId?: string;
  channelCode?: string;
  channelName?: string;

  // Business Logic
  status: EntityStatus;
  enabled: boolean;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  slug?: string;

  // Source tracking
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;

  // Extra
  payload?: Record<string, unknown>;
}

export interface Channel extends IdentityCore {
  code: string;
  name: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  slug?: string;
  currencyUniqueId?: string;
  currencyCode?: string;
  currencyName?: string;
  apiDescription?: string;
  apiUrl?: string;
  apiKeysDescription?: string;
  apiKeysId?: string;
  status: EntityStatus;
  enabled: boolean;
}

export interface CreateChannelRequest {
  code?: string;
  name: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  slug?: string;
  currencyUniqueId?: string;
  currencyCode?: string;
  currencyName?: string;
  apiDescription?: string;
  apiUrl?: string;
  apiKeysDescription?: string;
  apiKeysId?: string;
}

export interface UpdateChannelRequest {
  code?: string;
  name?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  slug?: string;
  currencyUniqueId?: string;
  currencyCode?: string;
  currencyName?: string;
  apiDescription?: string;
  apiUrl?: string;
  apiKeysDescription?: string;
  apiKeysId?: string;
  status?: EntityStatus;
}

export interface Collection extends IdentityCore {
  code: string;
  name: string;
  isGlobal?: boolean;
  countryId?: string;
  countryName?: string;
  currencyUniqueId?: string;
  currencyCode?: string;
  currencyName?: string;
  isMultichannel?: boolean;
  channelUniqueId?: string;
  channelCode?: string;
  channelName?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  slug?: string;
  status: EntityStatus;
  enabled: boolean;
}

export interface CreateCollectionRequest {
  code?: string;
  name: string;
  isGlobal?: boolean;
  countryId?: string;
  countryName?: string;
  currencyUniqueId?: string;
  currencyCode?: string;
  currencyName?: string;
  isMultichannel?: boolean;
  channelUniqueId?: string;
  channelCode?: string;
  channelName?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  slug?: string;
  status?: EntityStatus;
}

export interface UpdateCollectionRequest {
  code?: string;
  name?: string;
  isGlobal?: boolean;
  countryId?: string;
  countryName?: string;
  currencyUniqueId?: string;
  currencyCode?: string;
  currencyName?: string;
  isMultichannel?: boolean;
  channelUniqueId?: string;
  channelCode?: string;
  channelName?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  slug?: string;
  status?: EntityStatus;
}

export interface ProductCatalog extends IdentityCore {
  code: string;
  name: string;
  description?: string;
  contentUrl?: string;
  mediaUrl?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  itemsCounter?: number;
  isGlobal?: boolean;
  countryId?: string;
  countryName?: string;
  currencyUniqueId?: string;
  currencyCode?: string;
  currencyName?: string;
  isMultichannel?: boolean;
  channelUniqueId?: string;
  channelCode?: string;
  channelName?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  status: EntityStatus;
  enabled: boolean;
}

export interface CreateProductCatalogRequest {
  code?: string;
  name: string;
  description?: string;
  contentUrl?: string;
  mediaUrl?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  itemsCounter?: number;
  isGlobal?: boolean;
  countryId?: string;
  countryName?: string;
  currencyUniqueId?: string;
  currencyCode?: string;
  currencyName?: string;
  isMultichannel?: boolean;
  channelUniqueId?: string;
  channelCode?: string;
  channelName?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  status?: EntityStatus;
}

export interface UpdateProductCatalogRequest {
  code?: string;
  name?: string;
  description?: string;
  contentUrl?: string;
  mediaUrl?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  itemsCounter?: number;
  isGlobal?: boolean;
  countryId?: string;
  countryName?: string;
  currencyUniqueId?: string;
  currencyCode?: string;
  currencyName?: string;
  isMultichannel?: boolean;
  channelUniqueId?: string;
  channelCode?: string;
  channelName?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  status?: EntityStatus;
}

// Request types
export interface CreateCategoryRequest {
  name: string;
  description?: string;
  code?: string;
  parentId?: string;
  displayOrder?: number;
  imageUrl?: string;
  iconUrl?: string;
  contentUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  slug?: string;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  code?: string;
  parentId?: string;
  displayOrder?: number;
  imageUrl?: string;
  iconUrl?: string;
  contentUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  slug?: string;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
}

export interface CreateBrandRequest {
  name: string;
  code?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  contentUrl?: string;
  mediaUrl?: string;
  isGlobal?: boolean;
  countryId?: string;
  countryName?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  slug?: string;
}

export interface UpdateBrandRequest {
  name?: string;
  code?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  contentUrl?: string;
  mediaUrl?: string;
  isGlobal?: boolean;
  countryId?: string;
  countryName?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  slug?: string;
}

export interface CreateVendorRequest {
  name: string;
  email?: string;
  phone?: string;
  contactName?: string;
  taxId?: string;
  imageUrl?: string;
  code?: string;
  thumbnailUrl?: string;
  contentUrl?: string;
  mediaUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  slug?: string;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
}

export interface UpdateVendorRequest {
  name?: string;
  email?: string;
  phone?: string;
  contactName?: string;
  taxId?: string;
  imageUrl?: string;
  code?: string;
  thumbnailUrl?: string;
  contentUrl?: string;
  mediaUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  slug?: string;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
}

export interface CreateWarehouseRequest {
  name: string;
  vendorUniqueId: string;
  addressUniqueId?: string;
  locationUniqueId?: string;
  isGlobal?: boolean;
  code?: string;
  isMultichannel?: boolean;
  channelUniqueId?: string;
  channelCode?: string;
  channelName?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  slug?: string;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
}

export interface UpdateWarehouseRequest {
  name?: string;
  vendorUniqueId?: string;
  addressUniqueId?: string;
  locationUniqueId?: string;
  isGlobal?: boolean;
  code?: string;
  isMultichannel?: boolean;
  channelUniqueId?: string;
  channelCode?: string;
  channelName?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  slug?: string;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
}

export interface ListCategoriesParams {
  page?: number;
  perPage?: number;
  parentUniqueId?: string;
  withChildren?: boolean;
  withProducts?: boolean;
}

export interface ListVendorsParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface ListWarehousesParams {
  page?: number;
  perPage?: number;
  vendorUniqueId?: string;
}
