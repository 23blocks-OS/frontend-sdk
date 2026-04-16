import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import { mandrillStatsMapper } from '../mappers/mandrill-stats.mapper.js';
import type {
  CrmMailTemplate,
  CreateCrmMailTemplateRequest,
  UpdateCrmMailTemplateRequest,
  ListCrmMailTemplatesParams,
  CreateMandrillTemplateRequest,
  UpdateMandrillTemplateRequest,
  MandrillTemplateStats,
} from '../types/mail-template.js';
import { crmMailTemplateMapper } from '../mappers/mail-template.mapper.js';

export interface CrmMailTemplatesService {
  /**
   * List mail templates with optional filtering and pagination.
   * @param params - Optional filtering (status, search) and pagination parameters.
   * @returns Paginated result containing CrmMailTemplate objects and metadata.
   */
  list(params?: ListCrmMailTemplatesParams): Promise<PageResult<CrmMailTemplate>>;

  /**
   * Retrieve a single mail template by its unique identifier.
   * @param uniqueId - The unique identifier of the mail template.
   * @returns The matching CrmMailTemplate object.
   */
  get(uniqueId: string): Promise<CrmMailTemplate>;

  /**
   * Create a new mail template.
   * @param data - The template creation payload with code, name, subject, sender info, and content.
   * @returns The newly created CrmMailTemplate object.
   */
  create(data: CreateCrmMailTemplateRequest): Promise<CrmMailTemplate>;

  /**
   * Update an existing mail template.
   * @param uniqueId - The unique identifier of the template to update.
   * @param data - The fields to update on the template.
   * @returns The updated CrmMailTemplate object.
   * @note Uses PUT (not PATCH) as required by the 23blocks backend.
   */
  update(uniqueId: string, data: UpdateCrmMailTemplateRequest): Promise<CrmMailTemplate>;

  /**
   * Retrieve Mandrill delivery statistics for a mail template.
   * @param uniqueId - The unique identifier of the mail template.
   * @returns MandrillTemplateStats with sent, open, click, bounce, and complaint counts.
   */
  getMandrillStats(uniqueId: string): Promise<MandrillTemplateStats>;

  /**
   * Create a Mandrill template linked to a CRM mail template.
   * @param uniqueId - The unique identifier of the CRM mail template.
   * @param data - The Mandrill template creation payload with name, sender info, and content.
   * @returns The updated CrmMailTemplate object with the Mandrill template linked.
   */
  createMandrillTemplate(uniqueId: string, data: CreateMandrillTemplateRequest): Promise<CrmMailTemplate>;

  /**
   * Update the Mandrill template linked to a CRM mail template.
   * @param uniqueId - The unique identifier of the CRM mail template.
   * @param data - The fields to update on the Mandrill template.
   * @returns The updated CrmMailTemplate object.
   * @note Uses PUT (not PATCH) as required by the 23blocks backend.
   */
  updateMandrillTemplate(uniqueId: string, data: UpdateMandrillTemplateRequest): Promise<CrmMailTemplate>;

  /**
   * Publish the Mandrill template for a CRM mail template, making it available for sending.
   * @param uniqueId - The unique identifier of the CRM mail template.
   * @returns The updated CrmMailTemplate object after publishing.
   */
  publishMandrill(uniqueId: string): Promise<CrmMailTemplate>;
}

export function createCrmMailTemplatesService(transport: Transport, _config: { apiKey: string }): CrmMailTemplatesService {
  return {
    async list(params?: ListCrmMailTemplatesParams): Promise<PageResult<CrmMailTemplate>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;

      const response = await transport.get<unknown>('/mailtemplates', { params: queryParams });
      return decodePageResult(response, crmMailTemplateMapper);
    },

    async get(uniqueId: string): Promise<CrmMailTemplate> {
      const response = await transport.get<unknown>(`/mailtemplates/${uniqueId}`);
      return decodeOne(response, crmMailTemplateMapper);
    },

    async create(data: CreateCrmMailTemplateRequest): Promise<CrmMailTemplate> {
      const response = await transport.post<unknown>('/mailtemplates', {
        template: {
          name: data.name,
          event_name: data.eventName,
          source: data.source,
          source_alias: data.sourceAlias,
          source_id: data.sourceId,
          source_type: data.sourceType,
          template_name: data.templateName,
          from_subject: data.fromSubject,
          from_address: data.fromAddress,
          from_name: data.fromName,
          from_domain: data.fromDomain,
          template_html: data.templateHtml,
          template_text: data.templateText,
          preferred_language: data.preferredLanguage,
        },
      });
      return decodeOne(response, crmMailTemplateMapper);
    },

    async update(uniqueId: string, data: UpdateCrmMailTemplateRequest): Promise<CrmMailTemplate> {
      const response = await transport.put<unknown>(`/mailtemplates/${uniqueId}`, {
        template: {
          name: data.name,
          event_name: data.eventName,
          source: data.source,
          source_alias: data.sourceAlias,
          source_id: data.sourceId,
          source_type: data.sourceType,
          template_name: data.templateName,
          from_subject: data.fromSubject,
          from_address: data.fromAddress,
          from_name: data.fromName,
          from_domain: data.fromDomain,
          template_html: data.templateHtml,
          template_text: data.templateText,
          preferred_language: data.preferredLanguage,
          enabled: data.enabled,
          status: data.status,
        },
      });
      return decodeOne(response, crmMailTemplateMapper);
    },

    async getMandrillStats(uniqueId: string): Promise<MandrillTemplateStats> {
      const response = await transport.get<unknown>(`/mailtemplates/${uniqueId}/mandrill/stats`);
      return decodeOne(response, mandrillStatsMapper);
    },

    async createMandrillTemplate(uniqueId: string, data: CreateMandrillTemplateRequest): Promise<CrmMailTemplate> {
      const response = await transport.post<unknown>(`/mailtemplates/${uniqueId}/mandrill`, {
        mandrill: {
          from_email: data.fromEmail,
          from_name: data.fromName,
          from_subject: data.fromSubject,
          template_html: data.templateHtml,
          template_text: data.templateText,
        },
      });
      return decodeOne(response, crmMailTemplateMapper);
    },

    async updateMandrillTemplate(uniqueId: string, data: UpdateMandrillTemplateRequest): Promise<CrmMailTemplate> {
      const response = await transport.put<unknown>(`/mailtemplates/${uniqueId}/mandrill`, {
        mandrill: {
          from_email: data.fromEmail,
          from_name: data.fromName,
          from_subject: data.fromSubject,
          template_html: data.templateHtml,
          template_text: data.templateText,
        },
      });
      return decodeOne(response, crmMailTemplateMapper);
    },

    async publishMandrill(uniqueId: string): Promise<CrmMailTemplate> {
      const response = await transport.put<unknown>(`/mailtemplates/${uniqueId}/mandrill/publish`, {});
      return decodeOne(response, crmMailTemplateMapper);
    },
  };
}
