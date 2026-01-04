import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { PremiseEvent } from '../types/premise-event';
import { parseString, parseDate, parseBoolean, parseStatus, parseOptionalNumber, parseStringArray } from './utils';

export const premiseEventMapper: ResourceMapper<PremiseEvent> = {
  type: 'PremiseEvent',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    premiseUniqueId: parseString(resource.attributes['premise_unique_id']) || '',
    locationUniqueId: parseString(resource.attributes['location_unique_id']),
    eventType: parseString(resource.attributes['event_type']) || '',
    title: parseString(resource.attributes['title']) || '',
    description: parseString(resource.attributes['description']),
    startTime: parseDate(resource.attributes['start_time']) || new Date(),
    endTime: parseDate(resource.attributes['end_time']),
    allDay: parseBoolean(resource.attributes['all_day']),
    recurrence: parseString(resource.attributes['recurrence']),
    organizerUniqueId: parseString(resource.attributes['organizer_unique_id']),
    capacity: parseOptionalNumber(resource.attributes['capacity']),
    attendeeCount: parseOptionalNumber(resource.attributes['attendee_count']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    tags: parseStringArray(resource.attributes['tags']),
  }),
};
