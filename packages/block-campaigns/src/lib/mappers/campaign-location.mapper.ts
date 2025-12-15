import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { CampaignLocation } from '../types/campaign-location';
import { parseString, parseDate, parseOptionalNumber, parseStatus } from './utils';

export const campaignLocationMapper: ResourceMapper<CampaignLocation> = {
  type: 'CampaignLocation',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    campaignUniqueId: parseString(resource.attributes['campaign_unique_id']) || '',
    name: parseString(resource.attributes['name']) || '',
    locationType: parseString(resource.attributes['location_type']),
    address: parseString(resource.attributes['address']),
    city: parseString(resource.attributes['city']),
    state: parseString(resource.attributes['state']),
    country: parseString(resource.attributes['country']),
    postalCode: parseString(resource.attributes['postal_code']),
    latitude: parseOptionalNumber(resource.attributes['latitude']),
    longitude: parseOptionalNumber(resource.attributes['longitude']),
    radius: parseOptionalNumber(resource.attributes['radius']),
    radiusUnit: parseString(resource.attributes['radius_unit']),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
