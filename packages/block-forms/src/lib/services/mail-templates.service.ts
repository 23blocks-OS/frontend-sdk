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
  /**
   * List all mail templates
   * @param params - Optional filtering by status, provider, and pagination
   * @returns Paginated result containing MailTemplate items and metadata
   */
  list(params?: ListMailTemplatesParams): Promise<PageResult<MailTemplate>>;

  /**
   * Get a specific mail template
   * @param uniqueId - The unique identifier of the mail template
   * @returns The matching MailTemplate record
   */
  get(uniqueId: string): Promise<MailTemplate>;

  /**
   * Create a new mail template
   * @param data - Template details including name, subject, content, and sender configuration
   * @returns The newly created MailTemplate record
   */
  create(data: CreateMailTemplateRequest): Promise<MailTemplate>;

  /**
   * Update an existing mail template
   * @param uniqueId - The unique identifier of the template to update
   * @param data - Fields to update such as subject, content, or sender configuration
   * @returns The updated MailTemplate record
   */
  update(uniqueId: string, data: UpdateMailTemplateRequest): Promise<MailTemplate>;

  /**
   * Delete a mail template
   * @param uniqueId - The unique identifier of the template to delete
   * @returns Resolves when the template has been deleted
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Get usage statistics for a mail template
   * @param uniqueId - The unique identifier of the mail template
   * @returns Statistics object with send/open/click metrics for the template
   */
  getStats(uniqueId: string): Promise<MailTemplateStats>;
}

export function createMailTemplatesService(transport: Transport, _config: { appId: string }): MailTemplatesService {
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
        mail_template: {
          name: data.name,
          subject: data.subject,
          html_content: data.htmlContent,
          text_content: data.textContent,
          provider: data.provider,
          provider_template_id: data.providerTemplateId,
          from_email: data.fromEmail,
          from_name: data.fromName,
          reply_to: data.replyTo,
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
          html_content: data.htmlContent,
          text_content: data.textContent,
          provider: data.provider,
          provider_template_id: data.providerTemplateId,
          from_email: data.fromEmail,
          from_name: data.fromName,
          reply_to: data.replyTo,
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
