import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Referral extends IdentityCore {
  formUniqueId: string;
  userUniqueId?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  message?: string;
  notes?: string;
  selectedOption?: string;
  formFields?: Record<string, unknown>;
  referredByType?: string;
  referredByName?: string;
  referredByUniqueId?: string;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  visitorUniqueId?: string;
  visitorType?: string;
  touchId?: string;
  touchReferenceId?: string;
  status: EntityStatus;
  convertedAt?: Date;
  payload?: Record<string, unknown>;
}

export interface CreateReferralRequest {
  formUniqueId?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  message?: string;
  notes?: string;
  selectedOption?: string;
  formFields?: Record<string, unknown>;
  referredByType?: string;
  referredByName?: string;
  referredByUniqueId?: string;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  visitorUniqueId?: string;
  visitorType?: string;
  touchId?: string;
  touchReferenceId?: string;
}

export interface UpdateReferralRequest {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  message?: string;
  notes?: string;
  selectedOption?: string;
  formFields?: Record<string, unknown>;
  referredByType?: string;
  referredByName?: string;
  referredByUniqueId?: string;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  visitorUniqueId?: string;
  visitorType?: string;
  touchId?: string;
  touchReferenceId?: string;
  status?: EntityStatus;
}

export interface ListReferralsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
