import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface FileAccess extends IdentityCore {
  fileUniqueId: string;
  userUniqueId: string;
  accessType: 'read' | 'write' | 'admin';
  grantedByUniqueId: string;
  expiresAt?: Date;
  startsAt?: Date;
  accessedAt?: Date;
  accessCount: number;
  status: EntityStatus;
  enabled: boolean;
}

export interface CreateFileAccessRequest {
  userUniqueId: string;
  accessType?: 'read' | 'write' | 'admin';
  expiresAt?: string;
  startsAt?: string;
  userUniqueIds?: string[];
}

export interface UpdateFileAccessRequest {
  accessType?: 'read' | 'write' | 'admin';
  expiresAt?: string;
  startsAt?: string;
  userUniqueId?: string;
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
