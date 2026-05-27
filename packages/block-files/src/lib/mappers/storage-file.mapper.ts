import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { StorageFile } from '../types/storage-file.js';
import { parseString, parseDate, parseBoolean, parseOptionalNumber, parseStatus, parseStringArray } from './utils.js';

export const storageFileMapper: ResourceMapper<StorageFile> = {
  type: 'storage_file',
  map: (resource) => {
    const a = resource.attributes;
    return {
      id: resource.id,
      uniqueId: parseString(a['unique_id']),
      createdAt: parseDate(a['created_at']) || new Date(),
      updatedAt: parseDate(a['updated_at']) || new Date(),

      name: parseString(a['name']) || '',
      fileType: parseString(a['file_type']),
      fileSize: parseOptionalNumber(a['file_size']),
      url: parseString(a['url']),
      thumbnailUrl: parseString(a['thumbnail_url']),
      mediaUrl: parseString(a['media_url']),
      imageUrl: parseString(a['image_url']),
      contentUrl: parseString(a['content_url']),
      description: parseString(a['description']),
      originalName: parseString(a['original_name']),
      originalFile: parseString(a['original_file']),
      virtualFolder: parseString(a['virtual_folder']),
      categoryName: parseString(a['category_name']),
      categoryUniqueId: parseString(a['category_unique_id']),
      isPublic: parseBoolean(a['is_public']),
      accessLevel: parseString(a['access_level']),
      aiEnabled: parseBoolean(a['ai_enabled']),
      isTemp: parseBoolean(a['is_temp']),
      rawContent: parseString(a['raw_content']),
      content: parseString(a['content']),
      fileStructure: parseString(a['file_structure']),
      metadata: a['metadata'] as Record<string, unknown> | undefined,
      structuredContent: a['structured_content'] as Record<string, unknown> | undefined,
      schemaModel: parseString(a['schema_model']),
      vectorDB: parseString(a['vectorDB']),
      isExpirable: parseBoolean(a['is_expirable']),
      issuedAt: parseString(a['issued_at']),
      expiresAt: parseString(a['expires_at']),
      issuedBy: parseString(a['issued_by']),
      status: parseStatus(a['status']),
      enabled: parseBoolean(a['enabled']),
      tags: parseStringArray(a['tags']),
      createdBy: parseString(a['created_by']),
      updatedBy: parseString(a['updated_by']),
    };
  },
};
