import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface ProductPromotion extends IdentityCore {
  productUniqueId: string;
  name: string;
  description?: string;
  promotionType: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate?: Date;
  endDate?: Date;
  minQuantity?: number;
  maxQuantity?: number;
  isStackable: boolean;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface CreateProductPromotionRequest {
  name: string;
  description?: string;
  promotionType: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDate?: string | Date;
  endDate?: string | Date;
  minQuantity?: number;
  maxQuantity?: number;
  isStackable?: boolean;
  payload?: Record<string, unknown>;
}

export interface UpdateProductPromotionRequest {
  name?: string;
  description?: string;
  promotionType?: string;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  startDate?: string | Date;
  endDate?: string | Date;
  minQuantity?: number;
  maxQuantity?: number;
  isStackable?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}
