import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { CampaignTarget } from '../types/campaign-target';
import { parseString, parseDate, parseOptionalNumber, parseStatus } from './utils';

export const campaignTargetMapper: ResourceMapper<CampaignTarget> = {
  type: 'CampaignTarget',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    campaignUniqueId: parseString(resource.attributes['campaign_unique_id']) || '',
    name: parseString(resource.attributes['name']) || '',
    targetType: parseString(resource.attributes['target_type']),
    targetValue: parseString(resource.attributes['target_value']),
    priority: parseOptionalNumber(resource.attributes['priority']),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
