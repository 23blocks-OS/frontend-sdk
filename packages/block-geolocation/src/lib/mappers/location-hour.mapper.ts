import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { LocationHour } from '../types/location-hour';
import { parseString, parseDate, parseStatus, parseNumber, parseBoolean } from './utils';

export const locationHourMapper: ResourceMapper<LocationHour> = {
  type: 'location_hour',
  map: (resource) => ({
    uniqueId: resource.id,
    locationUniqueId: parseString(resource.attributes['location_unique_id']) ?? '',
    dayOfWeek: parseNumber(resource.attributes['day_of_week']),
    openTime: parseString(resource.attributes['open_time']) ?? '',
    closeTime: parseString(resource.attributes['close_time']) ?? '',
    isClosed: parseBoolean(resource.attributes['is_closed']),
    isAllDay: parseBoolean(resource.attributes['is_all_day']),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
