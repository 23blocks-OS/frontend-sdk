import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface AssetsEntity extends IdentityCore {
  name: string;
  description?: string;
  entityType?: string;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface CreateAssetsEntityRequest {
  name: string;
  description?: string;
  entityType?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateAssetsEntityRequest {
  name?: string;
  description?: string;
  entityType?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListAssetsEntitiesParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  entityType?: string;
  search?: string;
}

// Access Management Types
export interface EntityAccess {
  uniqueId: string;
  entityUniqueId: string;
  userUniqueId: string;
  accessLevel: string;
  grantedAt: Date;
  expiresAt?: Date;
  payload?: Record<string, unknown>;
}

export interface AccessRequest {
  uniqueId: string;
  entityUniqueId: string;
  userUniqueId: string;
  requestedAccessLevel: string;
  status: 'pending' | 'approved' | 'denied';
  reason?: string;
  requestedAt: Date;
  resolvedAt?: Date;
  payload?: Record<string, unknown>;
}

export interface CreateAccessRequestRequest {
  accessLevel?: string;
  reason?: string;
  payload?: Record<string, unknown>;
}
