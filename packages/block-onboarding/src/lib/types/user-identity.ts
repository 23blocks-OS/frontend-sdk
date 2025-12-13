import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface UserIdentity extends IdentityCore {
  userUniqueId: string;
  identityType: string;
  identityValue: string;
  verified: boolean;
  verifiedAt?: Date;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface CreateUserIdentityRequest {
  userUniqueId: string;
  identityType: string;
  identityValue: string;
  payload?: Record<string, unknown>;
}

export interface VerifyUserIdentityRequest {
  verificationCode?: string;
  verificationData?: Record<string, unknown>;
}

export interface ListUserIdentitiesParams {
  page?: number;
  perPage?: number;
  userUniqueId?: string;
  identityType?: string;
  verified?: boolean;
  status?: EntityStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
