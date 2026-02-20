import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Form extends IdentityCore {
  code: string;
  name: string;
  description?: string;
  formType?: string;
  status: EntityStatus;
  formUrl?: string;
  formDomain?: string;
  formFields?: Record<string, unknown>;
  onlyOnce?: boolean;
  backgroundUrl?: string;
  contentUrl?: string;
  successUrl?: string;
  errorUrl?: string;
  notifySlack?: boolean;
  successNotificationMessage?: string;
  errorNotificationMessage?: string;
  sendConfirmationMail?: boolean;
  mailTemplate?: string;
  sendConfirmationSms?: boolean;
  smsTemplate?: string;
  sendAdminNotification?: boolean;
  adminNotificationEmail?: string;
  adminNotificationTemplate?: string;
  formSchemaUniqueId?: string;
  requireOtpVerification?: boolean;
  payload?: Record<string, unknown>;
}

export interface CreateFormRequest {
  code: string;
  name: string;
  description?: string;
  formType?: string;
  formUrl?: string;
  formDomain?: string;
  formFields?: Record<string, unknown>;
  onlyOnce?: boolean;
  backgroundUrl?: string;
  contentUrl?: string;
  successUrl?: string;
  errorUrl?: string;
  notifySlack?: boolean;
  successNotificationMessage?: string;
  errorNotificationMessage?: string;
  sendConfirmationMail?: boolean;
  mailTemplate?: string;
  sendConfirmationSms?: boolean;
  smsTemplate?: string;
  sendAdminNotification?: boolean;
  adminNotificationEmail?: string;
  adminNotificationTemplate?: string;
  formSchemaUniqueId?: string;
  requireOtpVerification?: boolean;
  payload?: Record<string, unknown>;
}

export interface UpdateFormRequest {
  name?: string;
  description?: string;
  formType?: string;
  status?: EntityStatus;
  formUrl?: string;
  formDomain?: string;
  formFields?: Record<string, unknown>;
  onlyOnce?: boolean;
  backgroundUrl?: string;
  contentUrl?: string;
  successUrl?: string;
  errorUrl?: string;
  notifySlack?: boolean;
  successNotificationMessage?: string;
  errorNotificationMessage?: string;
  sendConfirmationMail?: boolean;
  mailTemplate?: string;
  sendConfirmationSms?: boolean;
  smsTemplate?: string;
  sendAdminNotification?: boolean;
  adminNotificationEmail?: string;
  adminNotificationTemplate?: string;
  formSchemaUniqueId?: string;
  requireOtpVerification?: boolean;
  payload?: Record<string, unknown>;
}

export interface ListFormsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  formType?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
