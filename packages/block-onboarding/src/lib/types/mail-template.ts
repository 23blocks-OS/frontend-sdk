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
  code: string;
  name: string;
  subject?: string;
  fromEmail?: string;
  fromName?: string;
  htmlContent?: string;
  textContent?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateMailTemplateRequest {
  name?: string;
  subject?: string;
  fromEmail?: string;
  fromName?: string;
  htmlContent?: string;
  textContent?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListMailTemplatesParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  search?: string;
}

export interface CreateMandrillTemplateRequest {
  name: string;
  fromEmail?: string;
  fromName?: string;
  subject?: string;
  code?: string;
  text?: string;
  publish?: boolean;
  labels?: string[];
}

export interface UpdateMandrillTemplateRequest {
  fromEmail?: string;
  fromName?: string;
  subject?: string;
  code?: string;
  text?: string;
  publish?: boolean;
  labels?: string[];
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
