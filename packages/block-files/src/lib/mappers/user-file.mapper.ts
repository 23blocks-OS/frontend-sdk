import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { UserFile } from '../types/user-file.js';

export const userFileMapper: ResourceMapper<UserFile> = {
  type: 'file',
  map: (resource, _included) => ({
    id: resource.id,
    uniqueId: String(resource.attributes['unique_id'] ?? ''),
    userUniqueId: String(resource.attributes['user_unique_id'] ?? ''),
    fileName: String(resource.attributes['file_name'] ?? ''),
    fileType: String(resource.attributes['file_type'] ?? ''),
    fileSize: Number(resource.attributes['file_size'] ?? 0),
    mimeType: resource.attributes['mime_type'] as string | undefined,
    url: resource.attributes['url'] as string | undefined,
    thumbnailUrl: resource.attributes['thumbnail_url'] as string | undefined,
    schemaUniqueId: resource.attributes['schema_unique_id'] as string | undefined,
    status: (resource.attributes['status'] as UserFile['status']) ?? 'active',
    isPublic: Boolean(resource.attributes['is_public'] ?? false),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: resource.attributes['created_at'] ? new Date(resource.attributes['created_at'] as string) : new Date(),
    updatedAt: resource.attributes['updated_at'] ? new Date(resource.attributes['updated_at'] as string) : new Date(),
  }),
};
