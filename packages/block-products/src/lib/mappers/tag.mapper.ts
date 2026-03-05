import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Tag } from '../types/tag.js';
import { parseString, parseDate, parseBoolean, parseStatus } from './utils.js';

export const tagMapper: ResourceMapper<Tag> = {
  type: 'Tag',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) ?? '',
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    tag: parseString(resource.attributes['tag']) || '',
    thumbnailUrl: parseString(resource.attributes['thumbnail_url']),
    imageUrl: parseString(resource.attributes['image_url']),
    contentUrl: parseString(resource.attributes['content_url']),
    mediaUrl: parseString(resource.attributes['media_url']),
    metaTitle: parseString(resource.attributes['meta_title']),
    metaDescription: parseString(resource.attributes['meta_description']),
    metaKeywords: parseString(resource.attributes['meta_keywords']),
    slug: parseString(resource.attributes['slug']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
  }),
};
