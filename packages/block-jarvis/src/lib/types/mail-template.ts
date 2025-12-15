export interface MailTemplate {
  id: string;
  uniqueId: string;
  code: string;
  name: string;
  subject: string;
  fromEmail?: string;
  fromName?: string;
  htmlContent?: string;
  textContent?: string;
  mandrillSlug?: string;
  enabled: boolean;
  status: string;
  payload?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMailTemplateRequest {
  code: string;
  name: string;
  subject: string;
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
  status?: string;
  payload?: Record<string, unknown>;
}

export interface ListMailTemplatesParams {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateMandrillTemplateRequest {
  slug?: string;
  labels?: string[];
  payload?: Record<string, unknown>;
}

export interface UpdateMandrillTemplateRequest {
  slug?: string;
  labels?: string[];
  payload?: Record<string, unknown>;
}

export interface MandrillStats {
  slug: string;
  sentCount: number;
  openCount: number;
  clickCount: number;
  hardBounceCount: number;
  softBounceCount: number;
  rejectCount: number;
  spamCount: number;
  unsubCount: number;
  lastSentAt?: Date;
}
