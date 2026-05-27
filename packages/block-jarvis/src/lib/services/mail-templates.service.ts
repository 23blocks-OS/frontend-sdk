import type { Transport, PageResult } from '@23blocks/contracts';
import { assertUuid } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  MailTemplate,
  CreateMailTemplateRequest,
  UpdateMailTemplateRequest,
  ListMailTemplatesParams,
  CreateMandrillTemplateRequest,
  UpdateMandrillTemplateRequest,
} from '../types/mail-template.js';
import { mailTemplateMapper } from '../mappers/mail-template.mapper.js';

function buildMailTemplateBody(data: CreateMailTemplateRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.eventName) body['event_name'] = data.eventName;
  if (data.name) body['name'] = data.name;
  if (data.source) body['source'] = data.source;
  if (data.sourceAlias) body['source_alias'] = data.sourceAlias;
  if (data.sourceId) body['source_id'] = data.sourceId;
  if (data.sourceType) body['source_type'] = data.sourceType;
  if (data.templateName) body['template_name'] = data.templateName;
  if (data.templateHtml) body['template_html'] = data.templateHtml;
  if (data.templateText) body['template_text'] = data.templateText;
  if (data.fromDomain) body['from_domain'] = data.fromDomain;
  if (data.fromAddress) body['from_address'] = data.fromAddress;
  if (data.fromName) body['from_name'] = data.fromName;
  if (data.fromSubject) body['from_subject'] = data.fromSubject;
  if (data.preferredLanguage) body['preferred_language'] = data.preferredLanguage;
  if (data.provider) body['provider'] = data.provider;
  return body;
}

function buildMandrillBody(data: CreateMandrillTemplateRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.fromEmail) body['from_email'] = data.fromEmail;
  if (data.fromName) body['from_name'] = data.fromName;
  if (data.fromSubject) body['from_subject'] = data.fromSubject;
  if (data.templateHtml) body['template_html'] = data.templateHtml;
  if (data.templateText) body['template_text'] = data.templateText;
  return body;
}

export interface MailTemplatesService {
  list(params?: ListMailTemplatesParams): Promise<PageResult<MailTemplate>>;
  get(uniqueId: string): Promise<MailTemplate>;
  create(data: CreateMailTemplateRequest): Promise<MailTemplate>;
  update(uniqueId: string, data: UpdateMailTemplateRequest): Promise<MailTemplate>;
  createMandrillTemplate(uniqueId: string, data?: CreateMandrillTemplateRequest): Promise<MailTemplate>;
  updateMandrillTemplate(uniqueId: string, data?: UpdateMandrillTemplateRequest): Promise<MailTemplate>;
  publishMandrill(uniqueId: string): Promise<MailTemplate>;
  getMandrillStats(uniqueId: string): Promise<unknown>;
}

export function createMailTemplatesService(transport: Transport, _config: { apiKey: string }): MailTemplatesService {
  return {
    async list(params?: ListMailTemplatesParams): Promise<PageResult<MailTemplate>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/mailtemplates', { params: queryParams });
      return decodePageResult(response, mailTemplateMapper);
    },

    async get(uniqueId: string): Promise<MailTemplate> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.get<unknown>(`/mailtemplates/${uniqueId}`);
      return decodeOne(response, mailTemplateMapper);
    },

    async create(data: CreateMailTemplateRequest): Promise<MailTemplate> {
      const response = await transport.post<unknown>('/mailtemplates', {
        mail_template: buildMailTemplateBody(data),
      });
      return decodeOne(response, mailTemplateMapper);
    },

    async update(uniqueId: string, data: UpdateMailTemplateRequest): Promise<MailTemplate> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.put<unknown>(`/mailtemplates/${uniqueId}`, {
        mail_template: buildMailTemplateBody(data),
      });
      return decodeOne(response, mailTemplateMapper);
    },

    async createMandrillTemplate(uniqueId: string, data?: CreateMandrillTemplateRequest): Promise<MailTemplate> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.post<unknown>(`/mailtemplates/${uniqueId}/mandrill`, data ? {
        mandrill: buildMandrillBody(data),
      } : {});
      return decodeOne(response, mailTemplateMapper);
    },

    async updateMandrillTemplate(uniqueId: string, data?: UpdateMandrillTemplateRequest): Promise<MailTemplate> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.put<unknown>(`/mailtemplates/${uniqueId}/mandrill`, data ? {
        mandrill: buildMandrillBody(data),
      } : {});
      return decodeOne(response, mailTemplateMapper);
    },

    async publishMandrill(uniqueId: string): Promise<MailTemplate> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.put<unknown>(`/mailtemplates/${uniqueId}/mandrill/publish`, {});
      return decodeOne(response, mailTemplateMapper);
    },

    async getMandrillStats(uniqueId: string): Promise<unknown> {
      assertUuid(uniqueId, 'uniqueId');
      return transport.get<unknown>(`/mailtemplates/${uniqueId}/mandrill/stats`);
    },
  };
}
