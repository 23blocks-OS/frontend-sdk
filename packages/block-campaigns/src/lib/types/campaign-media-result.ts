import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface CampaignMediaResult extends IdentityCore {
  campaignMediaUniqueId: string;
  date?: Date;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  views?: number;
  engagement?: number;
  spend?: number;
  revenue?: number;
  ctr?: number;
  viewRate?: number;
  engagementRate?: number;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface CreateCampaignMediaResultRequest {
  campaignMediaUniqueId: string;
  date?: Date;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  views?: number;
  engagement?: number;
  spend?: number;
  revenue?: number;
  payload?: Record<string, unknown>;
}

export interface UpdateCampaignMediaResultRequest {
  impressions?: number;
  clicks?: number;
  conversions?: number;
  views?: number;
  engagement?: number;
  spend?: number;
  revenue?: number;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListCampaignMediaResultsParams {
  page?: number;
  perPage?: number;
  campaignMediaUniqueId?: string;
  startDate?: Date;
  endDate?: Date;
  status?: EntityStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
