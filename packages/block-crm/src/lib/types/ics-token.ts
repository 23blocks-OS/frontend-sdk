import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface IcsToken extends IdentityCore {
  userUniqueId: string;
  token: string;
  name?: string;
  description?: string;
  expiresAt?: Date;
  lastAccessedAt?: Date;
  accessCount: number;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

// Request types
export interface CreateIcsTokenRequest {
  name?: string;
  description?: string;
  expiresAt?: Date;
  payload?: Record<string, unknown>;
}

export interface ListIcsTokensParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
