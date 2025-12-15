import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { LocationSlot } from '../types/location-slot';
import { parseString, parseDate, parseStatus, parseOptionalNumber, parseBoolean } from './utils';

export const locationSlotMapper: ResourceMapper<LocationSlot> = {
  type: 'location_slot',
  map: (resource) => ({
    uniqueId: resource.id,
    locationUniqueId: parseString(resource.attributes['location_unique_id']) ?? '',
    name: parseString(resource.attributes['name']),
    startTime: parseString(resource.attributes['start_time']) ?? '',
    endTime: parseString(resource.attributes['end_time']) ?? '',
    duration: parseOptionalNumber(resource.attributes['duration']),
    capacity: parseOptionalNumber(resource.attributes['capacity']),
    availableCapacity: parseOptionalNumber(resource.attributes['available_capacity']),
    price: parseOptionalNumber(resource.attributes['price']),
    dayOfWeek: parseOptionalNumber(resource.attributes['day_of_week']),
    isRecurring: parseBoolean(resource.attributes['is_recurring']),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
