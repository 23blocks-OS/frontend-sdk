import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Category } from '../types/category.js';
import { parseString, parseDate, parseBoolean, parseOptionalNumber, parseStatus } from './utils.js';

export const categoryMapper: ResourceMapper<Category> = {
  type: 'Category',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']),
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    // Core fields from API
    code: parseString(resource.attributes['code']),
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),

    // Hierarchy
    parentId: parseString(resource.attributes['parent_id']),

    // Display
    displayOrder: parseOptionalNumber(resource.attributes['display_order']),
    imageUrl: parseString(resource.attributes['image_url']),
    contentUrl: parseString(resource.attributes['content_url']),

    // Business Logic
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),

    // Extra
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    postCount: parseOptionalNumber(resource.attributes['post_count']),
  }),
};
