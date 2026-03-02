import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface FileDelegation extends IdentityCore {
  delegatorUniqueId: string;
  granteeUserUniqueId: string;
  accessType: string;
  expiresAt?: Date;
  startsAt?: Date;
  status: EntityStatus;
  enabled: boolean;
}

export interface CreateFileDelegationRequest {
  granteeUserUniqueId: string;
  accessType: string;
  expiresAt?: string;
  startsAt?: string;
}

export interface UpdateFileDelegationRequest {
  accessType?: string;
  granteeUserUniqueId?: string;
  expiresAt?: string;
  startsAt?: string;
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
