import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface EmployeeAssignment extends IdentityCore {
  userUniqueId: string;
  positionUniqueId: string;
  departmentUniqueId?: string;
  teamUniqueId?: string;
  startDate?: Date;
  endDate?: Date;
  isPrimary: boolean;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface CreateEmployeeAssignmentRequest {
  userUniqueId: string;
  positionUniqueId: string;
  departmentUniqueId?: string;
  teamUniqueId?: string;
  startDate?: string;
  endDate?: string;
  isPrimary?: boolean;
  payload?: Record<string, unknown>;
}

export interface UpdateEmployeeAssignmentRequest {
  positionUniqueId?: string;
  departmentUniqueId?: string;
  teamUniqueId?: string;
  startDate?: string;
  endDate?: string;
  isPrimary?: boolean;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListEmployeeAssignmentsParams {
  page?: number;
  perPage?: number;
  userUniqueId?: string;
  positionUniqueId?: string;
  departmentUniqueId?: string;
  teamUniqueId?: string;
  status?: EntityStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
