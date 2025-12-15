import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { SearchIdentity } from '../types/identity.js';
import { parseString, parseDate } from './utils.js';

function parseStatus(value: unknown): 'active' | 'inactive' | 'pending' | 'archived' | 'deleted' {
  const status = parseString(value);
  if (status === 'active' || status === 'inactive' || status === 'pending' || status === 'archived' || status === 'deleted') {
    return status;
  }
  return 'active';
}

export const searchIdentityMapper: ResourceMapper<SearchIdentity> = {
  type: 'identity',
  map: (resource) => ({
    uniqueId: resource.id,
    userUniqueId: parseString(resource.attributes['user_unique_id']) ?? undefined,
    email: parseString(resource.attributes['email']) ?? undefined,
    firstName: parseString(resource.attributes['first_name']) ?? undefined,
    lastName: parseString(resource.attributes['last_name']) ?? undefined,
    displayName: parseString(resource.attributes['display_name']) ?? undefined,
    avatarUrl: parseString(resource.attributes['avatar_url']) ?? undefined,
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']) ?? undefined,
    updatedAt: parseDate(resource.attributes['updated_at']) ?? undefined,
  }),
};
