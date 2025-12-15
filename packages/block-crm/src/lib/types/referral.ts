import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Referral extends IdentityCore {
  referrerUniqueId?: string;
  referredUniqueId?: string;
  referralCode?: string;
  source?: string;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

// Request types
export interface CreateReferralRequest {
  referrerUniqueId?: string;
  referredUniqueId?: string;
  referralCode?: string;
  source?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateReferralRequest {
  referralCode?: string;
  source?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListReferralsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  referrerUniqueId?: string;
  referredUniqueId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
