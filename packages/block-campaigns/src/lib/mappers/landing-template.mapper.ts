import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { LandingTemplate } from '../types/landing-template';
import { parseString, parseDate, parseStatus } from './utils';

export const landingTemplateMapper: ResourceMapper<LandingTemplate> = {
  type: 'LandingTemplate',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    templateType: parseString(resource.attributes['template_type']),
    htmlContent: parseString(resource.attributes['html_content']),
    cssContent: parseString(resource.attributes['css_content']),
    jsContent: parseString(resource.attributes['js_content']),
    thumbnailUrl: parseString(resource.attributes['thumbnail_url']),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
