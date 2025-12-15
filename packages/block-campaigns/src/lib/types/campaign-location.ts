import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface CampaignLocation extends IdentityCore {
  campaignUniqueId: string;
  name: string;
  locationType?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  radiusUnit?: string;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface CreateCampaignLocationRequest {
  campaignUniqueId: string;
  name: string;
  locationType?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  radiusUnit?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateCampaignLocationRequest {
  name?: string;
  locationType?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  radiusUnit?: string;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListCampaignLocationsParams {
  page?: number;
  perPage?: number;
  campaignUniqueId?: string;
  city?: string;
  state?: string;
  country?: string;
  status?: EntityStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
