import type { IdentityCore } from '@23blocks/contracts';

export interface Tag extends IdentityCore {
  name: string;
  description?: string;
  color?: string;
  payload?: Record<string, unknown>;
}

export interface CreateTagRequest {
  name: string;
  description?: string;
  color?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateTagRequest {
  name?: string;
  description?: string;
  color?: string;
  payload?: Record<string, unknown>;
}

export interface ListTagsParams {
  page?: number;
  perPage?: number;
  search?: string;
}
