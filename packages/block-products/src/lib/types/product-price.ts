import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface ProductPrice extends IdentityCore {
  productUniqueId?: string;
  variationUniqueId?: string;
  channelUniqueId?: string;
  priceListUniqueId?: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  currency?: string;
  minQuantity?: number;
  maxQuantity?: number;
  startDate?: Date;
  endDate?: Date;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface CreateProductPriceRequest {
  channelUniqueId?: string;
  priceListUniqueId?: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  currency?: string;
  minQuantity?: number;
  maxQuantity?: number;
  startDate?: string | Date;
  endDate?: string | Date;
  payload?: Record<string, unknown>;
}

export interface UpdateProductPriceRequest {
  price?: number;
  compareAtPrice?: number;
  cost?: number;
  currency?: string;
  minQuantity?: number;
  maxQuantity?: number;
  startDate?: string | Date;
  endDate?: string | Date;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}
