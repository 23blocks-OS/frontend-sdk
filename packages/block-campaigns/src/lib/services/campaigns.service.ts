import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Campaign,
  CreateCampaignRequest,
  UpdateCampaignRequest,
  ListCampaignsParams,
  CampaignResults,
} from '../types/campaign.js';
import { campaignMapper } from '../mappers/campaign.mapper.js';

export interface CampaignsService {
  /**
   * List campaigns with optional filtering and sorting.
   * @returns Paginated list of Campaign records with metadata.
   */
  list(params?: ListCampaignsParams): Promise<PageResult<Campaign>>;

  /**
   * Get a single campaign by unique ID.
   * @returns The matching Campaign record.
   */
  get(uniqueId: string): Promise<Campaign>;

  /**
   * Create a new campaign.
   * @returns The newly created Campaign record.
   */
  create(data: CreateCampaignRequest): Promise<Campaign>;

  /**
   * Update an existing campaign.
   * @returns The updated Campaign record.
   */
  update(uniqueId: string, data: UpdateCampaignRequest): Promise<Campaign>;

  /**
   * Delete a campaign.
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Start a campaign, transitioning it to active state.
   * @returns The updated Campaign record with active status.
   */
  start(uniqueId: string): Promise<Campaign>;

  /**
   * Pause an active campaign.
   * @returns The updated Campaign record with paused status.
   */
  pause(uniqueId: string): Promise<Campaign>;

  /**
   * Stop a campaign, transitioning it to stopped state.
   * @returns The updated Campaign record with stopped status.
   */
  stop(uniqueId: string): Promise<Campaign>;

  /**
   * Get aggregated results for a campaign.
   * @returns CampaignResults with performance metrics.
   */
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
        campaign: {
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
      });
      return decodeOne(response, campaignMapper);
    },

    async update(uniqueId: string, data: UpdateCampaignRequest): Promise<Campaign> {
      const response = await transport.put<unknown>(`/campaigns/${uniqueId}`, {
        campaign: {
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
