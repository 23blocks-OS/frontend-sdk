import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  LandingTemplate,
  CreateLandingTemplateRequest,
  UpdateLandingTemplateRequest,
  ListLandingTemplatesParams,
} from '../types/landing-template';
import { landingTemplateMapper } from '../mappers/landing-template.mapper';

export interface LandingTemplatesService {
  list(params?: ListLandingTemplatesParams): Promise<PageResult<LandingTemplate>>;
  get(uniqueId: string): Promise<LandingTemplate>;
  create(data: CreateLandingTemplateRequest): Promise<LandingTemplate>;
  update(uniqueId: string, data: UpdateLandingTemplateRequest): Promise<LandingTemplate>;
  delete(uniqueId: string): Promise<void>;
}

export function createLandingTemplatesService(
  transport: Transport,
  _config: { appId: string }
): LandingTemplatesService {
  return {
    async list(params?: ListLandingTemplatesParams): Promise<PageResult<LandingTemplate>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.templateType) queryParams['template_type'] = params.templateType;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/landing_templates', { params: queryParams });
      return decodePageResult(response, landingTemplateMapper);
    },

    async get(uniqueId: string): Promise<LandingTemplate> {
      const response = await transport.get<unknown>(`/landing_templates/${uniqueId}`);
      return decodeOne(response, landingTemplateMapper);
    },

    async create(data: CreateLandingTemplateRequest): Promise<LandingTemplate> {
      const response = await transport.post<unknown>('/landing_templates', {
        landing_template: {
          name: data.name,
          description: data.description,
          template_type: data.templateType,
          html_content: data.htmlContent,
          css_content: data.cssContent,
          js_content: data.jsContent,
          thumbnail_url: data.thumbnailUrl,
          payload: data.payload,
        },
      });
      return decodeOne(response, landingTemplateMapper);
    },

    async update(uniqueId: string, data: UpdateLandingTemplateRequest): Promise<LandingTemplate> {
      const response = await transport.put<unknown>(`/landing_templates/${uniqueId}`, {
        landing_template: {
          name: data.name,
          description: data.description,
          template_type: data.templateType,
          html_content: data.htmlContent,
          css_content: data.cssContent,
          js_content: data.jsContent,
          thumbnail_url: data.thumbnailUrl,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, landingTemplateMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/landing_templates/${uniqueId}`);
    },
  };
}
