import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface FormInstance extends IdentityCore {
  formSchemaUniqueId: string;
  formSchemaVersion: number;
  userUniqueId?: string;
  data: Record<string, unknown>; // Form submission data
  status: EntityStatus;
  enabled: boolean;
  submittedAt?: Date;
  payload?: Record<string, unknown>;
}

export interface CreateFormInstanceRequest {
  formSchemaUniqueId: string;
  formSchemaVersion?: number;
  userUniqueId?: string;
  data: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

export interface UpdateFormInstanceRequest {
  data?: Record<string, unknown>;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface SubmitFormInstanceRequest {
  formSchemaUniqueId: string;
  formSchemaVersion?: number;
  data: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

export interface ListFormInstancesParams {
  page?: number;
  perPage?: number;
  formSchemaUniqueId?: string;
  userUniqueId?: string;
  status?: EntityStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
