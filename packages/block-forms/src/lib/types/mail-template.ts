import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface MailTemplate extends IdentityCore {
  name: string;
  subject: string;
  htmlContent?: string;
  textContent?: string;
  provider?: string;
  providerTemplateId?: string;
  fromEmail?: string;
  fromName?: string;
  replyTo?: string;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface CreateMailTemplateRequest {
  name: string;
  subject: string;
  htmlContent?: string;
  textContent?: string;
  provider?: string;
  providerTemplateId?: string;
  fromEmail?: string;
  fromName?: string;
  replyTo?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateMailTemplateRequest {
  name?: string;
  subject?: string;
  htmlContent?: string;
  textContent?: string;
  provider?: string;
  providerTemplateId?: string;
  fromEmail?: string;
  fromName?: string;
  replyTo?: string;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListMailTemplatesParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  provider?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface MailTemplateStats {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  complaints: number;
}
