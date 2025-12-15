import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { SearchEntity } from '../types/entity.js';
import { parseString, parseDate, parseBoolean } from './utils.js';

function parseStatus(value: unknown): 'active' | 'inactive' | 'pending' | 'archived' | 'deleted' {
  const status = parseString(value);
  if (status === 'active' || status === 'inactive' || status === 'pending' || status === 'archived' || status === 'deleted') {
    return status;
  }
  return 'active';
}

export const searchEntityMapper: ResourceMapper<SearchEntity> = {
  type: 'entity',
  map: (resource) => ({
    uniqueId: resource.id,
    entityType: parseString(resource.attributes['entity_type']) ?? '',
    alias: parseString(resource.attributes['alias']) ?? undefined,
    description: parseString(resource.attributes['description']) ?? undefined,
    avatarUrl: parseString(resource.attributes['avatar_url']) ?? undefined,
    url: parseString(resource.attributes['url']) ?? undefined,
    source: parseString(resource.attributes['source']) ?? undefined,
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']) ?? undefined,
    updatedAt: parseDate(resource.attributes['updated_at']) ?? undefined,
  }),
};
