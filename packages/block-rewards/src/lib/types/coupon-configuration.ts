import type { EntityStatus, IdentityCore } from '@23blocks/contracts';

export interface CouponConfiguration extends IdentityCore {
  name: string;
  description?: string;
  code?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount?: number;
  perUserLimit?: number;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
  status: EntityStatus;
  payload?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCouponConfigurationRequest {
  name: string;
  description?: string;
  code?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  perUserLimit?: number;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
  payload?: Record<string, unknown>;
}

export interface UpdateCouponConfigurationRequest {
  name?: string;
  description?: string;
  code?: string;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  perUserLimit?: number;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListCouponConfigurationsParams {
  page?: number;
  perPage?: number;
  status?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
