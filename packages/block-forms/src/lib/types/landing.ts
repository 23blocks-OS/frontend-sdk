import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Landing extends IdentityCore {
  formUniqueId: string;
  userUniqueId?: string;
  email?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phoneNumber?: string;
  message?: string;
  notes?: string;
  selectedOption?: string;
  formFields?: Record<string, unknown>;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  visitorUniqueId?: string;
  visitorType?: string;
  touchId?: string;
  touchReferenceId?: string;
  preferredLanguage?: string;
  status: EntityStatus;
  token?: string;
  submittedAt?: Date;
  payload?: Record<string, unknown>;
}

export interface CreateLandingRequest {
  formUniqueId?: string;
  email?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phoneNumber?: string;
  message?: string;
  notes?: string;
  selectedOption?: string;
  formFields?: Record<string, unknown>;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  visitorUniqueId?: string;
  visitorType?: string;
  touchId?: string;
  touchReferenceId?: string;
  preferredLanguage?: string;
}

export interface UpdateLandingRequest {
  email?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phoneNumber?: string;
  message?: string;
  notes?: string;
  selectedOption?: string;
  formFields?: Record<string, unknown>;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  visitorUniqueId?: string;
  visitorType?: string;
  touchId?: string;
  touchReferenceId?: string;
  preferredLanguage?: string;
  status?: EntityStatus;
}

export interface ListLandingsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
