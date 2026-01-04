import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface FileAccess extends IdentityCore {
  fileUniqueId: string;
  granteeUniqueId: string;
  granteeType: string;
  accessLevel: 'read' | 'write' | 'admin';
  grantedByUniqueId: string;
  expiresAt?: Date;
  accessedAt?: Date;
  accessCount: number;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface CreateFileAccessRequest {
  fileUniqueId: string;
  granteeUniqueId: string;
  granteeType: string;
  accessLevel?: 'read' | 'write' | 'admin';
  expiresAt?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateFileAccessRequest {
  accessLevel?: 'read' | 'write' | 'admin';
  expiresAt?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListFileAccessParams {
  page?: number;
  perPage?: number;
  fileUniqueId?: string;
  granteeUniqueId?: string;
  granteeType?: string;
  accessLevel?: 'read' | 'write' | 'admin';
  status?: EntityStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
