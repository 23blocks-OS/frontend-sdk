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
} from '../types/mail-template.js';
import { mailTemplateMapper } from '../mappers/mail-template.mapper.js';

export interface MailTemplatesService {
  /**
   * List mail templates with optional filtering.
   * @returns Paginated list of MailTemplate records with metadata.
   */
  list(params?: ListMailTemplatesParams): Promise<PageResult<MailTemplate>>;

  /**
   * Get a single mail template by unique ID.
   * @returns The matching MailTemplate record.
   */
  get(uniqueId: string): Promise<MailTemplate>;

  /**
   * Create a new mail template.
   * @returns The newly created MailTemplate record.
   */
  create(data: CreateMailTemplateRequest): Promise<MailTemplate>;

  /**
   * Update an existing mail template.
   * @returns The updated MailTemplate record.
   */
  update(uniqueId: string, data: UpdateMailTemplateRequest): Promise<MailTemplate>;

  /**
   * Get delivery statistics for the linked Mandrill template.
   * @returns MandrillTemplateStats with send, open, click, and bounce counts.
   */
  getMandrillStats(uniqueId: string): Promise<MandrillTemplateStats>;

  /**
   * Create a Mandrill template linked to this mail template.
   * @returns The updated MailTemplate record with Mandrill integration.
   */
  createMandrillTemplate(uniqueId: string, data: CreateMandrillTemplateRequest): Promise<MailTemplate>;

  /**
   * Update the linked Mandrill template.
   * @returns The updated MailTemplate record.
   */
  updateMandrillTemplate(uniqueId: string, data: UpdateMandrillTemplateRequest): Promise<MailTemplate>;

  /**
   * Publish the Mandrill template to make it active.
   * @returns The updated MailTemplate record with published status.
   */
  publishMandrill(uniqueId: string): Promise<MailTemplate>;
}

export function createMailTemplatesService(transport: Transport, _config: { apiKey: string }): MailTemplatesService {
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
