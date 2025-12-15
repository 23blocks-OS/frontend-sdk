import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

/**
 * Media type (TV, Radio, Digital, etc.)
 */
export interface Media extends IdentityCore {
  name: string;
  code?: string;
  description?: string;
  mediumType?: string;
  mediumLink?: string;
  status: EntityStatus;
  enabled?: string;
}

export interface CreateMediaRequest {
  name: string;
  code?: string;
  description?: string;
  mediumType?: string;
  mediumLink?: string;
}

export interface UpdateMediaRequest {
  name?: string;
  code?: string;
  description?: string;
  mediumType?: string;
  mediumLink?: string;
  status?: EntityStatus;
  enabled?: string;
}

export interface ListMediaParams {
  page?: number;
  perPage?: number;
  mediumType?: string;
  status?: EntityStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
