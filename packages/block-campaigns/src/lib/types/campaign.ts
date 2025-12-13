import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Campaign extends IdentityCore {
  code: string;
  name: string;
  description?: string;
  campaignType?: string;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  spent?: number;
  targetAudience?: string;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

// Request types
export interface CreateCampaignRequest {
  code: string;
  name: string;
  description?: string;
  campaignType?: string;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  targetAudience?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateCampaignRequest {
  name?: string;
  description?: string;
  campaignType?: string;
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  spent?: number;
  targetAudience?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListCampaignsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  campaignType?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CampaignResults {
  campaignUniqueId: string;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  spent?: number;
  revenue?: number;
  roi?: number;
  ctr?: number;
  conversionRate?: number;
}
