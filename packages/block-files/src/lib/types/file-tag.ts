import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface FileTag extends IdentityCore {
  code: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface CreateFileTagRequest {
  code: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateFileTagRequest {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListFileTagsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FileTagAssignment {
  fileUniqueId: string;
  tagUniqueId: string;
}
