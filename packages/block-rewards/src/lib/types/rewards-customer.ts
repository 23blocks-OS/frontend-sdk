import type { EntityStatus, IdentityCore } from '@23blocks/contracts';

export interface RewardsCustomer extends IdentityCore {
  userUniqueId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  totalPoints?: number;
  availablePoints?: number;
  lifetimePoints?: number;
  loyaltyTierUniqueId?: string;
  loyaltyTierName?: string;
  status: EntityStatus;
  payload?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CustomerRewardExpiration {
  uniqueId: string;
  points: number;
  expiresAt: Date;
  ruleUniqueId?: string;
}

export interface CustomerRewardHistory {
  uniqueId: string;
  points: number;
  action: string;
  description?: string;
  referenceType?: string;
  referenceId?: string;
  createdAt: Date;
}

export interface ListRewardsCustomersParams {
  page?: number;
  perPage?: number;
  status?: string;
  loyaltyTierUniqueId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
