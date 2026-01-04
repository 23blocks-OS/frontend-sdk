import type { ResourceMapper, JsonApiResource, IncludedMap } from '@23blocks/jsonapi-codec';
import type { Availability, CalendarEvent } from '../types/calendar';
import { parseString, parseDate, parseBoolean, parseNumber, parseStatus } from './utils';

export const availabilityMapper: ResourceMapper<Availability> = {
  type: 'Availability',
  map(resource: JsonApiResource, _included: IncludedMap): Availability {
    const attrs = resource.attributes ?? {};
    const userType = parseString(attrs.user_type) as Availability['userType'];
    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      userUniqueId: parseString(attrs.user_unique_id) ?? '',
      userType: userType ?? 'student',
      dayOfWeek: parseNumber(attrs.day_of_week),
      startTime: parseString(attrs.start_time) ?? '',
      endTime: parseString(attrs.end_time) ?? '',
      timezone: parseString(attrs.timezone),
      isRecurring: parseBoolean(attrs.is_recurring),
      effectiveFrom: parseDate(attrs.effective_from),
      effectiveUntil: parseDate(attrs.effective_until),
      status: parseStatus(attrs.status),
      createdAt: parseDate(attrs.created_at),
      updatedAt: parseDate(attrs.updated_at),
    };
  },
};

export const calendarEventMapper: ResourceMapper<CalendarEvent> = {
  type: 'CalendarEvent',
  map(resource: JsonApiResource, _included: IncludedMap): CalendarEvent {
    const attrs = resource.attributes ?? {};
    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      title: parseString(attrs.title) ?? '',
      description: parseString(attrs.description),
      eventType: parseString(attrs.event_type),
      startAt: parseDate(attrs.start_at) ?? new Date(),
      endAt: parseDate(attrs.end_at) ?? new Date(),
      allDay: parseBoolean(attrs.all_day),
      location: parseString(attrs.location),
      userUniqueId: parseString(attrs.user_unique_id),
      courseUniqueId: parseString(attrs.course_unique_id),
      courseGroupUniqueId: parseString(attrs.course_group_unique_id),
      recurrence: parseString(attrs.recurrence),
      timezone: parseString(attrs.timezone),
      status: parseStatus(attrs.status),
      payload: attrs.payload as Record<string, unknown> | undefined,
      createdAt: parseDate(attrs.created_at),
      updatedAt: parseDate(attrs.updated_at),
    };
  },
};
