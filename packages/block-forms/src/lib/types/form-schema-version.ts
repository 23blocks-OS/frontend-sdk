import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface FormSchemaVersion extends IdentityCore {
  formUniqueId: string;
  schemaUniqueId: string;
  version: number;
  schema: Record<string, unknown>;
  uiSchema?: Record<string, unknown>;
  status: EntityStatus;
  isPublished: boolean;
  publishedAt?: string;
  payload?: Record<string, unknown>;
}

export interface CreateFormSchemaVersionRequest {
  schema: Record<string, unknown>;
  uiSchema?: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

export interface UpdateFormSchemaVersionRequest {
  schema?: Record<string, unknown>;
  uiSchema?: Record<string, unknown>;
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
