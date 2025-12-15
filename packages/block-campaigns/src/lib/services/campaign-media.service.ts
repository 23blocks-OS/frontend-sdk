import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  CampaignMedia,
  CreateCampaignMediaRequest,
  UpdateCampaignMediaRequest,
  ListCampaignMediaParams,
  CampaignMediaResults,
} from '../types/campaign-media';
import { campaignMediaMapper } from '../mappers/campaign-media.mapper';

export interface CampaignMediaService {
  list(params?: ListCampaignMediaParams): Promise<PageResult<CampaignMedia>>;
  get(uniqueId: string): Promise<CampaignMedia>;
  create(data: CreateCampaignMediaRequest): Promise<CampaignMedia>;
  update(uniqueId: string, data: UpdateCampaignMediaRequest): Promise<CampaignMedia>;
  delete(uniqueId: string): Promise<void>;
  listByCampaign(campaignUniqueId: string): Promise<CampaignMedia[]>;
  getResults(uniqueId: string): Promise<CampaignMediaResults>;
}

export function createCampaignMediaService(transport: Transport, _config: { appId: string }): CampaignMediaService {
  return {
    async list(params?: ListCampaignMediaParams): Promise<PageResult<CampaignMedia>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.campaignUniqueId) queryParams['campaign_unique_id'] = params.campaignUniqueId;
      if (params?.mediaType) queryParams['media_type'] = params.mediaType;
      if (params?.status) queryParams['status'] = params.status;

      const response = await transport.get<unknown>('/campaign_media', { params: queryParams });
      return decodePageResult(response, campaignMediaMapper);
    },

    async get(uniqueId: string): Promise<CampaignMedia> {
      const response = await transport.get<unknown>(`/campaign_media/${uniqueId}`);
      return decodeOne(response, campaignMediaMapper);
    },

    async create(data: CreateCampaignMediaRequest): Promise<CampaignMedia> {
      const response = await transport.post<unknown>('/campaign_media', {
        campaign_media: {
            campaign_unique_id: data.campaignUniqueId,
            media_type: data.mediaType,
            name: data.name,
            content_url: data.contentUrl,
            thumbnail_url: data.thumbnailUrl,
            click_url: data.clickUrl,
            payload: data.payload,
          },
      });
      return decodeOne(response, campaignMediaMapper);
    },

    async update(uniqueId: string, data: UpdateCampaignMediaRequest): Promise<CampaignMedia> {
      const response = await transport.put<unknown>(`/campaign_media/${uniqueId}`, {
        campaign_media: {
            name: data.name,
            media_type: data.mediaType,
            content_url: data.contentUrl,
            thumbnail_url: data.thumbnailUrl,
            click_url: data.clickUrl,
            impressions: data.impressions,
            clicks: data.clicks,
            conversions: data.conversions,
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
          },
      });
      return decodeOne(response, campaignMediaMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/campaign_media/${uniqueId}`);
    },

    async listByCampaign(campaignUniqueId: string): Promise<CampaignMedia[]> {
      const response = await transport.get<unknown>(`/campaigns/${campaignUniqueId}/media`);
      return decodeMany(response, campaignMediaMapper);
    },

    async getResults(uniqueId: string): Promise<CampaignMediaResults> {
      const response = await transport.get<CampaignMediaResults>(`/campaign_media/${uniqueId}/results`);
      return response;
    },
  };
}
