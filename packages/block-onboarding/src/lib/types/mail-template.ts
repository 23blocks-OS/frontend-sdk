import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface MailTemplate extends IdentityCore {
  code: string;
  name: string;
  subject?: string;
  fromEmail?: string;
  fromName?: string;
  htmlContent?: string;
  textContent?: string;
  mandrillSlug?: string;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface CreateMailTemplateRequest {
  name: string;
  event_name?: string;
  source?: string;
  source_alias?: string;
  source_id?: string;
  source_type?: string;
  template_name?: string;
  from_subject?: string;
  from_address?: string;
  from_name?: string;
  from_domain?: string;
  template_html?: string;
  template_text?: string;
  preferred_language?: string;
  provider?: string;
}

export interface UpdateMailTemplateRequest {
  name?: string;
  event_name?: string;
  source?: string;
  source_alias?: string;
  source_id?: string;
  source_type?: string;
  template_name?: string;
  from_subject?: string;
  from_address?: string;
  from_name?: string;
  from_domain?: string;
  template_html?: string;
  template_text?: string;
  preferred_language?: string;
  provider?: string;
}

export interface ListMailTemplatesParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  search?: string;
}

export interface CreateMandrillTemplateRequest {
  from_email?: string;
  from_name?: string;
  from_subject?: string;
  template_html?: string;
  template_text?: string;
}

export interface UpdateMandrillTemplateRequest {
  from_email?: string;
  from_name?: string;
  from_subject?: string;
  template_html?: string;
  template_text?: string;
}

/**
 * One hourly data point from Mandrill's time_series API.
 * The endpoint returns an array of these.
 */
export interface MandrillTimeSeriesPoint {
  time: Date;
  sent: number;
  opens: number;
  uniqueOpens: number;
  clicks: number;
  uniqueClicks: number;
  hardBounces: number;
  softBounces: number;
  rejects: number;
  complaints: number;
}
