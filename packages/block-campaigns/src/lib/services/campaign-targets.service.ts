import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  CampaignTarget,
  CreateCampaignTargetRequest,
  UpdateCampaignTargetRequest,
  ListCampaignTargetsParams,
} from '../types/campaign-target';
import { campaignTargetMapper } from '../mappers/campaign-target.mapper';

export interface CampaignTargetsService {
  list(params?: ListCampaignTargetsParams): Promise<PageResult<CampaignTarget>>;
  get(uniqueId: string): Promise<CampaignTarget>;
  create(data: CreateCampaignTargetRequest): Promise<CampaignTarget>;
  update(uniqueId: string, data: UpdateCampaignTargetRequest): Promise<CampaignTarget>;
  delete(uniqueId: string): Promise<void>;
}

export function createCampaignTargetsService(
  transport: Transport,
  _config: { appId: string }
): CampaignTargetsService {
  return {
    async list(params?: ListCampaignTargetsParams): Promise<PageResult<CampaignTarget>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.campaignUniqueId) queryParams['campaign_unique_id'] = params.campaignUniqueId;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.targetType) queryParams['target_type'] = params.targetType;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/campaign_targets', { params: queryParams });
      return decodePageResult(response, campaignTargetMapper);
    },

    async get(uniqueId: string): Promise<CampaignTarget> {
      const response = await transport.get<unknown>(`/campaign_targets/${uniqueId}`);
      return decodeOne(response, campaignTargetMapper);
    },

    async create(data: CreateCampaignTargetRequest): Promise<CampaignTarget> {
      const response = await transport.post<unknown>('/campaign_targets', {
        campaign_target: {
          campaign_unique_id: data.campaignUniqueId,
          name: data.name,
          target_type: data.targetType,
          target_value: data.targetValue,
          priority: data.priority,
          payload: data.payload,
        },
      });
      return decodeOne(response, campaignTargetMapper);
    },

    async update(uniqueId: string, data: UpdateCampaignTargetRequest): Promise<CampaignTarget> {
      const response = await transport.put<unknown>(`/campaign_targets/${uniqueId}`, {
        campaign_target: {
          name: data.name,
          target_type: data.targetType,
          target_value: data.targetValue,
          priority: data.priority,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, campaignTargetMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/campaign_targets/${uniqueId}`);
    },
  };
}
