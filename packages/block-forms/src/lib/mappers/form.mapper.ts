import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Form } from '../types/form.js';
import { parseString, parseDate, parseBoolean, parseStatus } from './utils.js';

export const formMapper: ResourceMapper<Form> = {
  type: 'Form',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']),
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    formType: parseString(resource.attributes['form_type']),
    status: parseStatus(resource.attributes['status']),
    formUrl: parseString(resource.attributes['form_url']),
    formDomain: parseString(resource.attributes['form_domain']),
    formFields: resource.attributes['form_fields'] as Record<string, unknown> | undefined,
    onlyOnce: resource.attributes['only_once'] !== undefined
      ? parseBoolean(resource.attributes['only_once'])
      : undefined,
    backgroundUrl: parseString(resource.attributes['background_url']),
    contentUrl: parseString(resource.attributes['content_url']),
    successUrl: parseString(resource.attributes['success_url']),
    errorUrl: parseString(resource.attributes['error_url']),
    notifySlack: resource.attributes['notify_slack'] !== undefined
      ? parseBoolean(resource.attributes['notify_slack'])
      : undefined,
    successNotificationMessage: parseString(resource.attributes['success_notification_message']),
    errorNotificationMessage: parseString(resource.attributes['error_notification_message']),
    sendConfirmationMail: resource.attributes['send_confirmation_mail'] !== undefined
      ? parseBoolean(resource.attributes['send_confirmation_mail'])
      : undefined,
    mailTemplate: parseString(resource.attributes['mail_template']),
    sendConfirmationSms: resource.attributes['send_confirmation_sms'] !== undefined
      ? parseBoolean(resource.attributes['send_confirmation_sms'])
      : undefined,
    smsTemplate: parseString(resource.attributes['sms_template']),
    sendAdminNotification: resource.attributes['send_admin_notification'] !== undefined
      ? parseBoolean(resource.attributes['send_admin_notification'])
      : undefined,
    adminNotificationEmail: parseString(resource.attributes['admin_notification_email']),
    adminNotificationTemplate: parseString(resource.attributes['admin_notification_template']),
    formSchemaUniqueId: parseString(resource.attributes['form_schema_unique_id']),
    requireOtpVerification: resource.attributes['require_otp_verification'] !== undefined
      ? parseBoolean(resource.attributes['require_otp_verification'])
      : undefined,
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
