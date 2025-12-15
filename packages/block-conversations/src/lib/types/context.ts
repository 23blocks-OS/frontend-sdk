import type { IdentityCore } from '@23blocks/contracts';

export interface Context extends IdentityCore {
  name?: string;
  description?: string;
  contextType?: string;
  status?: string;
  metadata?: Record<string, unknown>;
  payload?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateContextRequest {
  name?: string;
  description?: string;
  contextType?: string;
  metadata?: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

export interface UpdateContextRequest {
  name?: string;
  description?: string;
  contextType?: string;
  status?: string;
  metadata?: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

export interface ListContextsParams {
  page?: number;
  perPage?: number;
  status?: string;
  contextType?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
