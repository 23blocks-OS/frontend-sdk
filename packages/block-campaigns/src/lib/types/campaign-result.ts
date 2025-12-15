import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface CampaignResult extends IdentityCore {
  campaignUniqueId: string;
  date?: Date;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  spend?: number;
  revenue?: number;
  ctr?: number;
  conversionRate?: number;
  costPerClick?: number;
  costPerConversion?: number;
  roi?: number;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface CreateCampaignResultRequest {
  campaignUniqueId: string;
  date?: Date;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  spend?: number;
  revenue?: number;
  payload?: Record<string, unknown>;
}

export interface UpdateCampaignResultRequest {
  impressions?: number;
  clicks?: number;
  conversions?: number;
  spend?: number;
  revenue?: number;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListCampaignResultsParams {
  page?: number;
  perPage?: number;
  campaignUniqueId?: string;
  startDate?: Date;
  endDate?: Date;
  status?: EntityStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
