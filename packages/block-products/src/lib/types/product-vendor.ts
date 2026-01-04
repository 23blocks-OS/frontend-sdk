import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

/**
 * Product vendor - represents a vendor that sells a specific product
 */
export interface ProductVendor extends IdentityCore {
  productUniqueId: string;
  vendorUniqueId: string;
  vendorName: string;
  vendorEmail?: string;
  vendorPhone?: string;
  vendorImageUrl?: string;
  price?: number;
  currency?: string;
  stockQuantity?: number;
  leadTime?: number;
  minOrderQuantity?: number;
  isPrimary: boolean;
  isAvailable: boolean;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

/**
 * List product vendors params
 */
export interface ListProductVendorsParams {
  page?: number;
  perPage?: number;
  isAvailable?: boolean;
  isPrimary?: boolean;
  sortBy?: 'price' | 'lead_time' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}
