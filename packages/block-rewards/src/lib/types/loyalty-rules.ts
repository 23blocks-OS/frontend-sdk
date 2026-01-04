import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

/**
 * Badge category
 */
export interface BadgeCategory extends IdentityCore {
  name: string;
  description?: string;
  displayOrder: number;
  imageUrl?: string;
  status: EntityStatus;
  enabled: boolean;
}

/**
 * Create badge category request
 */
export interface CreateBadgeCategoryRequest {
  name: string;
  description?: string;
  displayOrder?: number;
  imageUrl?: string;
}

/**
 * Money rule - earn points based on spend
 */
export interface MoneyRule extends IdentityCore {
  loyaltyUniqueId: string;
  name: string;
  description?: string;
  minAmount?: number;
  maxAmount?: number;
  pointsPerUnit: number;
  unitAmount: number;
  currency?: string;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  status: EntityStatus;
  enabled: boolean;
}

/**
 * Create money rule request
 */
export interface CreateMoneyRuleRequest {
  name: string;
  description?: string;
  minAmount?: number;
  maxAmount?: number;
  pointsPerUnit: number;
  unitAmount: number;
  currency?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Update money rule request
 */
export interface UpdateMoneyRuleRequest {
  name?: string;
  description?: string;
  minAmount?: number;
  maxAmount?: number;
  pointsPerUnit?: number;
  unitAmount?: number;
  currency?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  enabled?: boolean;
  status?: EntityStatus;
}

/**
 * Product rule - earn points for purchasing specific products
 */
export interface ProductRule extends IdentityCore {
  loyaltyUniqueId: string;
  name: string;
  description?: string;
  productUniqueId?: string;
  categoryUniqueId?: string;
  brandUniqueId?: string;
  pointsEarned: number;
  multiplier?: number;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  status: EntityStatus;
  enabled: boolean;
}

/**
 * Create product rule request
 */
export interface CreateProductRuleRequest {
  name: string;
  description?: string;
  productUniqueId?: string;
  categoryUniqueId?: string;
  brandUniqueId?: string;
  pointsEarned: number;
  multiplier?: number;
  startDate?: string;
  endDate?: string;
}

/**
 * Update product rule request
 */
export interface UpdateProductRuleRequest {
  name?: string;
  description?: string;
  productUniqueId?: string;
  categoryUniqueId?: string;
  brandUniqueId?: string;
  pointsEarned?: number;
  multiplier?: number;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  enabled?: boolean;
  status?: EntityStatus;
}

/**
 * Event rule - earn points for actions/events
 */
export interface EventRule extends IdentityCore {
  loyaltyUniqueId: string;
  name: string;
  description?: string;
  eventType: string;
  pointsEarned: number;
  maxOccurrences?: number;
  cooldownPeriod?: number;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  status: EntityStatus;
  enabled: boolean;
}

/**
 * Create event rule request
 */
export interface CreateEventRuleRequest {
  name: string;
  description?: string;
  eventType: string;
  pointsEarned: number;
  maxOccurrences?: number;
  cooldownPeriod?: number;
  startDate?: string;
  endDate?: string;
}

/**
 * Update event rule request
 */
export interface UpdateEventRuleRequest {
  name?: string;
  description?: string;
  eventType?: string;
  pointsEarned?: number;
  maxOccurrences?: number;
  cooldownPeriod?: number;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  enabled?: boolean;
  status?: EntityStatus;
}
