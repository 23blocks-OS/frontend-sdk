import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  MailTemplate,
  CreateMailTemplateRequest,
  UpdateMailTemplateRequest,
  ListMailTemplatesParams,
  CreateMandrillTemplateRequest,
  UpdateMandrillTemplateRequest,
  MandrillTimeSeriesPoint,
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
   * Get hourly delivery statistics for the linked Mandrill template.
   * The endpoint passes Mandrill's `templates.time_series` response through
   * directly — an array of per-hour data points.
   * @returns Array of MandrillTimeSeriesPoint, one per hour.
   */
  getMandrillStats(uniqueId: string): Promise<MandrillTimeSeriesPoint[]>;

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
        template: {
          name: data.name,
          event_name: data.event_name,
          source: data.source,
          source_alias: data.source_alias,
          source_id: data.source_id,
          source_type: data.source_type,
          template_name: data.template_name,
          from_subject: data.from_subject,
          from_address: data.from_address,
          from_name: data.from_name,
          from_domain: data.from_domain,
          template_html: data.template_html,
          template_text: data.template_text,
          preferred_language: data.preferred_language,
          provider: data.provider,
        },
      });
      return decodeOne(response, mailTemplateMapper);
    },

    async update(uniqueId: string, data: UpdateMailTemplateRequest): Promise<MailTemplate> {
      const response = await transport.put<unknown>(`/mailtemplates/${uniqueId}`, {
        template: {
          name: data.name,
          event_name: data.event_name,
          source: data.source,
          source_alias: data.source_alias,
          source_id: data.source_id,
          source_type: data.source_type,
          template_name: data.template_name,
          from_subject: data.from_subject,
          from_address: data.from_address,
          from_name: data.from_name,
          from_domain: data.from_domain,
          template_html: data.template_html,
          template_text: data.template_text,
          preferred_language: data.preferred_language,
          provider: data.provider,
        },
      });
      return decodeOne(response, mailTemplateMapper);
    },

    async getMandrillStats(uniqueId: string): Promise<MandrillTimeSeriesPoint[]> {
      // Mandrill returns an array of hourly time-series points at the top
      // level. The controller passes the response through directly. On a
      // Mandrill error the controller still returns 200 with an `errors`
      // array — surface that as a thrown Error so the caller can handle it.
      const response = await transport.get<unknown>(`/mailtemplates/${uniqueId}/mandrill/stats`);

      if (!Array.isArray(response)) {
        const errs = (response as { errors?: Array<{ detail?: string; title?: string }> } | null)?.errors;
        if (Array.isArray(errs) && errs.length > 0) {
          const e = errs[0];
          throw new Error(`Mandrill stats error: ${e?.title ?? ''} ${e?.detail ?? ''}`.trim());
        }
        return [];
      }

      return (response as Array<Record<string, unknown>>).map((p) => ({
        time: p['time'] ? new Date(p['time'] as string) : new Date(0),
        sent: Number(p['sent'] ?? 0),
        opens: Number(p['opens'] ?? 0),
        uniqueOpens: Number(p['unique_opens'] ?? 0),
        clicks: Number(p['clicks'] ?? 0),
        uniqueClicks: Number(p['unique_clicks'] ?? 0),
        hardBounces: Number(p['hard_bounces'] ?? 0),
        softBounces: Number(p['soft_bounces'] ?? 0),
        rejects: Number(p['rejects'] ?? 0),
        complaints: Number(p['complaints'] ?? 0),
      }));
    },

    async createMandrillTemplate(uniqueId: string, data: CreateMandrillTemplateRequest): Promise<MailTemplate> {
      const response = await transport.post<unknown>(`/mailtemplates/${uniqueId}/mandrill`, {
        mandrill: {
          from_email: data.from_email,
          from_name: data.from_name,
          from_subject: data.from_subject,
          template_html: data.template_html,
          template_text: data.template_text,
        },
      });
      return decodeOne(response, mailTemplateMapper);
    },

    async updateMandrillTemplate(uniqueId: string, data: UpdateMandrillTemplateRequest): Promise<MailTemplate> {
      const response = await transport.put<unknown>(`/mailtemplates/${uniqueId}/mandrill`, {
        mandrill: {
          from_email: data.from_email,
          from_name: data.from_name,
          from_subject: data.from_subject,
          template_html: data.template_html,
          template_text: data.template_text,
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
