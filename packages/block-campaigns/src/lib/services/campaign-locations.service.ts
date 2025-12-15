import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  CampaignLocation,
  CreateCampaignLocationRequest,
  UpdateCampaignLocationRequest,
  ListCampaignLocationsParams,
} from '../types/campaign-location';
import { campaignLocationMapper } from '../mappers/campaign-location.mapper';

export interface CampaignLocationsService {
  list(params?: ListCampaignLocationsParams): Promise<PageResult<CampaignLocation>>;
  get(uniqueId: string): Promise<CampaignLocation>;
  create(data: CreateCampaignLocationRequest): Promise<CampaignLocation>;
  update(uniqueId: string, data: UpdateCampaignLocationRequest): Promise<CampaignLocation>;
  delete(uniqueId: string): Promise<void>;
}

export function createCampaignLocationsService(
  transport: Transport,
  _config: { appId: string }
): CampaignLocationsService {
  return {
    async list(params?: ListCampaignLocationsParams): Promise<PageResult<CampaignLocation>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.campaignUniqueId) queryParams['campaign_unique_id'] = params.campaignUniqueId;
      if (params?.city) queryParams['city'] = params.city;
      if (params?.state) queryParams['state'] = params.state;
      if (params?.country) queryParams['country'] = params.country;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/campaign_locations', { params: queryParams });
      return decodePageResult(response, campaignLocationMapper);
    },

    async get(uniqueId: string): Promise<CampaignLocation> {
      const response = await transport.get<unknown>(`/campaign_locations/${uniqueId}`);
      return decodeOne(response, campaignLocationMapper);
    },

    async create(data: CreateCampaignLocationRequest): Promise<CampaignLocation> {
      const response = await transport.post<unknown>('/campaign_locations', {
        campaign_location: {
          campaign_unique_id: data.campaignUniqueId,
          name: data.name,
          location_type: data.locationType,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          postal_code: data.postalCode,
          latitude: data.latitude,
          longitude: data.longitude,
          radius: data.radius,
          radius_unit: data.radiusUnit,
          payload: data.payload,
        },
      });
      return decodeOne(response, campaignLocationMapper);
    },

    async update(uniqueId: string, data: UpdateCampaignLocationRequest): Promise<CampaignLocation> {
      const response = await transport.put<unknown>(`/campaign_locations/${uniqueId}`, {
        campaign_location: {
          name: data.name,
          location_type: data.locationType,
          address: data.address,
          city: data.city,
          state: data.state,
          country: data.country,
          postal_code: data.postalCode,
          latitude: data.latitude,
          longitude: data.longitude,
          radius: data.radius,
          radius_unit: data.radiusUnit,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, campaignLocationMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/campaign_locations/${uniqueId}`);
    },
  };
}
