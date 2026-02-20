import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface FormSchema extends IdentityCore {
  formUniqueId: string;
  name: string;
  description?: string;
  formFields?: Record<string, unknown>;
  datasource?: Record<string, unknown>;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface CreateFormSchemaRequest {
  formUniqueId: string;
  name: string;
  description?: string;
  formFields?: Record<string, unknown>;
  datasource?: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

export interface UpdateFormSchemaRequest {
  name?: string;
  description?: string;
  formFields?: Record<string, unknown>;
  datasource?: Record<string, unknown>;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListFormSchemasParams {
  page?: number;
  perPage?: number;
  formUniqueId?: string;
  status?: EntityStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
