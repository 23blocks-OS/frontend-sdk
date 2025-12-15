import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { CampaignMediaResult } from '../types/campaign-media-result';
import { parseString, parseDate, parseOptionalNumber, parseStatus } from './utils';

export const campaignMediaResultMapper: ResourceMapper<CampaignMediaResult> = {
  type: 'CampaignMediaResult',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    campaignMediaUniqueId: parseString(resource.attributes['campaign_media_unique_id']) || '',
    date: parseDate(resource.attributes['date']),
    impressions: parseOptionalNumber(resource.attributes['impressions']),
    clicks: parseOptionalNumber(resource.attributes['clicks']),
    conversions: parseOptionalNumber(resource.attributes['conversions']),
    views: parseOptionalNumber(resource.attributes['views']),
    engagement: parseOptionalNumber(resource.attributes['engagement']),
    spend: parseOptionalNumber(resource.attributes['spend']),
    revenue: parseOptionalNumber(resource.attributes['revenue']),
    ctr: parseOptionalNumber(resource.attributes['ctr']),
    viewRate: parseOptionalNumber(resource.attributes['view_rate']),
    engagementRate: parseOptionalNumber(resource.attributes['engagement_rate']),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
