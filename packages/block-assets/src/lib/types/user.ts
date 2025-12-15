import type { IdentityCore, EntityStatus } from '@23blocks/contracts';
import type { Asset } from './asset';
import type { AssetsEntity } from './entity';

export interface AssetsUser extends IdentityCore {
  email: string;
  name?: string;
  phone?: string;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface RegisterAssetsUserRequest {
  email: string;
  name?: string;
  phone?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateAssetsUserRequest {
  name?: string;
  phone?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListAssetsUsersParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  search?: string;
}

export interface UserOwnership {
  uniqueId: string;
  assetUniqueId: string;
  userUniqueId: string;
  ownershipType: string;
  acquiredAt: Date;
  transferredAt?: Date;
  payload?: Record<string, unknown>;
}
