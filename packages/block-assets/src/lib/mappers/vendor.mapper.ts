import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Vendor } from '../types/vendor';
import { parseDate, parseStatus } from './utils';

export const vendorMapper: ResourceMapper<Vendor> = {
  type: 'vendor',
  map: (resource) => ({
    id: resource.id,
    uniqueId: resource.attributes['unique_id'] as string,
    name: resource.attributes['name'] as string,
    description: resource.attributes['description'] as string | undefined,
    email: resource.attributes['email'] as string | undefined,
    phone: resource.attributes['phone'] as string | undefined,
    address: resource.attributes['address'] as string | undefined,
    status: parseStatus(resource.attributes['status'] as string | undefined),
    enabled: resource.attributes['enabled'] as boolean ?? true,
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
