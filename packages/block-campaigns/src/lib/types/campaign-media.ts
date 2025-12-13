import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface CampaignMedia extends IdentityCore {
  campaignUniqueId: string;
  mediaType?: string;
  name: string;
  contentUrl?: string;
  thumbnailUrl?: string;
  clickUrl?: string;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

// Request types
export interface CreateCampaignMediaRequest {
  campaignUniqueId: string;
  mediaType?: string;
  name: string;
  contentUrl?: string;
  thumbnailUrl?: string;
  clickUrl?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateCampaignMediaRequest {
  name?: string;
  mediaType?: string;
  contentUrl?: string;
  thumbnailUrl?: string;
  clickUrl?: string;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListCampaignMediaParams {
  page?: number;
  perPage?: number;
  campaignUniqueId?: string;
  mediaType?: string;
  status?: EntityStatus;
}

export interface CampaignMediaResults {
  mediaUniqueId: string;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  ctr?: number;
  conversionRate?: number;
}
