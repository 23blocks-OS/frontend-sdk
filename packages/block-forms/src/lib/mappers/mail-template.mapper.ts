import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { MailTemplate } from '../types/mail-template.js';
import { parseString, parseDate, parseStatus } from './utils.js';

export const mailTemplateMapper: ResourceMapper<MailTemplate> = {
  type: 'mail_template',
  map: (resource) => ({
    id: resource.id,
    uniqueId: resource.id,
    name: parseString(resource.attributes['name']) ?? '',
    eventName: parseString(resource.attributes['event_name']),
    fromSubject: parseString(resource.attributes['from_subject']),
    templateHtml: parseString(resource.attributes['template_html']),
    templateText: parseString(resource.attributes['template_text']),
    templateName: parseString(resource.attributes['template_name']),
    fromAddress: parseString(resource.attributes['from_address']),
    fromDomain: parseString(resource.attributes['from_domain']),
    fromName: parseString(resource.attributes['from_name']),
    provider: parseString(resource.attributes['provider']),
    source: parseString(resource.attributes['source']),
    sourceAlias: parseString(resource.attributes['source_alias']),
    sourceId: parseString(resource.attributes['source_id']),
    sourceType: parseString(resource.attributes['source_type']),
    preferredLanguage: parseString(resource.attributes['preferred_language']),
    key: parseString(resource.attributes['key']),
    secret: parseString(resource.attributes['secret']),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
