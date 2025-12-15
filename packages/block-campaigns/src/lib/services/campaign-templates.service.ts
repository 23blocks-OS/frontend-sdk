import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  CampaignTemplate,
  CreateCampaignTemplateRequest,
  UpdateCampaignTemplateRequest,
  ListCampaignTemplatesParams,
  TemplateDetail,
  CreateTemplateDetailRequest,
  UpdateTemplateDetailRequest,
  ListTemplateDetailsParams,
} from '../types/campaign-template';
import { campaignTemplateMapper, templateDetailMapper } from '../mappers/campaign-template.mapper';

export interface CampaignTemplatesService {
  list(params?: ListCampaignTemplatesParams): Promise<PageResult<CampaignTemplate>>;
  get(uniqueId: string): Promise<CampaignTemplate>;
  create(data: CreateCampaignTemplateRequest): Promise<CampaignTemplate>;
  update(uniqueId: string, data: UpdateCampaignTemplateRequest): Promise<CampaignTemplate>;
  delete(uniqueId: string): Promise<void>;
  listDetails(params?: ListTemplateDetailsParams): Promise<PageResult<TemplateDetail>>;
  getDetail(uniqueId: string): Promise<TemplateDetail>;
  createDetail(data: CreateTemplateDetailRequest): Promise<TemplateDetail>;
  updateDetail(uniqueId: string, data: UpdateTemplateDetailRequest): Promise<TemplateDetail>;
  deleteDetail(uniqueId: string): Promise<void>;
}

export function createCampaignTemplatesService(
  transport: Transport,
  _config: { appId: string }
): CampaignTemplatesService {
  return {
    async list(params?: ListCampaignTemplatesParams): Promise<PageResult<CampaignTemplate>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.templateType) queryParams['template_type'] = params.templateType;
      if (params?.category) queryParams['category'] = params.category;
      if (params?.isPublic !== undefined) queryParams['is_public'] = String(params.isPublic);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/templates', { params: queryParams });
      return decodePageResult(response, campaignTemplateMapper);
    },

    async get(uniqueId: string): Promise<CampaignTemplate> {
      const response = await transport.get<unknown>(`/templates/${uniqueId}`);
      return decodeOne(response, campaignTemplateMapper);
    },

    async create(data: CreateCampaignTemplateRequest): Promise<CampaignTemplate> {
      const response = await transport.post<unknown>('/templates', {
        template: {
          name: data.name,
          description: data.description,
          template_type: data.templateType,
          category: data.category,
          content: data.content,
          thumbnail_url: data.thumbnailUrl,
          is_public: data.isPublic,
          payload: data.payload,
        },
      });
      return decodeOne(response, campaignTemplateMapper);
    },

    async update(uniqueId: string, data: UpdateCampaignTemplateRequest): Promise<CampaignTemplate> {
      const response = await transport.put<unknown>(`/templates/${uniqueId}`, {
        template: {
          name: data.name,
          description: data.description,
          template_type: data.templateType,
          category: data.category,
          content: data.content,
          thumbnail_url: data.thumbnailUrl,
          is_public: data.isPublic,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, campaignTemplateMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/templates/${uniqueId}`);
    },

    async listDetails(params?: ListTemplateDetailsParams): Promise<PageResult<TemplateDetail>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.templateUniqueId) queryParams['template_unique_id'] = params.templateUniqueId;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/template_details', { params: queryParams });
      return decodePageResult(response, templateDetailMapper);
    },

    async getDetail(uniqueId: string): Promise<TemplateDetail> {
      const response = await transport.get<unknown>(`/template_details/${uniqueId}`);
      return decodeOne(response, templateDetailMapper);
    },

    async createDetail(data: CreateTemplateDetailRequest): Promise<TemplateDetail> {
      const response = await transport.post<unknown>('/template_details', {
        template_detail: {
          template_unique_id: data.templateUniqueId,
          name: data.name,
          field_type: data.fieldType,
          default_value: data.defaultValue,
          is_required: data.isRequired,
          sort_order: data.sortOrder,
          payload: data.payload,
        },
      });
      return decodeOne(response, templateDetailMapper);
    },

    async updateDetail(uniqueId: string, data: UpdateTemplateDetailRequest): Promise<TemplateDetail> {
      const response = await transport.put<unknown>(`/template_details/${uniqueId}`, {
        template_detail: {
          name: data.name,
          field_type: data.fieldType,
          default_value: data.defaultValue,
          is_required: data.isRequired,
          sort_order: data.sortOrder,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, templateDetailMapper);
    },

    async deleteDetail(uniqueId: string): Promise<void> {
      await transport.delete(`/template_details/${uniqueId}`);
    },
  };
}
