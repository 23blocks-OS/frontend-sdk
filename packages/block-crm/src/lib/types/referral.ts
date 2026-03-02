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
  firstName?: string;
  middleName?: string;
  lastName?: string;
  leadEmail?: string;
  phoneNumber?: string;
  source?: string;
  sourceType?: string;
  sourceAlias?: string;
  sourceId?: string;
  webSite?: string;
  twitter?: string;
  fb?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  blog?: string;
  networkA?: string;
  networkB?: string;
  notes?: string;
  tags?: string;
  referredByType?: string;
  referredByName?: string;
  referredByUniqueId?: string;
  contactStatus?: string;
}

export interface UpdateReferralRequest {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  leadEmail?: string;
  phoneNumber?: string;
  source?: string;
  sourceType?: string;
  sourceAlias?: string;
  sourceId?: string;
  webSite?: string;
  twitter?: string;
  fb?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  blog?: string;
  networkA?: string;
  networkB?: string;
  notes?: string;
  tags?: string;
  referredByType?: string;
  referredByName?: string;
  referredByUniqueId?: string;
  contactStatus?: string;
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
