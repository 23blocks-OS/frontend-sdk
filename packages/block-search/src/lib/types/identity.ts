import type { EntityStatus, IdentityCore } from '@23blocks/contracts';

export interface SearchIdentity extends IdentityCore {
  userUniqueId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatarUrl?: string;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface RegisterIdentityRequest {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  roleId?: string;
  roleName?: string;
  roleUniqueId?: string;
  companyId?: string;
  timeZone?: string;
  preferredLanguage?: string;
  maxFileSize?: number;
  maxStorage?: number;
}

export interface UpdateIdentityRequest {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  roleId?: string;
  roleName?: string;
  roleUniqueId?: string;
  companyId?: string;
  timeZone?: string;
  preferredLanguage?: string;
  maxFileSize?: number;
  maxStorage?: number;
}

export interface ListIdentitiesParams {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
