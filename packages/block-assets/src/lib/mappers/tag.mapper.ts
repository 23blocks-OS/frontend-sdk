import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Tag } from '../types/tag';
import { parseDate } from './utils';

export const tagMapper: ResourceMapper<Tag> = {
  type: 'tag',
  map: (resource) => ({
    id: resource.id,
    uniqueId: resource.attributes['unique_id'] as string,
    name: resource.attributes['name'] as string,
    description: resource.attributes['description'] as string | undefined,
    color: resource.attributes['color'] as string | undefined,
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
