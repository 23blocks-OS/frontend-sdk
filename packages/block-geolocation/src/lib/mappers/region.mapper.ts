import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Region } from '../types/region';
import { parseString, parseDate, parseBoolean, parseStatus, parseStringArray } from './utils';

export const regionMapper: ResourceMapper<Region> = {
  type: 'Region',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    name: parseString(resource.attributes['name']) || '',
    code: parseString(resource.attributes['code']),
    description: parseString(resource.attributes['description']),
    notes: parseString(resource.attributes['notes']),
    countryCode: parseString(resource.attributes['country_code']),
    countryName: parseString(resource.attributes['country_name']),
    imageUrl: parseString(resource.attributes['image_url']),
    contentUrl: parseString(resource.attributes['content_url']),
    mediaUrl: parseString(resource.attributes['media_url']),
    thumbnailUrl: parseString(resource.attributes['thumbnail_url']),
    iconUrl: parseString(resource.attributes['icon_url']),
    tags: parseStringArray(resource.attributes['tags']),
    source: parseString(resource.attributes['source']),
    sourceAlias: parseString(resource.attributes['source_alias']),
    sourceId: parseString(resource.attributes['source_id']),
    sourceType: parseString(resource.attributes['source_type']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    qcode: parseString(resource.attributes['qcode']),
  }),
};
