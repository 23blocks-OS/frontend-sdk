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
  description?: string;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface Collection extends IdentityCore {
  code: string;
  name: string;
  description?: string;
  imageUrl?: string;
  displayOrder?: number;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
  productCount?: number;
}

export interface ProductCatalog extends IdentityCore {
  code: string;
  name: string;
  description?: string;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

// Request types
export interface CreateCategoryRequest {
  name: string;
  description?: string;
  parentUniqueId?: string;
  displayOrder?: number;
  imageUrl?: string;
  iconUrl?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  parentUniqueId?: string;
  displayOrder?: number;
  imageUrl?: string;
  iconUrl?: string;
  enabled?: boolean;
  status?: EntityStatus;
}

export interface CreateBrandRequest {
  name: string;
  imageUrl?: string;
  isGlobal?: boolean;
  countryId?: string;
}

export interface UpdateBrandRequest {
  name?: string;
  imageUrl?: string;
  isGlobal?: boolean;
  countryId?: string;
  enabled?: boolean;
  status?: EntityStatus;
}

export interface CreateVendorRequest {
  name: string;
  email?: string;
  phone?: string;
  contactName?: string;
  taxId?: string;
  imageUrl?: string;
}

export interface UpdateVendorRequest {
  name?: string;
  email?: string;
  phone?: string;
  contactName?: string;
  taxId?: string;
  imageUrl?: string;
  enabled?: boolean;
  status?: EntityStatus;
}

export interface CreateWarehouseRequest {
  name: string;
  vendorUniqueId: string;
  addressUniqueId?: string;
  locationUniqueId?: string;
  isGlobal?: boolean;
}

export interface UpdateWarehouseRequest {
  name?: string;
  addressUniqueId?: string;
  locationUniqueId?: string;
  isGlobal?: boolean;
  enabled?: boolean;
  status?: EntityStatus;
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
