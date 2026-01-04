import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { RegistrationToken } from '../types/registration-token';
import { parseString, parseDate, parseBoolean, parseStatus, parseNumber } from './utils';

export const registrationTokenMapper: ResourceMapper<RegistrationToken> = {
  type: 'registration_token',
  map: (resource) => ({
    uniqueId: resource.id,
    createdAt: parseDate(resource.attributes?.['created_at']) ?? new Date(),
    updatedAt: parseDate(resource.attributes?.['updated_at']) ?? new Date(),
    token: parseString(resource.attributes?.['token']) ?? '',
    courseUniqueId: parseString(resource.attributes?.['course_unique_id']),
    courseGroupUniqueId: parseString(resource.attributes?.['course_group_unique_id']),
    userRole: (parseString(resource.attributes?.['user_role']) as 'student' | 'teacher' | 'admin') ?? 'student',
    maxUses: resource.attributes?.['max_uses'] as number | undefined,
    usedCount: parseNumber(resource.attributes?.['used_count']),
    expiresAt: parseDate(resource.attributes?.['expires_at']),
    createdByUniqueId: parseString(resource.attributes?.['created_by_unique_id']),
    metadata: resource.attributes?.['metadata'] as Record<string, unknown> | undefined,
    status: parseStatus(resource.attributes?.['status']),
    enabled: parseBoolean(resource.attributes?.['enabled']),
  }),
};
