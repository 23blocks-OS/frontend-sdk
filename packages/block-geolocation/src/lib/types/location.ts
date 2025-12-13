import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Location extends IdentityCore {
  ownerUniqueId?: string;
  ownerType?: string;
  code?: string;
  name: string;
  source?: string;
  addressUniqueId?: string;
  areaUniqueId?: string;
  locationParentId?: string;
  latitude?: number;
  longitude?: number;
  qcode?: string;
  payload?: Record<string, unknown>;
  status: EntityStatus;
  enabled: boolean;
  imageUrl?: string;
  videoUrl?: string;
  contentUrl?: string;
  iconUrl?: string;
  locationType?: string;
  regionUniqueId?: string;
  regionCode?: string;
  regionName?: string;
}

// Request types
export interface CreateLocationRequest {
  name: string;
  code?: string;
  ownerUniqueId?: string;
  ownerType?: string;
  source?: string;
  addressUniqueId?: string;
  areaUniqueId?: string;
  locationParentId?: string;
  latitude?: number;
  longitude?: number;
  locationType?: string;
  regionUniqueId?: string;
  imageUrl?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateLocationRequest {
  name?: string;
  code?: string;
  addressUniqueId?: string;
  areaUniqueId?: string;
  latitude?: number;
  longitude?: number;
  locationType?: string;
  imageUrl?: string;
  videoUrl?: string;
  contentUrl?: string;
  iconUrl?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListLocationsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  ownerUniqueId?: string;
  ownerType?: string;
  locationType?: string;
  regionUniqueId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
