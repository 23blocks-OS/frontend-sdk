import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Landing } from '../types/landing';
import { parseString, parseDate, parseStatus } from './utils';

export const landingMapper: ResourceMapper<Landing> = {
  type: 'landing_instance',
  map: (resource) => ({
    uniqueId: resource.id,
    formUniqueId: parseString(resource.attributes['form_unique_id']) ?? '',
    userUniqueId: parseString(resource.attributes['user_unique_id']),
    email: parseString(resource.attributes['email']),
    firstName: parseString(resource.attributes['first_name']),
    lastName: parseString(resource.attributes['last_name']),
    phone: parseString(resource.attributes['phone']),
    company: parseString(resource.attributes['company']),
    data: (resource.attributes['data'] as Record<string, unknown>) ?? {},
    status: parseStatus(resource.attributes['status']),
    token: parseString(resource.attributes['token']),
    submittedAt: parseDate(resource.attributes['submitted_at']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
