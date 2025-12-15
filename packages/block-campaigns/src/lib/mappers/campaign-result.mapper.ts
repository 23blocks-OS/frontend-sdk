import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { CampaignResult } from '../types/campaign-result';
import { parseString, parseDate, parseOptionalNumber, parseStatus } from './utils';

export const campaignResultMapper: ResourceMapper<CampaignResult> = {
  type: 'CampaignResult',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    campaignUniqueId: parseString(resource.attributes['campaign_unique_id']) || '',
    date: parseDate(resource.attributes['date']),
    impressions: parseOptionalNumber(resource.attributes['impressions']),
    clicks: parseOptionalNumber(resource.attributes['clicks']),
    conversions: parseOptionalNumber(resource.attributes['conversions']),
    spend: parseOptionalNumber(resource.attributes['spend']),
    revenue: parseOptionalNumber(resource.attributes['revenue']),
    ctr: parseOptionalNumber(resource.attributes['ctr']),
    conversionRate: parseOptionalNumber(resource.attributes['conversion_rate']),
    costPerClick: parseOptionalNumber(resource.attributes['cost_per_click']),
    costPerConversion: parseOptionalNumber(resource.attributes['cost_per_conversion']),
    roi: parseOptionalNumber(resource.attributes['roi']),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
