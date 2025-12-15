import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { CampaignMarket } from '../types/campaign-market';
import { parseString, parseDate, parseOptionalNumber, parseStatus } from './utils';

export const campaignMarketMapper: ResourceMapper<CampaignMarket> = {
  type: 'CampaignMarket',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    campaignUniqueId: parseString(resource.attributes['campaign_unique_id']) || '',
    name: parseString(resource.attributes['name']) || '',
    marketCode: parseString(resource.attributes['market_code']),
    region: parseString(resource.attributes['region']),
    country: parseString(resource.attributes['country']),
    language: parseString(resource.attributes['language']),
    currency: parseString(resource.attributes['currency']),
    timezone: parseString(resource.attributes['timezone']),
    budget: parseOptionalNumber(resource.attributes['budget']),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
