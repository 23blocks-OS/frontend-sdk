import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Category extends IdentityCore {
  name: string;
  code?: string;
  description?: string;
  parentUniqueId?: string;
  order?: number;
  color?: string;
  icon?: string;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

// Request types
export interface CreateCategoryRequest {
  name: string;
  code?: string;
  description?: string;
  parentUniqueId?: string;
  order?: number;
  color?: string;
  icon?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateCategoryRequest {
  name?: string;
  code?: string;
  description?: string;
  parentUniqueId?: string;
  order?: number;
  color?: string;
  icon?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListCategoriesParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  parentUniqueId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Account Category types
export interface AccountCategory extends IdentityCore {
  accountUniqueId: string;
  categoryUniqueId: string;
  order?: number;
  status: EntityStatus;
  enabled: boolean;
}

export interface AddAccountCategoryRequest {
  categoryUniqueId: string;
  order?: number;
}

export interface UpdateAccountCategoryRequest {
  order?: number;
  enabled?: boolean;
  status?: EntityStatus;
}
