import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface FormInstance extends IdentityCore {
  formUniqueId?: string;
  userUniqueId?: string;
  assignedToUniqueId?: string;
  assignedToEmail?: string;
  assignedToName?: string;
  assignedByName?: string;
  expiresAt?: Date;
  responses?: unknown[];
  metadata?: Record<string, unknown>;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface CreateFormInstanceRequest {
  assignedToUniqueId?: string;
  assignedToEmail?: string;
  assignedToName?: string;
  assignedByName?: string;
  expiresAt?: string | Date;
  responses?: unknown[];
  metadata?: Record<string, unknown>;
}

export interface UpdateFormInstanceRequest {
  assignedToUniqueId?: string;
  assignedToEmail?: string;
  assignedToName?: string;
  assignedByName?: string;
  expiresAt?: string | Date;
  responses?: unknown[];
  metadata?: Record<string, unknown>;
  status?: EntityStatus;
}

export interface ListFormInstancesParams {
  page?: number;
  perPage?: number;
  userUniqueId?: string;
  status?: EntityStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
