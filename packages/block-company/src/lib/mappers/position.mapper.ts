import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Position } from '../types/position';
import { parseString, parseDate, parseBoolean, parseStatus, parseNumber } from './utils';

export const positionMapper: ResourceMapper<Position> = {
  type: 'Position',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    departmentUniqueId: parseString(resource.attributes['department_unique_id']),
    level: parseNumber(resource.attributes['level']),
    reportsToUniqueId: parseString(resource.attributes['reports_to_unique_id']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
