import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface FormSchema extends IdentityCore {
  formUniqueId: string;
  code: string;
  name: string;
  description?: string;
  version: number;
  schema: Record<string, unknown>; // JSON Schema definition
  uiSchema?: Record<string, unknown>; // UI Schema for rendering
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface CreateFormSchemaRequest {
  formUniqueId: string;
  code: string;
  name: string;
  description?: string;
  version?: number;
  schema: Record<string, unknown>;
  uiSchema?: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

export interface UpdateFormSchemaRequest {
  name?: string;
  description?: string;
  schema?: Record<string, unknown>;
  uiSchema?: Record<string, unknown>;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListFormSchemasParams {
  page?: number;
  perPage?: number;
  formUniqueId?: string;
  status?: EntityStatus;
  version?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
