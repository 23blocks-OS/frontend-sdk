import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { AssetsEntity } from '../types/entity';
import { parseDate, parseStatus } from './utils';

export const assetsEntityMapper: ResourceMapper<AssetsEntity> = {
  type: 'entity',
  map: (resource) => ({
    id: resource.id,
    uniqueId: resource.attributes['unique_id'] as string,
    name: resource.attributes['name'] as string,
    description: resource.attributes['description'] as string | undefined,
    entityType: resource.attributes['entity_type'] as string | undefined,
    status: parseStatus(resource.attributes['status'] as string | undefined),
    enabled: resource.attributes['enabled'] as boolean ?? true,
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
