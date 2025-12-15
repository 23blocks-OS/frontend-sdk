import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Survey extends IdentityCore {
  formUniqueId: string;
  userUniqueId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  data: Record<string, unknown>;
  status: EntityStatus;
  token?: string;
  startedAt?: Date;
  completedAt?: Date;
  payload?: Record<string, unknown>;
}

export type SurveyStatus = 'pending' | 'started' | 'completed' | 'expired' | 'cancelled';

export interface CreateSurveyRequest {
  formUniqueId?: string;
  userUniqueId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  data?: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

export interface UpdateSurveyRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  data?: Record<string, unknown>;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
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
