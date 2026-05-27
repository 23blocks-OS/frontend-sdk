import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { EntityFile } from '../types/entity-file.js';
import { parseString, parseDate, parseBoolean, parseOptionalNumber, parseStatus } from './utils.js';

export const entityFileMapper: ResourceMapper<EntityFile> = {
  type: 'entity_file',
  map: (resource) => {
    const a = resource.attributes;
    return {
      id: resource.id,
      uniqueId: parseString(a['unique_id']),
      createdAt: parseDate(a['created_at']) || new Date(),
      updatedAt: parseDate(a['updated_at']) || new Date(),

      entityUniqueId: parseString(a['entity_unique_id']) || '',
      entityType: parseString(a['entity_type']),
      fileUniqueId: parseString(a['file_unique_id']),
      name: parseString(a['name']),
      originalName: parseString(a['original_name']),
      url: parseString(a['url']),
      thumbnailUrl: parseString(a['thumbnail_url']),
      mediaUrl: parseString(a['media_url']),
      contentUrl: parseString(a['content_url']),
      imageUrl: parseString(a['image_url']),
      fileType: parseString(a['file_type']),
      fileSize: parseOptionalNumber(a['file_size']),
      description: parseString(a['description']),
      displayOrder: parseOptionalNumber(a['display_order']),
      status: parseStatus(a['status']),
      enabled: parseBoolean(a['enabled']),
    };
  },
};
