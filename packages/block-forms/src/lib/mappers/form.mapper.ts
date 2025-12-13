import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Form } from '../types/form';
import { parseString, parseDate, parseBoolean, parseStatus } from './utils';

export const formMapper: ResourceMapper<Form> = {
  type: 'Form',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    formType: parseString(resource.attributes['form_type']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
