import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Product extends IdentityCore {
  sku: string;
  name: string;
  description?: string;
  productType?: string;
  slug?: string;

  // Pricing
  price?: number;
  cost?: number;
  discount?: number;
  tax?: number;
  taxValue?: number;
  fees?: number;
  feesValue?: number;
  priceWithFees?: number;
  priceWithTaxes?: number;
  totalPrice?: number;
  vendorDiscount?: number;
  vendorDiscountValue?: number;
  vendorPrice?: number;

  // Media
  imageUrl?: string;
  contentUrl?: string;

  // Business Logic
  status: EntityStatus;
  enabled: boolean;
  openPrice?: boolean;
  openStock?: boolean;
  enforceStock?: boolean;
  allowProximity?: boolean;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;

  // Brand (denormalized)
  brandUniqueId?: string;
  brandCode?: string;
  brandName?: string;
  brandImageUrl?: string;

  // Source tracking
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;

  // Extra data
  payload?: Record<string, unknown>;
  tags?: string[];
  qcode?: string;
  showIn?: string;
}

export interface ProductVariation extends IdentityCore {
  sku: string;
  name: string;
  description?: string;
  productSku: string;
  productUniqueId: string;
  productType?: string;

  // Variation attributes
  size?: string;
  color?: string;
  extraVariation?: string;

  // Pricing (same as Product)
  price?: number;
  cost?: number;
  discount?: number;
  tax?: number;
  taxValue?: number;
  fees?: number;
  feesValue?: number;
  priceWithFees?: number;
  priceWithTaxes?: number;
  totalPrice?: number;
  vendorDiscount?: number;
  vendorDiscountValue?: number;
  vendorPrice?: number;

  // Media
  imageUrl?: string;
  contentUrl?: string;

  // Business Logic
  status: EntityStatus;
  enabled: boolean;
  openPrice?: boolean;
  openStock?: boolean;
  enforceStock?: boolean;
  allowProximity?: boolean;

  // Brand
  brandUniqueId?: string;
  brandCode?: string;
  brandName?: string;
  brandImageUrl?: string;

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
  qcode?: string;
}

export interface ProductImage extends IdentityCore {
  productUniqueId: string;
  imageUrl: string;
  thumbnailUrl?: string;
  displayOrder?: number;
  isPrimary?: boolean;
  status: EntityStatus;
  enabled: boolean;
}

export interface ProductStock extends IdentityCore {
  productUniqueId: string;
  productVariationUniqueId?: string;
  vendorUniqueId: string;
  warehouseUniqueId: string;
  quantity: number;
  reservedQuantity?: number;
  availableQuantity?: number;
  minQuantity?: number;
  maxQuantity?: number;
  status: EntityStatus;
  enabled: boolean;
}

export interface ProductReview extends IdentityCore {
  productUniqueId: string;
  userUniqueId: string;
  userName?: string;
  rating: number;
  title?: string;
  content?: string;
  isVerifiedPurchase?: boolean;
  helpfulCount?: number;
  status: EntityStatus;
  enabled: boolean;
}

// Request types
export interface CreateProductRequest {
  sku: string;
  name: string;
  description?: string;
  productType?: string;
  price?: number;
  cost?: number;
  imageUrl?: string;
  brandUniqueId?: string;
  categoryUniqueIds?: string[];
  payload?: Record<string, unknown>;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  productType?: string;
  price?: number;
  cost?: number;
  discount?: number;
  tax?: number;
  fees?: number;
  imageUrl?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListProductsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  categoryUniqueId?: string;
  brandUniqueId?: string;
  vendorUniqueId?: string;
  search?: string;
  withStock?: boolean;
  withPrices?: boolean;
  withCategories?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateVariationRequest {
  productUniqueId: string;
  sku: string;
  name: string;
  size?: string;
  color?: string;
  extraVariation?: string;
  price?: number;
  imageUrl?: string;
}

export interface UpdateVariationRequest {
  name?: string;
  size?: string;
  color?: string;
  extraVariation?: string;
  price?: number;
  imageUrl?: string;
  enabled?: boolean;
  status?: EntityStatus;
}
