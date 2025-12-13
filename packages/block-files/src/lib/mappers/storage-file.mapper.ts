import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { StorageFile } from '../types/storage-file';
import { parseString, parseDate, parseBoolean, parseOptionalNumber, parseStatus, parseStringArray } from './utils';

export const storageFileMapper: ResourceMapper<StorageFile> = {
  type: 'StorageFile',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    ownerUniqueId: parseString(resource.attributes['owner_unique_id']) || '',
    ownerType: parseString(resource.attributes['owner_type']) || '',
    fileName: parseString(resource.attributes['file_name']) || '',
    fileType: parseString(resource.attributes['file_type']),
    fileSize: parseOptionalNumber(resource.attributes['file_size']),
    mimeType: parseString(resource.attributes['mime_type']),
    contentUrl: parseString(resource.attributes['content_url']),
    thumbnailUrl: parseString(resource.attributes['thumbnail_url']),
    previewUrl: parseString(resource.attributes['preview_url']),
    downloadUrl: parseString(resource.attributes['download_url']),
    storagePath: parseString(resource.attributes['storage_path']),
    storageProvider: parseString(resource.attributes['storage_provider']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    tags: parseStringArray(resource.attributes['tags']),
    createdBy: parseString(resource.attributes['created_by']),
    updatedBy: parseString(resource.attributes['updated_by']),
  }),
};
