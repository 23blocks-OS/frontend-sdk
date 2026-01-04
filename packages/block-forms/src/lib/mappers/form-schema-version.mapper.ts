import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { FormSchemaVersion } from '../types/form-schema-version';
import { parseString, parseDate, parseBoolean, parseNumber, parseStatus } from './utils';

export const formSchemaVersionMapper: ResourceMapper<FormSchemaVersion> = {
  type: 'FormSchemaVersion',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    formUniqueId: parseString(resource.attributes['form_unique_id']) || '',
    schemaUniqueId: parseString(resource.attributes['schema_unique_id']) || '',
    version: parseNumber(resource.attributes['version']),
    schema: (resource.attributes['schema'] as Record<string, unknown>) || {},
    uiSchema: resource.attributes['ui_schema'] as Record<string, unknown> | undefined,
    status: parseStatus(resource.attributes['status']),
    isPublished: parseBoolean(resource.attributes['is_published']),
    publishedAt: parseString(resource.attributes['published_at']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
