import type { EntityStatus, IdentityCore } from '@23blocks/contracts';

export interface Subject extends IdentityCore {
  courseUniqueId?: string;
  name: string;
  description?: string;
  sortOrder?: number;
  status: EntityStatus;
  payload?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateSubjectRequest {
  name: string;
  description?: string;
  sortOrder?: number;
  payload?: Record<string, unknown>;
}

export interface UpdateSubjectRequest {
  name?: string;
  description?: string;
  sortOrder?: number;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListSubjectsParams {
  page?: number;
  perPage?: number;
  status?: string;
  courseUniqueId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
