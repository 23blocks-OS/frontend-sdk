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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RegisterIdentityRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatarUrl?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateIdentityRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatarUrl?: string;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListIdentitiesParams {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
