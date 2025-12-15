import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  CampaignMediaResult,
  CreateCampaignMediaResultRequest,
  UpdateCampaignMediaResultRequest,
  ListCampaignMediaResultsParams,
} from '../types/campaign-media-result';
import { campaignMediaResultMapper } from '../mappers/campaign-media-result.mapper';

export interface CampaignMediaResultsService {
  list(params?: ListCampaignMediaResultsParams): Promise<PageResult<CampaignMediaResult>>;
  get(uniqueId: string): Promise<CampaignMediaResult>;
  create(data: CreateCampaignMediaResultRequest): Promise<CampaignMediaResult>;
  update(uniqueId: string, data: UpdateCampaignMediaResultRequest): Promise<CampaignMediaResult>;
  delete(uniqueId: string): Promise<void>;
}

export function createCampaignMediaResultsService(
  transport: Transport,
  _config: { appId: string }
): CampaignMediaResultsService {
  return {
    async list(params?: ListCampaignMediaResultsParams): Promise<PageResult<CampaignMediaResult>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.campaignMediaUniqueId) queryParams['campaign_media_unique_id'] = params.campaignMediaUniqueId;
      if (params?.startDate) queryParams['start_date'] = params.startDate.toISOString();
      if (params?.endDate) queryParams['end_date'] = params.endDate.toISOString();
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/campaign_media_results', { params: queryParams });
      return decodePageResult(response, campaignMediaResultMapper);
    },

    async get(uniqueId: string): Promise<CampaignMediaResult> {
      const response = await transport.get<unknown>(`/campaign_media_results/${uniqueId}`);
      return decodeOne(response, campaignMediaResultMapper);
    },

    async create(data: CreateCampaignMediaResultRequest): Promise<CampaignMediaResult> {
      const response = await transport.post<unknown>('/campaign_media_results', {
        campaign_media_result: {
          campaign_media_unique_id: data.campaignMediaUniqueId,
          date: data.date,
          impressions: data.impressions,
          clicks: data.clicks,
          conversions: data.conversions,
          views: data.views,
          engagement: data.engagement,
          spend: data.spend,
          revenue: data.revenue,
          payload: data.payload,
        },
      });
      return decodeOne(response, campaignMediaResultMapper);
    },

    async update(uniqueId: string, data: UpdateCampaignMediaResultRequest): Promise<CampaignMediaResult> {
      const response = await transport.put<unknown>(`/campaign_media_results/${uniqueId}`, {
        campaign_media_result: {
          impressions: data.impressions,
          clicks: data.clicks,
          conversions: data.conversions,
          views: data.views,
          engagement: data.engagement,
          spend: data.spend,
          revenue: data.revenue,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, campaignMediaResultMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/campaign_media_results/${uniqueId}`);
    },
  };
}
