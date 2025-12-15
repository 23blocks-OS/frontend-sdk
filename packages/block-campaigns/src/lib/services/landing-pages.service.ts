import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  LandingPage,
  CreateLandingPageRequest,
  UpdateLandingPageRequest,
  ListLandingPagesParams,
} from '../types/landing-page';
import { landingPageMapper } from '../mappers/landing-page.mapper';

export interface LandingPagesService {
  list(params?: ListLandingPagesParams): Promise<PageResult<LandingPage>>;
  get(uniqueId: string): Promise<LandingPage>;
  create(data: CreateLandingPageRequest): Promise<LandingPage>;
  update(uniqueId: string, data: UpdateLandingPageRequest): Promise<LandingPage>;
  delete(uniqueId: string): Promise<void>;
  publish(uniqueId: string): Promise<LandingPage>;
  unpublish(uniqueId: string): Promise<LandingPage>;
  getBySlug(slug: string): Promise<LandingPage>;
}

export function createLandingPagesService(transport: Transport, _config: { appId: string }): LandingPagesService {
  return {
    async list(params?: ListLandingPagesParams): Promise<PageResult<LandingPage>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.campaignUniqueId) queryParams['campaign_unique_id'] = params.campaignUniqueId;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;

      const response = await transport.get<unknown>('/landing_pages', { params: queryParams });
      return decodePageResult(response, landingPageMapper);
    },

    async get(uniqueId: string): Promise<LandingPage> {
      const response = await transport.get<unknown>(`/landing_pages/${uniqueId}`);
      return decodeOne(response, landingPageMapper);
    },

    async create(data: CreateLandingPageRequest): Promise<LandingPage> {
      const response = await transport.post<unknown>('/landing_pages', {
        landing_page: {
            campaign_unique_id: data.campaignUniqueId,
            code: data.code,
            name: data.name,
            slug: data.slug,
            template_unique_id: data.templateUniqueId,
            content: data.content,
            meta_title: data.metaTitle,
            meta_description: data.metaDescription,
            payload: data.payload,
          },
      });
      return decodeOne(response, landingPageMapper);
    },

    async update(uniqueId: string, data: UpdateLandingPageRequest): Promise<LandingPage> {
      const response = await transport.put<unknown>(`/landing_pages/${uniqueId}`, {
        landing_page: {
            name: data.name,
            slug: data.slug,
            template_unique_id: data.templateUniqueId,
            content: data.content,
            meta_title: data.metaTitle,
            meta_description: data.metaDescription,
            visits: data.visits,
            conversions: data.conversions,
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
          },
      });
      return decodeOne(response, landingPageMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/landing_pages/${uniqueId}`);
    },

    async publish(uniqueId: string): Promise<LandingPage> {
      const response = await transport.post<unknown>(`/landing_pages/${uniqueId}/publish`, {});
      return decodeOne(response, landingPageMapper);
    },

    async unpublish(uniqueId: string): Promise<LandingPage> {
      const response = await transport.post<unknown>(`/landing_pages/${uniqueId}/unpublish`, {});
      return decodeOne(response, landingPageMapper);
    },

    async getBySlug(slug: string): Promise<LandingPage> {
      const response = await transport.get<unknown>(`/landing_pages/slug/${slug}`);
      return decodeOne(response, landingPageMapper);
    },
  };
}
