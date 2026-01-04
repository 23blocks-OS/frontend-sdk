import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface LocationIdentity extends IdentityCore {
  locationUniqueId: string;
  identityUniqueId: string;
  identityType: string;
  role?: string;
  checkedInAt?: Date;
  checkedOutAt?: Date;
  lastSeenAt?: Date;
  isPresent: boolean;
  deviceId?: string;
  deviceType?: string;
  accuracy?: number;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface CreateLocationIdentityRequest {
  locationUniqueId: string;
  identityUniqueId: string;
  identityType: string;
  role?: string;
  deviceId?: string;
  deviceType?: string;
  accuracy?: number;
  payload?: Record<string, unknown>;
}

export interface UpdateLocationIdentityRequest {
  role?: string;
  deviceId?: string;
  deviceType?: string;
  accuracy?: number;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListLocationIdentitiesParams {
  page?: number;
  perPage?: number;
  locationUniqueId?: string;
  identityUniqueId?: string;
  identityType?: string;
  role?: string;
  isPresent?: boolean;
  status?: EntityStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
