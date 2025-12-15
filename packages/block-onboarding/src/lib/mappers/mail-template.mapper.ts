import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { MailTemplate } from '../types/mail-template';
import { parseDate, parseStatus } from './utils';

export const mailTemplateMapper: ResourceMapper<MailTemplate> = {
  type: 'mail_template',
  map: (resource) => ({
    id: resource.id,
    uniqueId: resource.attributes['unique_id'] as string,
    code: resource.attributes['code'] as string,
    name: resource.attributes['name'] as string,
    subject: resource.attributes['subject'] as string | undefined,
    fromEmail: resource.attributes['from_email'] as string | undefined,
    fromName: resource.attributes['from_name'] as string | undefined,
    htmlContent: resource.attributes['html_content'] as string | undefined,
    textContent: resource.attributes['text_content'] as string | undefined,
    mandrillSlug: resource.attributes['mandrill_slug'] as string | undefined,
    status: parseStatus(resource.attributes['status'] as string | undefined),
    enabled: resource.attributes['enabled'] as boolean ?? true,
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
