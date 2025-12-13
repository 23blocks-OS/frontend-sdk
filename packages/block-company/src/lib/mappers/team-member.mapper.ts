import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { TeamMember } from '../types/team-member';
import { parseString, parseDate, parseBoolean, parseStatus } from './utils';

export const teamMemberMapper: ResourceMapper<TeamMember> = {
  type: 'TeamMember',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    teamUniqueId: parseString(resource.attributes['team_unique_id']) || '',
    userUniqueId: parseString(resource.attributes['user_unique_id']) || '',
    role: parseString(resource.attributes['role']),
    joinedAt: parseDate(resource.attributes['joined_at']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
