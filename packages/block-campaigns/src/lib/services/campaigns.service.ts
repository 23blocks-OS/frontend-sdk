import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Campaign,
  CreateCampaignRequest,
  UpdateCampaignRequest,
  ListCampaignsParams,
  CampaignResults,
} from '../types/campaign';
import { campaignMapper } from '../mappers/campaign.mapper';

export interface CampaignsService {
  list(params?: ListCampaignsParams): Promise<PageResult<Campaign>>;
  get(uniqueId: string): Promise<Campaign>;
  create(data: CreateCampaignRequest): Promise<Campaign>;
  update(uniqueId: string, data: UpdateCampaignRequest): Promise<Campaign>;
  delete(uniqueId: string): Promise<void>;
  start(uniqueId: string): Promise<Campaign>;
  pause(uniqueId: string): Promise<Campaign>;
  stop(uniqueId: string): Promise<Campaign>;
  getResults(uniqueId: string): Promise<CampaignResults>;
}

export function createCampaignsService(transport: Transport, _config: { appId: string }): CampaignsService {
  return {
    async list(params?: ListCampaignsParams): Promise<PageResult<Campaign>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.campaignType) queryParams['campaign_type'] = params.campaignType;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/campaigns', { params: queryParams });
      return decodePageResult(response, campaignMapper);
    },

    async get(uniqueId: string): Promise<Campaign> {
      const response = await transport.get<unknown>(`/campaigns/${uniqueId}`);
      return decodeOne(response, campaignMapper);
    },

    async create(data: CreateCampaignRequest): Promise<Campaign> {
      const response = await transport.post<unknown>('/campaigns', {
        data: {
          type: 'Campaign',
          attributes: {
            code: data.code,
            name: data.name,
            description: data.description,
            campaign_type: data.campaignType,
            start_date: data.startDate,
            end_date: data.endDate,
            budget: data.budget,
            target_audience: data.targetAudience,
            payload: data.payload,
          },
        },
      });
      return decodeOne(response, campaignMapper);
    },

    async update(uniqueId: string, data: UpdateCampaignRequest): Promise<Campaign> {
      const response = await transport.put<unknown>(`/campaigns/${uniqueId}`, {
        data: {
          type: 'Campaign',
          attributes: {
            name: data.name,
            description: data.description,
            campaign_type: data.campaignType,
            start_date: data.startDate,
            end_date: data.endDate,
            budget: data.budget,
            spent: data.spent,
            target_audience: data.targetAudience,
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
          },
        },
      });
      return decodeOne(response, campaignMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/campaigns/${uniqueId}`);
    },

    async start(uniqueId: string): Promise<Campaign> {
      const response = await transport.post<unknown>(`/campaigns/${uniqueId}/start`, {});
      return decodeOne(response, campaignMapper);
    },

    async pause(uniqueId: string): Promise<Campaign> {
      const response = await transport.post<unknown>(`/campaigns/${uniqueId}/pause`, {});
      return decodeOne(response, campaignMapper);
    },

    async stop(uniqueId: string): Promise<Campaign> {
      const response = await transport.post<unknown>(`/campaigns/${uniqueId}/stop`, {});
      return decodeOne(response, campaignMapper);
    },

    async getResults(uniqueId: string): Promise<CampaignResults> {
      const response = await transport.get<CampaignResults>(`/campaigns/${uniqueId}/results`);
      return response;
    },
  };
}
