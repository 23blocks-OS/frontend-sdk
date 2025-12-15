import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Context } from '../types/context';
import { parseString, parseDate } from './utils';

export const contextMapper: ResourceMapper<Context> = {
  type: 'Context',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),
    name: parseString(resource.attributes['name']),
    description: parseString(resource.attributes['description']),
    contextType: parseString(resource.attributes['context_type']),
    status: parseString(resource.attributes['status']),
    metadata: resource.attributes['metadata'] as Record<string, unknown> | undefined,
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
