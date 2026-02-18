import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { JarvisUser } from '../types/user.js';
import { parseString, parseDate, parseBoolean, parseOptionalNumber } from './utils.js';

export const jarvisUserMapper: ResourceMapper<JarvisUser> = {
  type: 'user',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || '',
    name: parseString(resource.attributes['name']),
    firstName: parseString(resource.attributes['first_name']),
    lastName: parseString(resource.attributes['last_name']),
    email: parseString(resource.attributes['email']),
    phone: parseString(resource.attributes['phone']),
    avatarUrl: parseString(resource.attributes['avatar_url']),
    roleName: parseString(resource.attributes['role_name']),
    roleUniqueId: parseString(resource.attributes['role_unique_id']),
    timeZone: parseString(resource.attributes['time_zone']),
    preferredLanguage: parseString(resource.attributes['preferred_language']),
    maxFileSize: parseOptionalNumber(resource.attributes['max_file_size']),
    maxStorage: parseOptionalNumber(resource.attributes['max_storage']),
    status: parseString(resource.attributes['status']) || 'active',
    enabled: resource.attributes['enabled'] != null ? parseBoolean(resource.attributes['enabled']) : undefined,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),
  }),
};
