import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface GeoIdentity extends IdentityCore {
  name?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface RegisterGeoIdentityRequest {
  name?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateGeoIdentityRequest {
  name?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListGeoIdentitiesParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface LocationIdentityRequest {
  userUniqueId: string;
  role?: string;
}

export interface UserLocationRequest {
  latitude: number;
  longitude: number;
  accuracy?: number;
  heading?: number;
  speed?: number;
  timestamp?: string | Date;
}
