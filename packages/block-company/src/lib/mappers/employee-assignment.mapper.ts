import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { EmployeeAssignment } from '../types/employee-assignment';
import { parseString, parseDate, parseBoolean, parseStatus } from './utils';

export const employeeAssignmentMapper: ResourceMapper<EmployeeAssignment> = {
  type: 'EmployeeAssignment',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    userUniqueId: parseString(resource.attributes['user_unique_id']) || '',
    positionUniqueId: parseString(resource.attributes['position_unique_id']) || '',
    departmentUniqueId: parseString(resource.attributes['department_unique_id']),
    teamUniqueId: parseString(resource.attributes['team_unique_id']),
    startDate: parseDate(resource.attributes['start_date']),
    endDate: parseDate(resource.attributes['end_date']),
    isPrimary: parseBoolean(resource.attributes['is_primary']) ?? false,
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
