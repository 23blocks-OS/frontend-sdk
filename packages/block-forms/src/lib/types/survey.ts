import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Survey extends IdentityCore {
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
  status: EntityStatus;
  token?: string;
  startedAt?: Date;
  completedAt?: Date;
  payload?: Record<string, unknown>;
}

export type SurveyStatus = 'pending' | 'started' | 'completed' | 'expired' | 'cancelled';

export interface CreateSurveyRequest {
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
}

export interface UpdateSurveyRequest {
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
  status?: EntityStatus;
}

export interface UpdateSurveyStatusRequest {
  status: SurveyStatus;
}

export interface ListSurveysParams {
  page?: number;
  perPage?: number;
  status?: SurveyStatus | EntityStatus;
  userUniqueId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
