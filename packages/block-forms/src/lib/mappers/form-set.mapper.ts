import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { FormSet, FormReference } from '../types/form-set';
import { parseString, parseDate, parseBoolean, parseStatus } from './utils';

export const formSetMapper: ResourceMapper<FormSet> = {
  type: 'FormSet',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    forms: (resource.attributes['forms'] as FormReference[]) || [],
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
