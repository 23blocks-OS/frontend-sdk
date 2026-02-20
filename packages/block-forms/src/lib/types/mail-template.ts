import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface MailTemplate extends IdentityCore {
  name: string;
  eventName?: string;
  fromSubject?: string;
  templateHtml?: string;
  templateText?: string;
  templateName?: string;
  fromAddress?: string;
  fromDomain?: string;
  fromName?: string;
  provider?: string;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  preferredLanguage?: string;
  key?: string;
  secret?: string;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface CreateMailTemplateRequest {
  name: string;
  eventName?: string;
  fromSubject?: string;
  templateHtml?: string;
  templateText?: string;
  templateName?: string;
  fromAddress?: string;
  fromDomain?: string;
  fromName?: string;
  provider?: string;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  preferredLanguage?: string;
  key?: string;
  secret?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateMailTemplateRequest {
  name?: string;
  eventName?: string;
  fromSubject?: string;
  templateHtml?: string;
  templateText?: string;
  templateName?: string;
  fromAddress?: string;
  fromDomain?: string;
  fromName?: string;
  provider?: string;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  preferredLanguage?: string;
  key?: string;
  secret?: string;
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
