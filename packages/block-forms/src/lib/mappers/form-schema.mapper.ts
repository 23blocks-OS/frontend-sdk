import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { FormSchema } from '../types/form-schema';
import { parseString, parseDate, parseBoolean, parseNumber, parseStatus } from './utils';

export const formSchemaMapper: ResourceMapper<FormSchema> = {
  type: 'FormSchema',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    formUniqueId: parseString(resource.attributes['form_unique_id']) || '',
    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    version: parseNumber(resource.attributes['version']),
    schema: (resource.attributes['schema'] as Record<string, unknown>) || {},
    uiSchema: resource.attributes['ui_schema'] as Record<string, unknown> | undefined,
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
