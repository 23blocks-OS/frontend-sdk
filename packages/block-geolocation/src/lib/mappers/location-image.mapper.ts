import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { LocationImage } from '../types/location-image';
import { parseString, parseDate, parseStatus, parseOptionalNumber, parseBoolean } from './utils';

export const locationImageMapper: ResourceMapper<LocationImage> = {
  type: 'location_image',
  map: (resource) => ({
    uniqueId: resource.id,
    locationUniqueId: parseString(resource.attributes['location_unique_id']) ?? '',
    url: parseString(resource.attributes['url']) ?? '',
    thumbnailUrl: parseString(resource.attributes['thumbnail_url']),
    caption: parseString(resource.attributes['caption']),
    altText: parseString(resource.attributes['alt_text']),
    sortOrder: parseOptionalNumber(resource.attributes['sort_order']),
    isPrimary: parseBoolean(resource.attributes['is_primary']),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
