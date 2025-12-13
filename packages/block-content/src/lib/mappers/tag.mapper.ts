import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Tag } from '../types/tag';
import { parseString, parseDate, parseBoolean, parseStatus } from './utils';

export const tagMapper: ResourceMapper<Tag> = {
  type: 'Tag',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    tag: parseString(resource.attributes['tag']) || '',
    thumbnailUrl: parseString(resource.attributes['thumbnail_url']),
    imageUrl: parseString(resource.attributes['image_url']),
    contentUrl: parseString(resource.attributes['content_url']),
    mediaUrl: parseString(resource.attributes['media_url']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    slug: parseString(resource.attributes['slug']),
  }),
};
