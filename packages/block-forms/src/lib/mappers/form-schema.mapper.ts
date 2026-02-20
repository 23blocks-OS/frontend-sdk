import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { FormSchema } from '../types/form-schema.js';
import { parseString, parseDate, parseBoolean, parseStatus } from './utils.js';

export const formSchemaMapper: ResourceMapper<FormSchema> = {
  type: 'FormSchema',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']),
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    formUniqueId: parseString(resource.attributes['form_unique_id']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    formFields: resource.attributes['form_fields'] as Record<string, unknown> | undefined,
    datasource: resource.attributes['datasource'] as Record<string, unknown> | undefined,
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
