import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { CategoryImage } from '../types/category-image.js';
import { parseString, parseDate, parseBoolean, parseOptionalNumber, parseStatus } from './utils.js';

export const categoryImageMapper: ResourceMapper<CategoryImage> = {
  type: 'CategoryImage',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) ?? '',
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    categoryUniqueId: parseString(resource.attributes['category_unique_id']) || '',
    name: parseString(resource.attributes['name']),
    url: parseString(resource.attributes['url']),
    thumbnail: parseString(resource.attributes['thumbnail']),
    fileType: parseString(resource.attributes['file_type']),
    fileSize: parseOptionalNumber(resource.attributes['file_size']),
    description: parseString(resource.attributes['description']),
    originalName: parseString(resource.attributes['original_name']),
    isPublic: parseBoolean(resource.attributes['is_public']),
    isMainImage: parseBoolean(resource.attributes['is_main_image']),
    aiEnabled: parseBoolean(resource.attributes['ai_enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
  }),
};
