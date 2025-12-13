import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { CampaignMedia } from '../types/campaign-media';
import { parseString, parseDate, parseBoolean, parseOptionalNumber, parseStatus } from './utils';

export const campaignMediaMapper: ResourceMapper<CampaignMedia> = {
  type: 'CampaignMedia',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    campaignUniqueId: parseString(resource.attributes['campaign_unique_id']) || '',
    mediaType: parseString(resource.attributes['media_type']),
    name: parseString(resource.attributes['name']) || '',
    contentUrl: parseString(resource.attributes['content_url']),
    thumbnailUrl: parseString(resource.attributes['thumbnail_url']),
    clickUrl: parseString(resource.attributes['click_url']),
    impressions: parseOptionalNumber(resource.attributes['impressions']),
    clicks: parseOptionalNumber(resource.attributes['clicks']),
    conversions: parseOptionalNumber(resource.attributes['conversions']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
