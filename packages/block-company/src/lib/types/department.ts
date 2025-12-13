import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Department extends IdentityCore {
  companyUniqueId: string;
  code: string;
  name: string;
  description?: string;
  parentUniqueId?: string;
  managerUniqueId?: string;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface CreateDepartmentRequest {
  companyUniqueId: string;
  code: string;
  name: string;
  description?: string;
  parentUniqueId?: string;
  managerUniqueId?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateDepartmentRequest {
  name?: string;
  description?: string;
  parentUniqueId?: string;
  managerUniqueId?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListDepartmentsParams {
  page?: number;
  perPage?: number;
  companyUniqueId?: string;
  parentUniqueId?: string;
  status?: EntityStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DepartmentHierarchy extends Department {
  children?: DepartmentHierarchy[];
}
