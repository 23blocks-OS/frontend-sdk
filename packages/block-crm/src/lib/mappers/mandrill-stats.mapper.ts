import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { MandrillTemplateStats } from '../types/mail-template.js';
import { parseString, parseDate, parseNumber } from './utils.js';

export const mandrillStatsMapper: ResourceMapper<MandrillTemplateStats> = {
  type: 'mandrill_stats',
  map: (resource) => ({
    slug: parseString(resource.attributes['slug']) || '',
    name: parseString(resource.attributes['name']) || '',
    sentCount: parseNumber(resource.attributes['sent_count']),
    openCount: parseNumber(resource.attributes['open_count']),
    clickCount: parseNumber(resource.attributes['click_count']),
    bounceCount: parseNumber(resource.attributes['bounce_count']),
    complaintCount: parseNumber(resource.attributes['complaint_count']),
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
