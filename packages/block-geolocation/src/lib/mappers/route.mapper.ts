import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { TravelRoute } from '../types/route';
import { parseString, parseDate, parseBoolean, parseStatus, parseStringArray } from './utils';

export const travelRouteMapper: ResourceMapper<TravelRoute> = {
  type: 'TravelRoute',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    code: parseString(resource.attributes['code']),
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    ownerUniqueId: parseString(resource.attributes['owner_unique_id']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    tags: parseStringArray(resource.attributes['tags']),
  }),
};
