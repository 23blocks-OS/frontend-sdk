import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface FileDelegation extends IdentityCore {
  delegatorUniqueId: string;
  delegateeUniqueId: string;
  fileUniqueId?: string;
  folderUniqueId?: string;
  permissions: string[];
  expiresAt?: Date;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface CreateFileDelegationRequest {
  delegateeUniqueId: string;
  fileUniqueId?: string;
  folderUniqueId?: string;
  permissions: string[];
  expiresAt?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateFileDelegationRequest {
  permissions?: string[];
  expiresAt?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListFileDelegationsParams {
  page?: number;
  perPage?: number;
  delegatorUniqueId?: string;
  delegateeUniqueId?: string;
  fileUniqueId?: string;
  status?: EntityStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
