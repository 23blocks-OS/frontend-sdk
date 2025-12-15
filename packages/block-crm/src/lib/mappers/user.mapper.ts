import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { CrmUser } from '../types/user';
import { parseDate, parseStatus } from './utils';

export const crmUserMapper: ResourceMapper<CrmUser> = {
  type: 'user',
  map: (resource) => ({
    id: resource.id,
    uniqueId: resource.attributes['unique_id'] as string,
    email: resource.attributes['email'] as string,
    name: resource.attributes['name'] as string | undefined,
    phone: resource.attributes['phone'] as string | undefined,
    status: parseStatus(resource.attributes['status'] as string | undefined),
    enabled: resource.attributes['enabled'] as boolean ?? true,
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
