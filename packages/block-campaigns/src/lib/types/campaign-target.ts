import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface CampaignTarget extends IdentityCore {
  campaignUniqueId: string;
  name: string;
  targetType?: string;
  targetValue?: string;
  priority?: number;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface CreateCampaignTargetRequest {
  campaignUniqueId: string;
  name: string;
  targetType?: string;
  targetValue?: string;
  priority?: number;
  payload?: Record<string, unknown>;
}

export interface UpdateCampaignTargetRequest {
  name?: string;
  targetType?: string;
  targetValue?: string;
  priority?: number;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListCampaignTargetsParams {
  page?: number;
  perPage?: number;
  campaignUniqueId?: string;
  status?: EntityStatus;
  targetType?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
