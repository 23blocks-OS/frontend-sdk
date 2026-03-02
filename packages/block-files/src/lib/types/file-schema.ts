import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface FileSchema extends IdentityCore {
  code: string;
  name: string;
  description?: string;
  schemaModel?: string;
  status: EntityStatus;
  enabled: boolean;
}

export interface CreateFileSchemaRequest {
  code: string;
  name: string;
  description?: string;
  schemaModel?: string;
}

export interface UpdateFileSchemaRequest {
  name?: string;
  description?: string;
  schemaModel?: string;
}

export interface ListFileSchemasParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
