import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  CampaignResult,
  CreateCampaignResultRequest,
  UpdateCampaignResultRequest,
  ListCampaignResultsParams,
} from '../types/campaign-result';
import { campaignResultMapper } from '../mappers/campaign-result.mapper';

export interface CampaignResultsService {
  list(params?: ListCampaignResultsParams): Promise<PageResult<CampaignResult>>;
  get(uniqueId: string): Promise<CampaignResult>;
  create(data: CreateCampaignResultRequest): Promise<CampaignResult>;
  update(uniqueId: string, data: UpdateCampaignResultRequest): Promise<CampaignResult>;
  delete(uniqueId: string): Promise<void>;
}

export function createCampaignResultsService(
  transport: Transport,
  _config: { appId: string }
): CampaignResultsService {
  return {
    async list(params?: ListCampaignResultsParams): Promise<PageResult<CampaignResult>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.campaignUniqueId) queryParams['campaign_unique_id'] = params.campaignUniqueId;
      if (params?.startDate) queryParams['start_date'] = params.startDate.toISOString();
      if (params?.endDate) queryParams['end_date'] = params.endDate.toISOString();
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/campaign_results', { params: queryParams });
      return decodePageResult(response, campaignResultMapper);
    },

    async get(uniqueId: string): Promise<CampaignResult> {
      const response = await transport.get<unknown>(`/campaign_results/${uniqueId}`);
      return decodeOne(response, campaignResultMapper);
    },

    async create(data: CreateCampaignResultRequest): Promise<CampaignResult> {
      const response = await transport.post<unknown>('/campaign_results', {
        campaign_result: {
          campaign_unique_id: data.campaignUniqueId,
          date: data.date,
          impressions: data.impressions,
          clicks: data.clicks,
          conversions: data.conversions,
          spend: data.spend,
          revenue: data.revenue,
          payload: data.payload,
        },
      });
      return decodeOne(response, campaignResultMapper);
    },

    async update(uniqueId: string, data: UpdateCampaignResultRequest): Promise<CampaignResult> {
      const response = await transport.put<unknown>(`/campaign_results/${uniqueId}`, {
        campaign_result: {
          impressions: data.impressions,
          clicks: data.clicks,
          conversions: data.conversions,
          spend: data.spend,
          revenue: data.revenue,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, campaignResultMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/campaign_results/${uniqueId}`);
    },
  };
}
