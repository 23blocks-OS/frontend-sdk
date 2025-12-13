import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Meeting } from '../types/meeting';
import { parseString, parseDate, parseBoolean, parseOptionalNumber, parseStatus } from './utils';

export const meetingMapper: ResourceMapper<Meeting> = {
  type: 'Meeting',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    code: parseString(resource.attributes['code']) || '',
    title: parseString(resource.attributes['title']) || '',
    meetingType: parseString(resource.attributes['meeting_type']),
    token: parseString(resource.attributes['token']),
    description: parseString(resource.attributes['description']),
    scheduledAt: parseDate(resource.attributes['scheduled_at']),
    startTime: parseDate(resource.attributes['start_time']),
    endTime: parseDate(resource.attributes['end_time']),
    timeUnit: parseString(resource.attributes['time_unit']),
    timeQuantity: parseOptionalNumber(resource.attributes['time_quantity']),
    allDay: parseBoolean(resource.attributes['all_day']),
    timezone: parseString(resource.attributes['timezone']),
    userUniqueId: parseString(resource.attributes['user_unique_id']),
    userName: parseString(resource.attributes['user_name']),
    userEmail: parseString(resource.attributes['user_email']),
    accountUniqueId: parseString(resource.attributes['account_unique_id']),
    meetingLocation: parseString(resource.attributes['meeting_location']),
    meetingUrl: parseString(resource.attributes['meeting_url']),
    meetingScore: parseOptionalNumber(resource.attributes['meeting_score']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
  }),
};
