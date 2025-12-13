import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Location } from '../types/location';
import { parseString, parseDate, parseBoolean, parseOptionalNumber, parseStatus } from './utils';

export const locationMapper: ResourceMapper<Location> = {
  type: 'Location',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    ownerUniqueId: parseString(resource.attributes['owner_unique_id']),
    ownerType: parseString(resource.attributes['owner_type']),
    code: parseString(resource.attributes['code']),
    name: parseString(resource.attributes['name']) || '',
    source: parseString(resource.attributes['source']),
    addressUniqueId: parseString(resource.attributes['address_unique_id']),
    areaUniqueId: parseString(resource.attributes['area_unique_id']),
    locationParentId: parseString(resource.attributes['location_parent_id']),
    latitude: parseOptionalNumber(resource.attributes['latitude']),
    longitude: parseOptionalNumber(resource.attributes['longitude']),
    qcode: parseString(resource.attributes['qcode']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    imageUrl: parseString(resource.attributes['image_url']),
    videoUrl: parseString(resource.attributes['video_url']),
    contentUrl: parseString(resource.attributes['content_url']),
    iconUrl: parseString(resource.attributes['icon_url']),
    locationType: parseString(resource.attributes['location_type']),
    regionUniqueId: parseString(resource.attributes['region_unique_id']),
    regionCode: parseString(resource.attributes['region_code']),
    regionName: parseString(resource.attributes['region_name']),
  }),
};
