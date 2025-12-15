import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface ProductSet extends IdentityCore {
  name: string;
  description?: string;
  sku?: string;
  price?: number;
  discountPrice?: number;
  imageUrl?: string;
  status: EntityStatus;
  enabled: boolean;
  productCount?: number;
  payload?: Record<string, unknown>;
}

export interface CreateProductSetRequest {
  name: string;
  description?: string;
  sku?: string;
  price?: number;
  discountPrice?: number;
  imageUrl?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateProductSetRequest {
  name?: string;
  description?: string;
  sku?: string;
  price?: number;
  discountPrice?: number;
  imageUrl?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListProductSetsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
