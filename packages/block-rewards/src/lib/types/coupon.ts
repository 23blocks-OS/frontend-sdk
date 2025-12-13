import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export type DiscountType = 'percentage' | 'fixed';

export interface Coupon extends IdentityCore {
  code: string;
  name: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  startDate?: Date;
  endDate?: Date;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

// Request types
export interface CreateCouponRequest {
  code: string;
  name: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  startDate?: Date;
  endDate?: Date;
  payload?: Record<string, unknown>;
}

export interface UpdateCouponRequest {
  name?: string;
  description?: string;
  discountType?: DiscountType;
  discountValue?: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  startDate?: Date;
  endDate?: Date;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListCouponsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  discountType?: DiscountType;
  search?: string;
  active?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ValidateCouponRequest {
  code: string;
  userUniqueId?: string;
  purchaseAmount?: number;
}

export interface CouponValidationResult {
  valid: boolean;
  coupon?: Coupon;
  discountAmount?: number;
  reason?: string;
}

export interface ApplyCouponRequest {
  code: string;
  userUniqueId: string;
  orderUniqueId?: string;
  cartUniqueId?: string;
  purchaseAmount: number;
}

export interface CouponApplication extends IdentityCore {
  couponUniqueId: string;
  code: string;
  userUniqueId: string;
  orderUniqueId?: string;
  cartUniqueId?: string;
  purchaseAmount: number;
  discountAmount: number;
  appliedAt: Date;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}
