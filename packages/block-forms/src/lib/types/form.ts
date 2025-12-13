import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Form extends IdentityCore {
  code: string;
  name: string;
  description?: string;
  formType?: string;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface CreateFormRequest {
  code: string;
  name: string;
  description?: string;
  formType?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateFormRequest {
  name?: string;
  description?: string;
  formType?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListFormsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  formType?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
