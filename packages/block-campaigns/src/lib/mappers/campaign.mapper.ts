import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Campaign } from '../types/campaign';
import { parseString, parseDate, parseBoolean, parseOptionalNumber, parseStatus } from './utils';

export const campaignMapper: ResourceMapper<Campaign> = {
  type: 'Campaign',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    campaignType: parseString(resource.attributes['campaign_type']),
    startDate: parseDate(resource.attributes['start_date']),
    endDate: parseDate(resource.attributes['end_date']),
    budget: parseOptionalNumber(resource.attributes['budget']),
    spent: parseOptionalNumber(resource.attributes['spent']),
    targetAudience: parseString(resource.attributes['target_audience']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
