import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { JarvisUser } from '../types/user';
import { parseDate } from './utils';

export const jarvisUserMapper: ResourceMapper<JarvisUser> = {
  type: 'user',
  map: (resource) => ({
    id: resource.id,
    uniqueId: resource.attributes?.['unique_id'] as string,
    email: resource.attributes?.['email'] as string | undefined,
    name: resource.attributes?.['name'] as string | undefined,
    username: resource.attributes?.['username'] as string | undefined,
    avatarUrl: resource.attributes?.['avatar_url'] as string | undefined,
    status: resource.attributes?.['status'] as string,
    payload: resource.attributes?.['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes?.['created_at']),
    updatedAt: parseDate(resource.attributes?.['updated_at']),
  }),
};
