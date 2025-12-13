import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { FileSchema } from '../types/file-schema';
import { parseString, parseDate, parseBoolean, parseOptionalNumber, parseStatus, parseStringArray } from './utils';

export const fileSchemaMapper: ResourceMapper<FileSchema> = {
  type: 'FileSchema',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    allowedMimeTypes: parseStringArray(resource.attributes['allowed_mime_types']),
    maxFileSize: parseOptionalNumber(resource.attributes['max_file_size']),
    required: parseBoolean(resource.attributes['required']),
    multiple: parseBoolean(resource.attributes['multiple']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
