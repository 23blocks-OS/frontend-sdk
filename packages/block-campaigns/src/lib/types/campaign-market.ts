import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface CampaignMarket extends IdentityCore {
  campaignUniqueId: string;
  name: string;
  marketCode?: string;
  region?: string;
  country?: string;
  language?: string;
  currency?: string;
  timezone?: string;
  budget?: number;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface CreateCampaignMarketRequest {
  campaignUniqueId: string;
  name: string;
  marketCode?: string;
  region?: string;
  country?: string;
  language?: string;
  currency?: string;
  timezone?: string;
  budget?: number;
  payload?: Record<string, unknown>;
}

export interface UpdateCampaignMarketRequest {
  name?: string;
  marketCode?: string;
  region?: string;
  country?: string;
  language?: string;
  currency?: string;
  timezone?: string;
  budget?: number;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListCampaignMarketsParams {
  page?: number;
  perPage?: number;
  campaignUniqueId?: string;
  region?: string;
  country?: string;
  status?: EntityStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
