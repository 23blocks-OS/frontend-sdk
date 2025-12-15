import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Appointment } from '../types/appointment';
import { parseString, parseDate, parseStatus, parseOptionalNumber } from './utils';

export const appointmentMapper: ResourceMapper<Appointment> = {
  type: 'appointment',
  map: (resource) => ({
    uniqueId: resource.id,
    formUniqueId: parseString(resource.attributes['form_unique_id']) ?? '',
    userUniqueId: parseString(resource.attributes['user_unique_id']),
    email: parseString(resource.attributes['email']),
    firstName: parseString(resource.attributes['first_name']),
    lastName: parseString(resource.attributes['last_name']),
    phone: parseString(resource.attributes['phone']),
    scheduledAt: parseDate(resource.attributes['scheduled_at']) ?? new Date(),
    duration: parseOptionalNumber(resource.attributes['duration']),
    timezone: parseString(resource.attributes['timezone']),
    location: parseString(resource.attributes['location']),
    notes: parseString(resource.attributes['notes']),
    data: (resource.attributes['data'] as Record<string, unknown>) ?? {},
    status: parseStatus(resource.attributes['status']),
    confirmedAt: parseDate(resource.attributes['confirmed_at']),
    cancelledAt: parseDate(resource.attributes['cancelled_at']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
