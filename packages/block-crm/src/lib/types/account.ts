import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Account extends IdentityCore {
  code: string;
  name: string;
  label?: string;
  status: EntityStatus;
  enabled: boolean;
  preferredDomain?: string;
  preferredLanguage?: string;
  payload?: Record<string, unknown>;
  tags?: string[];
  createdBy?: string;
  updatedBy?: string;
}

export interface AccountDetail extends IdentityCore {
  accountUniqueId: string;
  code: string;
  name: string;
  label?: string;
  status: EntityStatus;
  enabled: boolean;
  preferredDomain?: string;
  preferredLanguage?: string;
  payload?: Record<string, unknown>;
  tags?: string[];
  createdBy?: string;
  updatedBy?: string;
}

// Request types
export interface CreateAccountRequest {
  code: string;
  name: string;
  label?: string;
  preferredDomain?: string;
  preferredLanguage?: string;
  payload?: Record<string, unknown>;
  tags?: string[];
}

export interface UpdateAccountRequest {
  name?: string;
  label?: string;
  preferredDomain?: string;
  preferredLanguage?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
  tags?: string[];
}

export interface ListAccountsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
