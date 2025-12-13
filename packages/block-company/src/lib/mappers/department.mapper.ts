import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Department } from '../types/department';
import { parseString, parseDate, parseBoolean, parseStatus } from './utils';

export const departmentMapper: ResourceMapper<Department> = {
  type: 'Department',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    companyUniqueId: parseString(resource.attributes['company_unique_id']) || '',
    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    parentUniqueId: parseString(resource.attributes['parent_unique_id']),
    managerUniqueId: parseString(resource.attributes['manager_unique_id']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
