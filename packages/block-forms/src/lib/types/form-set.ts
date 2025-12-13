import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface FormSet extends IdentityCore {
  code: string;
  name: string;
  description?: string;
  forms: FormReference[]; // List of form references
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface FormReference {
  formUniqueId: string;
  formCode?: string;
  formName?: string;
  displayOrder?: number;
  required?: boolean;
}

export interface CreateFormSetRequest {
  code: string;
  name: string;
  description?: string;
  forms?: FormReference[];
  payload?: Record<string, unknown>;
}

export interface UpdateFormSetRequest {
  name?: string;
  description?: string;
  forms?: FormReference[];
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListFormSetsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
