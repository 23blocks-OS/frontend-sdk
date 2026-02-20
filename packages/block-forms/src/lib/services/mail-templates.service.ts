import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  MailTemplate,
  CreateMailTemplateRequest,
  UpdateMailTemplateRequest,
  ListMailTemplatesParams,
  MailTemplateStats,
} from '../types/mail-template.js';
import { mailTemplateMapper } from '../mappers/mail-template.mapper.js';

export interface MailTemplatesService {
  list(params?: ListMailTemplatesParams): Promise<PageResult<MailTemplate>>;
  get(uniqueId: string): Promise<MailTemplate>;
  create(data: CreateMailTemplateRequest): Promise<MailTemplate>;
  update(uniqueId: string, data: UpdateMailTemplateRequest): Promise<MailTemplate>;
  delete(uniqueId: string): Promise<void>;
  getStats(uniqueId: string): Promise<MailTemplateStats>;
}

export function createMailTemplatesService(transport: Transport, _config: { apiKey: string }): MailTemplatesService {
  return {
    async list(params?: ListMailTemplatesParams): Promise<PageResult<MailTemplate>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.provider) queryParams['provider'] = params.provider;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/mailtemplates/', { params: queryParams });
      return decodePageResult(response, mailTemplateMapper);
    },

    async get(uniqueId: string): Promise<MailTemplate> {
      const response = await transport.get<unknown>(`/mailtemplates/${uniqueId}`);
      return decodeOne(response, mailTemplateMapper);
    },

    async create(data: CreateMailTemplateRequest): Promise<MailTemplate> {
      const response = await transport.post<unknown>('/mailtemplates', {
        template: {
          name: data.name,
          event_name: data.eventName,
          from_subject: data.fromSubject,
          template_html: data.templateHtml,
          template_text: data.templateText,
          template_name: data.templateName,
          from_address: data.fromAddress,
          from_domain: data.fromDomain,
          from_name: data.fromName,
          provider: data.provider,
          source: data.source,
          source_alias: data.sourceAlias,
          source_id: data.sourceId,
          source_type: data.sourceType,
          preferred_language: data.preferredLanguage,
          key: data.key,
          secret: data.secret,
          payload: data.payload,
        },
      });
      return decodeOne(response, mailTemplateMapper);
    },

    async update(uniqueId: string, data: UpdateMailTemplateRequest): Promise<MailTemplate> {
      const response = await transport.put<unknown>(`/mailtemplates/${uniqueId}`, {
        template: {
          name: data.name,
          event_name: data.eventName,
          from_subject: data.fromSubject,
          template_html: data.templateHtml,
          template_text: data.templateText,
          template_name: data.templateName,
          from_address: data.fromAddress,
          from_domain: data.fromDomain,
          from_name: data.fromName,
          provider: data.provider,
          source: data.source,
          source_alias: data.sourceAlias,
          source_id: data.sourceId,
          source_type: data.sourceType,
          preferred_language: data.preferredLanguage,
          key: data.key,
          secret: data.secret,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, mailTemplateMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/mailtemplates/${uniqueId}`);
    },

    async getStats(uniqueId: string): Promise<MailTemplateStats> {
      const response = await transport.get<unknown>(`/mailtemplates/${uniqueId}/stats`);
      return response as MailTemplateStats;
    },
  };
}
