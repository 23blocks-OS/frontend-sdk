import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { EntityFile } from '../types/entity-file';
import { parseString, parseDate, parseBoolean, parseOptionalNumber, parseStatus } from './utils';

export const entityFileMapper: ResourceMapper<EntityFile> = {
  type: 'EntityFile',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    entityUniqueId: parseString(resource.attributes['entity_unique_id']) || '',
    entityType: parseString(resource.attributes['entity_type']) || '',
    fileUniqueId: parseString(resource.attributes['file_unique_id']) || '',
    fileName: parseString(resource.attributes['file_name']) || '',
    fileType: parseString(resource.attributes['file_type']),
    fileSize: parseOptionalNumber(resource.attributes['file_size']),
    mimeType: parseString(resource.attributes['mime_type']),
    contentUrl: parseString(resource.attributes['content_url']),
    thumbnailUrl: parseString(resource.attributes['thumbnail_url']),
    displayOrder: parseOptionalNumber(resource.attributes['display_order']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
