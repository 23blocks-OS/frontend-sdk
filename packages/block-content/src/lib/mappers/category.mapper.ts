import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Category } from '../types/category';
import { parseString, parseDate, parseBoolean, parseOptionalNumber, parseStatus } from './utils';

export const categoryMapper: ResourceMapper<Category> = {
  type: 'Category',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    parentId: parseString(resource.attributes['parent_id']),
    parentUniqueId: parseString(resource.attributes['parent_unique_id']),

    // Display
    displayOrder: parseOptionalNumber(resource.attributes['display_order']),
    iconUrl: parseString(resource.attributes['icon_url']),
    imageUrl: parseString(resource.attributes['image_url']),
    contentUrl: parseString(resource.attributes['content_url']),
    slug: parseString(resource.attributes['slug']),

    // Business Logic
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),

    // SEO
    metaTitle: parseString(resource.attributes['meta_title']),
    metaDescription: parseString(resource.attributes['meta_description']),
    metaKeywords: parseString(resource.attributes['meta_keywords']),

    // Source
    source: parseString(resource.attributes['source']),
    sourceAlias: parseString(resource.attributes['source_alias']),
    sourceId: parseString(resource.attributes['source_id']),
    sourceType: parseString(resource.attributes['source_type']),

    // Extra
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    postCount: parseOptionalNumber(resource.attributes['post_count']),
  }),
};
