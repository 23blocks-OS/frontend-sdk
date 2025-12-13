import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Area } from '../types/area';
import { parseString, parseDate, parseBoolean, parseStatus, parseStringArray } from './utils';

export const areaMapper: ResourceMapper<Area> = {
  type: 'Area',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    code: parseString(resource.attributes['code']),
    name: parseString(resource.attributes['name']) || '',
    addressUniqueId: parseString(resource.attributes['address_unique_id']),
    source: parseString(resource.attributes['source']),
    areaType: parseString(resource.attributes['area_type']),
    areaPoints: parseString(resource.attributes['area_points']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    tags: parseStringArray(resource.attributes['tags']),
  }),
};
