import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface TravelRoute extends IdentityCore {
  code?: string;
  name: string;
  description?: string;
  ownerUniqueId?: string;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
  tags?: string[];
}

// Request types
export interface CreateTravelRouteRequest {
  name: string;
  code?: string;
  description?: string;
  ownerUniqueId?: string;
  tags?: string[];
  payload?: Record<string, unknown>;
}

export interface UpdateTravelRouteRequest {
  name?: string;
  code?: string;
  description?: string;
  enabled?: boolean;
  status?: EntityStatus;
  tags?: string[];
  payload?: Record<string, unknown>;
}

export interface ListTravelRoutesParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  ownerUniqueId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
