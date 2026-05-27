import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { UserFile } from '../types/user-file.js';

export const userFileMapper: ResourceMapper<UserFile> = {
  type: 'file',
  map: (resource, _included) => {
    const a = resource.attributes;
    return {
      id: resource.id,
      uniqueId: String(a['unique_id'] ?? ''),
      userUniqueId: String(a['user_unique_id'] ?? ''),
      name: String(a['name'] ?? ''),
      fileType: String(a['file_type'] ?? ''),
      fileSize: Number(a['file_size'] ?? 0),
      url: a['url'] as string | undefined,
      thumbnailUrl: a['thumbnail_url'] as string | undefined,
      mediaUrl: a['media_url'] as string | undefined,
      contentUrl: a['content_url'] as string | undefined,
      imageUrl: a['image_url'] as string | undefined,
      description: a['description'] as string | undefined,
      originalName: a['original_name'] as string | undefined,
      originalFile: a['original_file'] as string | undefined,
      virtualFolder: a['virtual_folder'] as string | undefined,
      categoryName: a['category_name'] as string | undefined,
      categoryUniqueId: a['category_unique_id'] as string | undefined,
      tags: a['tags'] as string | undefined,
      isPublic: Boolean(a['is_public'] ?? false),
      accessLevel: a['access_level'] as string | undefined,
      aiEnabled: a['ai_enabled'] as boolean | undefined,
      isTemp: a['is_temp'] as boolean | undefined,
      rawContent: a['raw_content'] as string | undefined,
      content: a['content'] as string | undefined,
      fileStructure: a['file_structure'] as string | undefined,
      metadata: a['metadata'] as Record<string, unknown> | undefined,
      structuredContent: a['structured_content'] as Record<string, unknown> | undefined,
      schemaModel: a['schema_model'] as string | undefined,
      isExpirable: a['is_expirable'] as boolean | undefined,
      issuedAt: a['issued_at'] as string | undefined,
      expiresAt: a['expires_at'] as string | undefined,
      issuedBy: a['issued_by'] as string | undefined,
      status: (a['status'] as UserFile['status']) ?? 'active',
      createdAt: a['created_at'] ? new Date(a['created_at'] as string) : new Date(),
      updatedAt: a['updated_at'] ? new Date(a['updated_at'] as string) : new Date(),
    };
  },
};
