import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { CampaignTemplate, TemplateDetail } from '../types/campaign-template';
import { parseString, parseDate, parseBoolean, parseOptionalNumber, parseStatus } from './utils';

export const campaignTemplateMapper: ResourceMapper<CampaignTemplate> = {
  type: 'Template',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    templateType: parseString(resource.attributes['template_type']),
    category: parseString(resource.attributes['category']),
    content: parseString(resource.attributes['content']),
    thumbnailUrl: parseString(resource.attributes['thumbnail_url']),
    isPublic: parseBoolean(resource.attributes['is_public']),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};

export const templateDetailMapper: ResourceMapper<TemplateDetail> = {
  type: 'TemplateDetail',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    templateUniqueId: parseString(resource.attributes['template_unique_id']) || '',
    name: parseString(resource.attributes['name']) || '',
    fieldType: parseString(resource.attributes['field_type']),
    defaultValue: parseString(resource.attributes['default_value']),
    isRequired: parseBoolean(resource.attributes['is_required']),
    sortOrder: parseOptionalNumber(resource.attributes['sort_order']),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
