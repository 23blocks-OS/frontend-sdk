import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { FileCategory } from '../types/file-category';
import { parseString, parseDate, parseBoolean, parseStatus, parseOptionalNumber } from './utils';

export const fileCategoryMapper: ResourceMapper<FileCategory> = {
  type: 'FileCategory',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    parentUniqueId: parseString(resource.attributes['parent_unique_id']),
    color: parseString(resource.attributes['color']),
    icon: parseString(resource.attributes['icon']),
    sortOrder: parseOptionalNumber(resource.attributes['sort_order']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
