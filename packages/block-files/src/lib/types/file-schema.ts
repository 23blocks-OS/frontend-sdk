import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface FileSchema extends IdentityCore {
  code: string;
  name: string;
  description?: string;
  allowedMimeTypes?: string[];
  maxFileSize?: number;
  required?: boolean;
  multiple?: boolean;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface CreateFileSchemaRequest {
  code: string;
  name: string;
  description?: string;
  allowedMimeTypes?: string[];
  maxFileSize?: number;
  required?: boolean;
  multiple?: boolean;
  payload?: Record<string, unknown>;
}

export interface UpdateFileSchemaRequest {
  name?: string;
  description?: string;
  allowedMimeTypes?: string[];
  maxFileSize?: number;
  required?: boolean;
  multiple?: boolean;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListFileSchemasParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
