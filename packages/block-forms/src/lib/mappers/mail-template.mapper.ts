import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { MailTemplate } from '../types/mail-template';
import { parseString, parseDate, parseStatus } from './utils';

export const mailTemplateMapper: ResourceMapper<MailTemplate> = {
  type: 'mail_template',
  map: (resource) => ({
    uniqueId: resource.id,
    name: parseString(resource.attributes['name']) ?? '',
    subject: parseString(resource.attributes['subject']) ?? '',
    htmlContent: parseString(resource.attributes['html_content']),
    textContent: parseString(resource.attributes['text_content']),
    provider: parseString(resource.attributes['provider']),
    providerTemplateId: parseString(resource.attributes['provider_template_id']),
    fromEmail: parseString(resource.attributes['from_email']),
    fromName: parseString(resource.attributes['from_name']),
    replyTo: parseString(resource.attributes['reply_to']),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
