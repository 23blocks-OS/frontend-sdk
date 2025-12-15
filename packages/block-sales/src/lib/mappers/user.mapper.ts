import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { SalesUser } from '../types/user';
import { parseDate } from './utils';

export const salesUserMapper: ResourceMapper<SalesUser> = {
  type: 'user',
  map: (resource) => ({
    id: resource.id,
    uniqueId: resource.attributes?.['unique_id'] as string,
    email: resource.attributes?.['email'] as string | undefined,
    name: resource.attributes?.['name'] as string | undefined,
    phone: resource.attributes?.['phone'] as string | undefined,
    status: resource.attributes?.['status'] as string,
    payload: resource.attributes?.['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes?.['created_at']),
    updatedAt: parseDate(resource.attributes?.['updated_at']),
  }),
};
