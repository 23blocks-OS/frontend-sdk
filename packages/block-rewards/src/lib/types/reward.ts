import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export type RewardType = 'discount' | 'product' | 'points' | 'cashback' | 'free_shipping' | 'gift' | 'other';

export interface Reward extends IdentityCore {
  code: string;
  name: string;
  description?: string;
  rewardType: RewardType;
  points: number;
  value?: number;
  imageUrl?: string;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

// Request types
export interface CreateRewardRequest {
  code: string;
  name: string;
  description?: string;
  rewardType: RewardType;
  points: number;
  value?: number;
  imageUrl?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateRewardRequest {
  name?: string;
  description?: string;
  rewardType?: RewardType;
  points?: number;
  value?: number;
  imageUrl?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListRewardsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  rewardType?: RewardType;
  minPoints?: number;
  maxPoints?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface RedeemRewardRequest {
  rewardUniqueId: string;
  userUniqueId: string;
  points?: number;
}

export interface RewardRedemption extends IdentityCore {
  rewardUniqueId: string;
  userUniqueId: string;
  points: number;
  redeemedAt: Date;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}
