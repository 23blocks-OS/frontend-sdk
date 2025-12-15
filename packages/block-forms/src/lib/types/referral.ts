import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Referral extends IdentityCore {
  formUniqueId: string;
  referrerUniqueId?: string;
  referrerEmail?: string;
  referrerName?: string;
  refereeEmail: string;
  refereeName?: string;
  refereePhone?: string;
  data: Record<string, unknown>;
  status: EntityStatus;
  convertedAt?: Date;
  payload?: Record<string, unknown>;
}

export interface CreateReferralRequest {
  formUniqueId?: string;
  referrerUniqueId?: string;
  referrerEmail?: string;
  referrerName?: string;
  refereeEmail: string;
  refereeName?: string;
  refereePhone?: string;
  data?: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

export interface UpdateReferralRequest {
  refereeEmail?: string;
  refereeName?: string;
  refereePhone?: string;
  data?: Record<string, unknown>;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListReferralsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  referrerUniqueId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
