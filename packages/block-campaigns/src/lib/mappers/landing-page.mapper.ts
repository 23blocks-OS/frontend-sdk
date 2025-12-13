import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { LandingPage } from '../types/landing-page';
import { parseString, parseDate, parseBoolean, parseOptionalNumber, parseStatus } from './utils';

export const landingPageMapper: ResourceMapper<LandingPage> = {
  type: 'LandingPage',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    campaignUniqueId: parseString(resource.attributes['campaign_unique_id']) || '',
    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    slug: parseString(resource.attributes['slug']) || '',
    templateUniqueId: parseString(resource.attributes['template_unique_id']),
    content: parseString(resource.attributes['content']),
    metaTitle: parseString(resource.attributes['meta_title']),
    metaDescription: parseString(resource.attributes['meta_description']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    visits: parseOptionalNumber(resource.attributes['visits']),
    conversions: parseOptionalNumber(resource.attributes['conversions']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
