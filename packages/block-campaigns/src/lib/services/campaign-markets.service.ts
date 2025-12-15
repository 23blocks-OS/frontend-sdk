import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  CampaignMarket,
  CreateCampaignMarketRequest,
  UpdateCampaignMarketRequest,
  ListCampaignMarketsParams,
} from '../types/campaign-market';
import { campaignMarketMapper } from '../mappers/campaign-market.mapper';

export interface CampaignMarketsService {
  list(params?: ListCampaignMarketsParams): Promise<PageResult<CampaignMarket>>;
  get(uniqueId: string): Promise<CampaignMarket>;
  create(data: CreateCampaignMarketRequest): Promise<CampaignMarket>;
  update(uniqueId: string, data: UpdateCampaignMarketRequest): Promise<CampaignMarket>;
  delete(uniqueId: string): Promise<void>;
}

export function createCampaignMarketsService(
  transport: Transport,
  _config: { appId: string }
): CampaignMarketsService {
  return {
    async list(params?: ListCampaignMarketsParams): Promise<PageResult<CampaignMarket>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.campaignUniqueId) queryParams['campaign_unique_id'] = params.campaignUniqueId;
      if (params?.region) queryParams['region'] = params.region;
      if (params?.country) queryParams['country'] = params.country;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/campaign_markets', { params: queryParams });
      return decodePageResult(response, campaignMarketMapper);
    },

    async get(uniqueId: string): Promise<CampaignMarket> {
      const response = await transport.get<unknown>(`/campaign_markets/${uniqueId}`);
      return decodeOne(response, campaignMarketMapper);
    },

    async create(data: CreateCampaignMarketRequest): Promise<CampaignMarket> {
      const response = await transport.post<unknown>('/campaign_markets', {
        campaign_market: {
          campaign_unique_id: data.campaignUniqueId,
          name: data.name,
          market_code: data.marketCode,
          region: data.region,
          country: data.country,
          language: data.language,
          currency: data.currency,
          timezone: data.timezone,
          budget: data.budget,
          payload: data.payload,
        },
      });
      return decodeOne(response, campaignMarketMapper);
    },

    async update(uniqueId: string, data: UpdateCampaignMarketRequest): Promise<CampaignMarket> {
      const response = await transport.put<unknown>(`/campaign_markets/${uniqueId}`, {
        campaign_market: {
          name: data.name,
          market_code: data.marketCode,
          region: data.region,
          country: data.country,
          language: data.language,
          currency: data.currency,
          timezone: data.timezone,
          budget: data.budget,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, campaignMarketMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/campaign_markets/${uniqueId}`);
    },
  };
}
