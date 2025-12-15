import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  MailTemplate,
  CreateMailTemplateRequest,
  UpdateMailTemplateRequest,
  ListMailTemplatesParams,
  CreateMandrillTemplateRequest,
  UpdateMandrillTemplateRequest,
  MandrillTemplateStats,
} from '../types/mail-template';
import { mailTemplateMapper } from '../mappers/mail-template.mapper';

export interface MailTemplatesService {
  list(params?: ListMailTemplatesParams): Promise<PageResult<MailTemplate>>;
  get(uniqueId: string): Promise<MailTemplate>;
  create(data: CreateMailTemplateRequest): Promise<MailTemplate>;
  update(uniqueId: string, data: UpdateMailTemplateRequest): Promise<MailTemplate>;
  getMandrillStats(uniqueId: string): Promise<MandrillTemplateStats>;
  createMandrillTemplate(uniqueId: string, data: CreateMandrillTemplateRequest): Promise<MailTemplate>;
  updateMandrillTemplate(uniqueId: string, data: UpdateMandrillTemplateRequest): Promise<MailTemplate>;
  publishMandrill(uniqueId: string): Promise<MailTemplate>;
}

export function createMailTemplatesService(transport: Transport, _config: { appId: string }): MailTemplatesService {
  return {
    async list(params?: ListMailTemplatesParams): Promise<PageResult<MailTemplate>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;

      const response = await transport.get<unknown>('/mailtemplates', { params: queryParams });
      return decodePageResult(response, mailTemplateMapper);
    },

    async get(uniqueId: string): Promise<MailTemplate> {
      const response = await transport.get<unknown>(`/mailtemplates/${uniqueId}`);
      return decodeOne(response, mailTemplateMapper);
    },

    async create(data: CreateMailTemplateRequest): Promise<MailTemplate> {
      const response = await transport.post<unknown>('/mailtemplates', {
        mail_template: {
          code: data.code,
          name: data.name,
          subject: data.subject,
          from_email: data.fromEmail,
          from_name: data.fromName,
          html_content: data.htmlContent,
          text_content: data.textContent,
          payload: data.payload,
        },
      });
      return decodeOne(response, mailTemplateMapper);
    },

    async update(uniqueId: string, data: UpdateMailTemplateRequest): Promise<MailTemplate> {
      const response = await transport.put<unknown>(`/mailtemplates/${uniqueId}`, {
        mail_template: {
          name: data.name,
          subject: data.subject,
          from_email: data.fromEmail,
          from_name: data.fromName,
          html_content: data.htmlContent,
          text_content: data.textContent,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, mailTemplateMapper);
    },

    async getMandrillStats(uniqueId: string): Promise<MandrillTemplateStats> {
      const response = await transport.get<any>(`/mailtemplates/${uniqueId}/mandrill/stats`);
      return {
        slug: response.slug,
        name: response.name,
        sentCount: response.sent_count || 0,
        openCount: response.open_count || 0,
        clickCount: response.click_count || 0,
        bounceCount: response.bounce_count || 0,
        complaintCount: response.complaint_count || 0,
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at),
      };
    },

    async createMandrillTemplate(uniqueId: string, data: CreateMandrillTemplateRequest): Promise<MailTemplate> {
      const response = await transport.post<unknown>(`/mailtemplates/${uniqueId}/mandrill`, {
        mandrill: {
          name: data.name,
          from_email: data.fromEmail,
          from_name: data.fromName,
          subject: data.subject,
          code: data.code,
          text: data.text,
          publish: data.publish,
          labels: data.labels,
        },
      });
      return decodeOne(response, mailTemplateMapper);
    },

    async updateMandrillTemplate(uniqueId: string, data: UpdateMandrillTemplateRequest): Promise<MailTemplate> {
      const response = await transport.put<unknown>(`/mailtemplates/${uniqueId}/mandrill`, {
        mandrill: {
          from_email: data.fromEmail,
          from_name: data.fromName,
          subject: data.subject,
          code: data.code,
          text: data.text,
          publish: data.publish,
          labels: data.labels,
        },
      });
      return decodeOne(response, mailTemplateMapper);
    },

    async publishMandrill(uniqueId: string): Promise<MailTemplate> {
      const response = await transport.put<unknown>(`/mailtemplates/${uniqueId}/mandrill/publish`, {});
      return decodeOne(response, mailTemplateMapper);
    },
  };
}
