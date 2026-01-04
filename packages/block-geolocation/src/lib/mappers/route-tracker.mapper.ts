import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { RouteLocation } from '../types/route-tracker';
import { parseString, parseDate, parseBoolean, parseStatus, parseNumber, parseOptionalNumber } from './utils';

export const routeLocationMapper: ResourceMapper<RouteLocation> = {
  type: 'RouteLocation',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    routeUniqueId: parseString(resource.attributes['route_unique_id']) || '',
    userUniqueId: parseString(resource.attributes['user_unique_id']) || '',
    latitude: parseNumber(resource.attributes['latitude']),
    longitude: parseNumber(resource.attributes['longitude']),
    accuracy: parseOptionalNumber(resource.attributes['accuracy']),
    altitude: parseOptionalNumber(resource.attributes['altitude']),
    speed: parseOptionalNumber(resource.attributes['speed']),
    heading: parseOptionalNumber(resource.attributes['heading']),
    timestamp: parseDate(resource.attributes['timestamp']) || new Date(),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
