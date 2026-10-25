import type { ResourceMapper, IncludedMap, JsonApiResource } from '@23blocks/jsonapi-codec';
import type { Group, GroupInvitation, GroupMember } from '../types/index.js';
import { parseDate, parseString, parseNumber } from './utils.js';

/**
 * Group member mapper
 */
export const groupMemberMapper: ResourceMapper<GroupMember> = {
  type: 'group_member',

  map(resource: JsonApiResource, _included: IncludedMap): GroupMember {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      userUniqueId: parseString(attrs.user_unique_id),
      role: (attrs.role as GroupMember['role']) ?? 'member',
      status: (attrs.status as GroupMember['status']) ?? 'active',
      createdAt: parseDate(attrs.created_at),
      updatedAt: parseDate(attrs.updated_at),
    };
  },
};

/**
 * Group mapper
 */
export const groupMapper: ResourceMapper<Group> = {
  type: 'group',

  map(resource: JsonApiResource, included: IncludedMap): Group {
    const attrs = resource.attributes ?? {};

    const group: Group = {
      id: resource.id,
      uniqueId: resource.id,
      name: parseString(attrs.name),
      description: attrs.description ? parseString(attrs.description) : null,
      ownerUserId: parseString(attrs.owner_user_id),
      status: (attrs.status as Group['status']) ?? 'active',
      memberCount: parseNumber(attrs.member_count),
      createdAt: parseDate(attrs.created_at),
      updatedAt: parseDate(attrs.updated_at),
    };

    const memberRefs = resource.relationships?.['group_members']?.data ?? resource.relationships?.['members']?.data;
    if (Array.isArray(memberRefs)) {
      group.members = memberRefs
        .map((ref) => included.get(`${ref.type}:${ref.id}`))
        .filter((r): r is JsonApiResource => r !== undefined)
        .map((r) => groupMemberMapper.map(r, included));
    }

    return group;
  },
};

/**
 * Map a group invitation (plain JSON `{ data }`, snake_case)
 */
export function groupInvitationMapper(raw: Record<string, unknown>): GroupInvitation {
  return {
    id: parseString(raw['id']),
    email: parseString(raw['email']),
    role: (raw['role'] as GroupInvitation['role']) ?? 'member',
    expiresAt: parseDate(raw['expires_at']),
    invitedBy: raw['invited_by'] ? parseString(raw['invited_by']) : null,
  };
}
