import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Cluster } from '../types/cluster.js';
import { parseString, parseDate, parseBoolean } from './utils.js';

export const clusterMapper: ResourceMapper<Cluster> = {
  type: 'cluster',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || '',
    name: parseString(resource.attributes['name']) || '',
    reference: parseString(resource.attributes['reference']),
    description: parseString(resource.attributes['description']),
    userUniqueId: parseString(resource.attributes['user_unique_id']),
    abstract: parseString(resource.attributes['abstract']),
    keywords: parseString(resource.attributes['keywords']),
    content: parseString(resource.attributes['content']),
    contentUrl: parseString(resource.attributes['content_url']),
    thumbnailUrl: parseString(resource.attributes['thumbnail_url']),
    imageUrl: parseString(resource.attributes['image_url']),
    mediaUrl: parseString(resource.attributes['media_url']),
    source: parseString(resource.attributes['source']),
    sourceId: parseString(resource.attributes['source_id']),
    sourceType: parseString(resource.attributes['source_type']),
    sourceAlias: parseString(resource.attributes['source_alias']),
    tags: parseString(resource.attributes['tags']),
    members: parseString(resource.attributes['members']),
    status: parseString(resource.attributes['status']) || 'active',
    enabled: resource.attributes['enabled'] != null ? parseBoolean(resource.attributes['enabled']) : undefined,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),
  }),
};
