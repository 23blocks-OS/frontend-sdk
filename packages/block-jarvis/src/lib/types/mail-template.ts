export interface MailTemplate {
  id: string;
  uniqueId: string;
  eventName?: string;
  name: string;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  templateName?: string;
  templateHtml?: string;
  templateText?: string;
  fromDomain?: string;
  fromAddress?: string;
  fromName?: string;
  fromSubject?: string;
  preferredLanguage?: string;
  provider?: string;
  status: string;
  enabled?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Matches mail_template_params in mail_templates_controller.rb */
export interface CreateMailTemplateRequest {
  eventName?: string;
  name: string;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  templateName?: string;
  templateHtml?: string;
  templateText?: string;
  fromDomain?: string;
  fromAddress?: string;
  fromName?: string;
  fromSubject?: string;
  preferredLanguage?: string;
  provider?: string;
}

export type UpdateMailTemplateRequest = CreateMailTemplateRequest;

export interface ListMailTemplatesParams {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/** Matches mandrill_params in mail_templates_controller.rb */
export interface CreateMandrillTemplateRequest {
  fromEmail?: string;
  fromName?: string;
  fromSubject?: string;
  templateHtml?: string;
  templateText?: string;
}

export type UpdateMandrillTemplateRequest = CreateMandrillTemplateRequest;
