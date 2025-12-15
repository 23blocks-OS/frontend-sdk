import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Landing extends IdentityCore {
  formUniqueId: string;
  userUniqueId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  data: Record<string, unknown>;
  status: EntityStatus;
  token?: string;
  submittedAt?: Date;
  payload?: Record<string, unknown>;
}

export interface CreateLandingRequest {
  formUniqueId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  data?: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

export interface UpdateLandingRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  data?: Record<string, unknown>;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListLandingsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
