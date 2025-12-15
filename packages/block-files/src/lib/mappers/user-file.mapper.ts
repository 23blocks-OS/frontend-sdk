import type { JsonApiResourceMapper } from '@23blocks/jsonapi-codec';
import type { UserFile } from '../types/user-file';

export const userFileMapper: JsonApiResourceMapper<UserFile> = {
  type: 'file',
  map: (data: Record<string, unknown>): UserFile => ({
    id: String(data['id'] ?? ''),
    uniqueId: String(data['unique_id'] ?? ''),
    userUniqueId: String(data['user_unique_id'] ?? ''),
    fileName: String(data['file_name'] ?? ''),
    fileType: String(data['file_type'] ?? ''),
    fileSize: Number(data['file_size'] ?? 0),
    mimeType: data['mime_type'] as string | undefined,
    url: data['url'] as string | undefined,
    thumbnailUrl: data['thumbnail_url'] as string | undefined,
    schemaUniqueId: data['schema_unique_id'] as string | undefined,
    status: (data['status'] as UserFile['status']) ?? 'active',
    isPublic: Boolean(data['is_public'] ?? false),
    payload: data['payload'] as Record<string, unknown> | undefined,
    createdAt: data['created_at'] ? new Date(data['created_at'] as string) : new Date(),
    updatedAt: data['updated_at'] ? new Date(data['updated_at'] as string) : new Date(),
  }),
};
