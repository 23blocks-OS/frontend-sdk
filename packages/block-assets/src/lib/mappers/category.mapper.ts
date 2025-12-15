import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Category } from '../types/category';
import { parseDate, parseStatus } from './utils';

export const categoryMapper: ResourceMapper<Category> = {
  type: 'category',
  map: (resource) => ({
    id: resource.id,
    uniqueId: resource.attributes['unique_id'] as string,
    name: resource.attributes['name'] as string,
    description: resource.attributes['description'] as string | undefined,
    parentUniqueId: resource.attributes['parent_unique_id'] as string | undefined,
    status: parseStatus(resource.attributes['status'] as string | undefined),
    enabled: resource.attributes['enabled'] as boolean ?? true,
    imageUrl: resource.attributes['image_url'] as string | undefined,
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
