import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { FormInstance } from '../types/form-instance';
import { parseString, parseDate, parseBoolean, parseNumber, parseStatus } from './utils';

export const formInstanceMapper: ResourceMapper<FormInstance> = {
  type: 'FormInstance',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    formSchemaUniqueId: parseString(resource.attributes['form_schema_unique_id']) || '',
    formSchemaVersion: parseNumber(resource.attributes['form_schema_version']),
    userUniqueId: parseString(resource.attributes['user_unique_id']),
    data: (resource.attributes['data'] as Record<string, unknown>) || {},
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    submittedAt: parseDate(resource.attributes['submitted_at']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
