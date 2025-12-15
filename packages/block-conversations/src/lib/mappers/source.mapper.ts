import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Source } from '../types/source';
import { parseString, parseDate } from './utils';

export const sourceMapper: ResourceMapper<Source> = {
  type: 'Source',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),
    name: parseString(resource.attributes['name']),
    sourceType: parseString(resource.attributes['source_type']),
    externalId: parseString(resource.attributes['external_id']),
    status: parseString(resource.attributes['status']),
    metadata: resource.attributes['metadata'] as Record<string, unknown> | undefined,
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
