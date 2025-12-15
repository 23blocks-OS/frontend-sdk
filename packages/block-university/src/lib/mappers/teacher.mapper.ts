import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Teacher } from '../types/teacher';
import { parseString, parseDate, parseStatus } from './utils';

export const teacherMapper: ResourceMapper<Teacher> = {
  type: 'teacher',
  map: (resource) => ({
    uniqueId: resource.id,
    userUniqueId: parseString(resource.attributes['user_unique_id']),
    email: parseString(resource.attributes['email']),
    firstName: parseString(resource.attributes['first_name']),
    lastName: parseString(resource.attributes['last_name']),
    displayName: parseString(resource.attributes['display_name']),
    avatarUrl: parseString(resource.attributes['avatar_url']),
    bio: parseString(resource.attributes['bio']),
    specialization: parseString(resource.attributes['specialization']),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
