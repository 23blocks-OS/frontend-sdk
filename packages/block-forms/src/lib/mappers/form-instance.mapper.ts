import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { FormInstance } from '../types/form-instance.js';
import { parseString, parseDate, parseStatus } from './utils.js';

export const formInstanceMapper: ResourceMapper<FormInstance> = {
  type: 'FormInstance',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']),
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    formUniqueId: parseString(resource.attributes['form_unique_id']),
    userUniqueId: parseString(resource.attributes['user_unique_id']),
    assignedToUniqueId: parseString(resource.attributes['assigned_to_unique_id']),
    assignedToEmail: parseString(resource.attributes['assigned_to_email']),
    assignedToName: parseString(resource.attributes['assigned_to_name']),
    assignedByName: parseString(resource.attributes['assigned_by_name']),
    expiresAt: parseDate(resource.attributes['expires_at']),
    responses: resource.attributes['responses'] as unknown[] | undefined,
    metadata: resource.attributes['metadata'] as Record<string, unknown> | undefined,
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
