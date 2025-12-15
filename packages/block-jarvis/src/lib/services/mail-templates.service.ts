import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  MailTemplate,
  CreateMailTemplateRequest,
  UpdateMailTemplateRequest,
  ListMailTemplatesParams,
  CreateMandrillTemplateRequest,
  UpdateMandrillTemplateRequest,
  MandrillStats,
} from '../types/mail-template';
import { mailTemplateMapper } from '../mappers/mail-template.mapper';

export interface MailTemplatesService {
  list(params?: ListMailTemplatesParams): Promise<PageResult<MailTemplate>>;
  get(uniqueId: string): Promise<MailTemplate>;
  create(data: CreateMailTemplateRequest): Promise<MailTemplate>;
  update(uniqueId: string, data: UpdateMailTemplateRequest): Promise<MailTemplate>;
  createMandrillTemplate(uniqueId: string, data?: CreateMandrillTemplateRequest): Promise<MailTemplate>;
  updateMandrillTemplate(uniqueId: string, data?: UpdateMandrillTemplateRequest): Promise<MailTemplate>;
  publishMandrill(uniqueId: string): Promise<MailTemplate>;
  getMandrillStats(uniqueId: string): Promise<MandrillStats>;
}

export function createMailTemplatesService(transport: Transport, _config: { appId: string }): MailTemplatesService {
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

    async createMandrillTemplate(uniqueId: string, data?: CreateMandrillTemplateRequest): Promise<MailTemplate> {
      const response = await transport.post<unknown>(`/mailtemplates/${uniqueId}/mandrill`, {
        slug: data?.slug,
        labels: data?.labels,
        payload: data?.payload,
      });
      return decodeOne(response, mailTemplateMapper);
    },

    async updateMandrillTemplate(uniqueId: string, data?: UpdateMandrillTemplateRequest): Promise<MailTemplate> {
      const response = await transport.put<unknown>(`/mailtemplates/${uniqueId}/mandrill`, {
        slug: data?.slug,
        labels: data?.labels,
        payload: data?.payload,
      });
      return decodeOne(response, mailTemplateMapper);
    },

    async publishMandrill(uniqueId: string): Promise<MailTemplate> {
      const response = await transport.put<unknown>(`/mailtemplates/${uniqueId}/mandrill/publish`, {});
      return decodeOne(response, mailTemplateMapper);
    },

    async getMandrillStats(uniqueId: string): Promise<MandrillStats> {
      const response = await transport.get<any>(`/mailtemplates/${uniqueId}/mandrill/stats`);
      return {
        slug: response.slug,
        sentCount: response.sent_count,
        openCount: response.open_count,
        clickCount: response.click_count,
        hardBounceCount: response.hard_bounce_count,
        softBounceCount: response.soft_bounce_count,
        rejectCount: response.reject_count,
        spamCount: response.spam_count,
        unsubCount: response.unsub_count,
        lastSentAt: response.last_sent_at ? new Date(response.last_sent_at) : undefined,
      };
    },
  };
}
