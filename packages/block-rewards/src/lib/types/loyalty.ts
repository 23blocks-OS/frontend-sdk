import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface Loyalty extends IdentityCore {
  userUniqueId: string;
  totalPoints: number;
  availablePoints: number;
  tier?: LoyaltyTier;
  tierExpiresAt?: Date;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

// Request types
export interface AddPointsRequest {
  userUniqueId: string;
  points: number;
  reason?: string;
  referenceId?: string;
  referenceType?: string;
}

export interface RedeemPointsRequest {
  userUniqueId: string;
  points: number;
  reason?: string;
  referenceId?: string;
  referenceType?: string;
}

export interface LoyaltyTransaction extends IdentityCore {
  loyaltyUniqueId: string;
  userUniqueId: string;
  points: number;
  type: 'earned' | 'redeemed' | 'expired' | 'adjusted';
  reason?: string;
  referenceId?: string;
  referenceType?: string;
  balanceBefore: number;
  balanceAfter: number;
  transactionDate: Date;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListTransactionsParams {
  page?: number;
  perPage?: number;
  type?: 'earned' | 'redeemed' | 'expired' | 'adjusted';
  startDate?: Date;
  endDate?: Date;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
