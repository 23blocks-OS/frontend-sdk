import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Warehouse } from '../types/warehouse';
import { parseDate, parseStatus } from './utils';

export const warehouseMapper: ResourceMapper<Warehouse> = {
  type: 'warehouse',
  map: (resource) => ({
    id: resource.id,
    uniqueId: resource.attributes['unique_id'] as string,
    name: resource.attributes['name'] as string,
    description: resource.attributes['description'] as string | undefined,
    address: resource.attributes['address'] as string | undefined,
    city: resource.attributes['city'] as string | undefined,
    state: resource.attributes['state'] as string | undefined,
    country: resource.attributes['country'] as string | undefined,
    zipCode: resource.attributes['zip_code'] as string | undefined,
    latitude: resource.attributes['latitude'] as number | undefined,
    longitude: resource.attributes['longitude'] as number | undefined,
    status: parseStatus(resource.attributes['status'] as string | undefined),
    enabled: resource.attributes['enabled'] as boolean ?? true,
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
