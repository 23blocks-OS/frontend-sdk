import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface FormSetItem {
  formSchemaUniqueId: string;
  displayOrder?: number;
  required?: boolean;
}

export interface FormSet extends IdentityCore {
  code: string;
  name: string;
  description?: string;
  category?: string;
  appliesTo?: string;
  isActive?: boolean;
  isDefault?: boolean;
  sendAllAtOnce?: boolean;
  allowPartialCompletion?: boolean;
  enforceSequential?: boolean;
  expirationDays?: number;
  autoAssignRules?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  formSetItemsAttributes?: FormSetItem[];
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface CreateFormSetRequest {
  code: string;
  name: string;
  description?: string;
  category?: string;
  appliesTo?: string;
  isActive?: boolean;
  isDefault?: boolean;
  sendAllAtOnce?: boolean;
  allowPartialCompletion?: boolean;
  enforceSequential?: boolean;
  expirationDays?: number;
  autoAssignRules?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  formSetItemsAttributes?: FormSetItem[];
  payload?: Record<string, unknown>;
}

export interface UpdateFormSetRequest {
  name?: string;
  description?: string;
  category?: string;
  appliesTo?: string;
  isActive?: boolean;
  isDefault?: boolean;
  sendAllAtOnce?: boolean;
  allowPartialCompletion?: boolean;
  enforceSequential?: boolean;
  expirationDays?: number;
  autoAssignRules?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  formSetItemsAttributes?: FormSetItem[];
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

export interface FormSetMatchRequest {
  userUniqueId?: string;
  formSetUniqueId?: string;
  category?: string;
  appliesTo?: string;
  metadata?: Record<string, unknown>;
}

export interface FormSetMatchResult {
  formSet: FormSet;
  score: number;
  matchedCriteria: string[];
}

export interface FormSetAutoAssignRequest {
  userUniqueId: string;
  formSetUniqueId?: string;
  assignedByName?: string;
  expiresAt?: string | Date;
  metadata?: Record<string, unknown>;
}
