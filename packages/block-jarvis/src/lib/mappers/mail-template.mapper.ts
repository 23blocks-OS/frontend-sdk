import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { MailTemplate } from '../types/mail-template.js';
import { parseString, parseDate, parseBoolean } from './utils.js';

export const mailTemplateMapper: ResourceMapper<MailTemplate> = {
  type: 'mail_template',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || '',
    eventName: parseString(resource.attributes['event_name']),
    name: parseString(resource.attributes['name']) || '',
    source: parseString(resource.attributes['source']),
    sourceAlias: parseString(resource.attributes['source_alias']),
    sourceId: parseString(resource.attributes['source_id']),
    sourceType: parseString(resource.attributes['source_type']),
    templateName: parseString(resource.attributes['template_name']),
    templateHtml: parseString(resource.attributes['template_html']),
    templateText: parseString(resource.attributes['template_text']),
    fromDomain: parseString(resource.attributes['from_domain']),
    fromAddress: parseString(resource.attributes['from_address']),
    fromName: parseString(resource.attributes['from_name']),
    fromSubject: parseString(resource.attributes['from_subject']),
    preferredLanguage: parseString(resource.attributes['preferred_language']),
    provider: parseString(resource.attributes['provider']),
    status: parseString(resource.attributes['status']) || 'active',
    enabled: resource.attributes['enabled'] != null ? parseBoolean(resource.attributes['enabled']) : undefined,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),
  }),
};
