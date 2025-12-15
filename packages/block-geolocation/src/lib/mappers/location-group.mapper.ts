import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { LocationGroup } from '../types/location-group';
import { parseString, parseDate, parseStatus } from './utils';

export const locationGroupMapper: ResourceMapper<LocationGroup> = {
  type: 'location_group',
  map: (resource) => ({
    uniqueId: resource.id,
    name: parseString(resource.attributes['name']) ?? '',
    description: parseString(resource.attributes['description']),
    code: parseString(resource.attributes['code']),
    parentUniqueId: parseString(resource.attributes['parent_unique_id']),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
