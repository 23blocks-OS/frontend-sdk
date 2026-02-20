import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface FormSchemaVersion extends IdentityCore {
  formUniqueId: string;
  schemaUniqueId: string;
  version: number;
  formFields?: Record<string, unknown>;
  datasource?: Record<string, unknown>;
  status: EntityStatus;
  isPublished: boolean;
  publishedAt?: string;
  payload?: Record<string, unknown>;
}

export interface CreateFormSchemaVersionRequest {
  formFields?: Record<string, unknown>;
  datasource?: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

export interface UpdateFormSchemaVersionRequest {
  formFields?: Record<string, unknown>;
  datasource?: Record<string, unknown>;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListFormSchemaVersionsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
