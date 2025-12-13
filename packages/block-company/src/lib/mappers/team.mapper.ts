import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Team } from '../types/team';
import { parseString, parseDate, parseBoolean, parseStatus } from './utils';

export const teamMapper: ResourceMapper<Team> = {
  type: 'Team',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    departmentUniqueId: parseString(resource.attributes['department_unique_id']) || '',
    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    leaderUniqueId: parseString(resource.attributes['leader_unique_id']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
