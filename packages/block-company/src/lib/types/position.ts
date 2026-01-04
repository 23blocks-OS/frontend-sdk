import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Position extends IdentityCore {
  code: string;
  name: string;
  description?: string;
  departmentUniqueId?: string;
  level?: number;
  reportsToUniqueId?: string;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface CreatePositionRequest {
  code: string;
  name: string;
  description?: string;
  departmentUniqueId?: string;
  level?: number;
  reportsToUniqueId?: string;
  payload?: Record<string, unknown>;
}

export interface UpdatePositionRequest {
  name?: string;
  description?: string;
  departmentUniqueId?: string;
  level?: number;
  reportsToUniqueId?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListPositionsParams {
  page?: number;
  perPage?: number;
  departmentUniqueId?: string;
  status?: EntityStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
