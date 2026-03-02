import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface CrmMailTemplate extends IdentityCore {
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

export interface CreateCrmMailTemplateRequest {
  name: string;
  eventName?: string;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  templateName?: string;
  fromSubject?: string;
  fromAddress?: string;
  fromName?: string;
  fromDomain?: string;
  templateHtml?: string;
  templateText?: string;
  preferredLanguage?: string;
}

export interface UpdateCrmMailTemplateRequest {
  name?: string;
  eventName?: string;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  templateName?: string;
  fromSubject?: string;
  fromAddress?: string;
  fromName?: string;
  fromDomain?: string;
  templateHtml?: string;
  templateText?: string;
  preferredLanguage?: string;
  enabled?: boolean;
  status?: EntityStatus;
}

export interface ListCrmMailTemplatesParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  search?: string;
}

export interface CreateMandrillTemplateRequest {
  fromEmail?: string;
  fromName?: string;
  fromSubject?: string;
  templateHtml?: string;
  templateText?: string;
}

export interface UpdateMandrillTemplateRequest {
  fromEmail?: string;
  fromName?: string;
  fromSubject?: string;
  templateHtml?: string;
  templateText?: string;
}

export interface MandrillTemplateStats {
  slug: string;
  name: string;
  sentCount: number;
  openCount: number;
  clickCount: number;
  bounceCount: number;
  complaintCount: number;
  createdAt: Date;
  updatedAt: Date;
}
