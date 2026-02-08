import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  LandingPage,
  CreateLandingPageRequest,
  UpdateLandingPageRequest,
  ListLandingPagesParams,
} from '../types/landing-page.js';
import { landingPageMapper } from '../mappers/landing-page.mapper.js';

export interface LandingPagesService {
  /**
   * List landing pages with optional filtering.
   * @returns Paginated list of LandingPage records with metadata.
   */
  list(params?: ListLandingPagesParams): Promise<PageResult<LandingPage>>;

  /**
   * Get a single landing page by unique ID.
   * @returns The matching LandingPage record.
   */
  get(uniqueId: string): Promise<LandingPage>;

  /**
   * Create a new landing page.
   * @returns The newly created LandingPage record.
   */
  create(data: CreateLandingPageRequest): Promise<LandingPage>;

  /**
   * Update an existing landing page.
   * @returns The updated LandingPage record.
   */
  update(uniqueId: string, data: UpdateLandingPageRequest): Promise<LandingPage>;

  /**
   * Delete a landing page.
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Publish a landing page, making it publicly accessible.
   * @returns The updated LandingPage record with published status.
   */
  publish(uniqueId: string): Promise<LandingPage>;

  /**
   * Unpublish a landing page, removing public access.
   * @returns The updated LandingPage record with unpublished status.
   */
  unpublish(uniqueId: string): Promise<LandingPage>;

  /**
   * Look up a landing page by its URL slug.
   * @returns The matching LandingPage record.
   */
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
