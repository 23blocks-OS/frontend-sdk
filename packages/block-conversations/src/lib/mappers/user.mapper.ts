import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { ConversationsUser } from '../types/user';
import { parseString, parseDate } from './utils';

export const conversationsUserMapper: ResourceMapper<ConversationsUser> = {
  type: 'User',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),
    email: parseString(resource.attributes['email']),
    name: parseString(resource.attributes['name']),
    username: parseString(resource.attributes['username']),
    avatarUrl: parseString(resource.attributes['avatar_url']),
    status: parseString(resource.attributes['status']),
    lastSeenAt: parseDate(resource.attributes['last_seen_at']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
