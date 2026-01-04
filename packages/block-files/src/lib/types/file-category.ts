import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface FileCategory extends IdentityCore {
  code: string;
  name: string;
  description?: string;
  parentUniqueId?: string;
  color?: string;
  icon?: string;
  sortOrder?: number;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface CreateFileCategoryRequest {
  code: string;
  name: string;
  description?: string;
  parentUniqueId?: string;
  color?: string;
  icon?: string;
  sortOrder?: number;
  payload?: Record<string, unknown>;
}

export interface UpdateFileCategoryRequest {
  name?: string;
  description?: string;
  parentUniqueId?: string;
  color?: string;
  icon?: string;
  sortOrder?: number;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListFileCategoriesParams {
  page?: number;
  perPage?: number;
  parentUniqueId?: string;
  status?: EntityStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
