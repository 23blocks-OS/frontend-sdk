import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Form,
  CreateFormRequest,
  UpdateFormRequest,
  ListFormsParams,
} from '../types/form.js';
import { formMapper } from '../mappers/form.mapper.js';

export interface FormsService {
  list(params?: ListFormsParams): Promise<PageResult<Form>>;
  get(uniqueId: string): Promise<Form>;
  create(data: CreateFormRequest): Promise<Form>;
  update(uniqueId: string, data: UpdateFormRequest): Promise<Form>;
  delete(uniqueId: string): Promise<void>;
}

export function createFormsService(transport: Transport, _config: { apiKey: string }): FormsService {
  return {
    async list(params?: ListFormsParams): Promise<PageResult<Form>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.formType) queryParams['form_type'] = params.formType;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/forms', { params: queryParams });
      return decodePageResult(response, formMapper);
    },

    async get(uniqueId: string): Promise<Form> {
      const response = await transport.get<unknown>(`/forms/${uniqueId}`);
      return decodeOne(response, formMapper);
    },

    async create(data: CreateFormRequest): Promise<Form> {
      const response = await transport.post<unknown>('/forms', {
        form: {
          code: data.code,
          name: data.name,
          description: data.description,
          form_type: data.formType,
          form_url: data.formUrl,
          form_domain: data.formDomain,
          form_fields: data.formFields,
          only_once: data.onlyOnce,
          background_url: data.backgroundUrl,
          content_url: data.contentUrl,
          success_url: data.successUrl,
          error_url: data.errorUrl,
          notify_slack: data.notifySlack,
          success_notification_message: data.successNotificationMessage,
          error_notification_message: data.errorNotificationMessage,
          send_confirmation_mail: data.sendConfirmationMail,
          mail_template: data.mailTemplate,
          send_confirmation_sms: data.sendConfirmationSms,
          sms_template: data.smsTemplate,
          send_admin_notification: data.sendAdminNotification,
          admin_notification_email: data.adminNotificationEmail,
          admin_notification_template: data.adminNotificationTemplate,
          form_schema_unique_id: data.formSchemaUniqueId,
          require_otp_verification: data.requireOtpVerification,
          payload: data.payload,
        },
      });
      return decodeOne(response, formMapper);
    },

    async update(uniqueId: string, data: UpdateFormRequest): Promise<Form> {
      const response = await transport.put<unknown>(`/forms/${uniqueId}`, {
        form: {
          name: data.name,
          description: data.description,
          form_type: data.formType,
          status: data.status,
          form_url: data.formUrl,
          form_domain: data.formDomain,
          form_fields: data.formFields,
          only_once: data.onlyOnce,
          background_url: data.backgroundUrl,
          content_url: data.contentUrl,
          success_url: data.successUrl,
          error_url: data.errorUrl,
          notify_slack: data.notifySlack,
          success_notification_message: data.successNotificationMessage,
          error_notification_message: data.errorNotificationMessage,
          send_confirmation_mail: data.sendConfirmationMail,
          mail_template: data.mailTemplate,
          send_confirmation_sms: data.sendConfirmationSms,
          sms_template: data.smsTemplate,
          send_admin_notification: data.sendAdminNotification,
          admin_notification_email: data.adminNotificationEmail,
          admin_notification_template: data.adminNotificationTemplate,
          form_schema_unique_id: data.formSchemaUniqueId,
          require_otp_verification: data.requireOtpVerification,
          payload: data.payload,
        },
      });
      return decodeOne(response, formMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/forms/${uniqueId}`);
    },
  };
}
