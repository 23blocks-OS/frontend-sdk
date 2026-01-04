import type { ResourceMapper, JsonApiResource, IncludedMap } from '@23blocks/jsonapi-codec';
import type { GroupInvite } from '../types/group-invite';
import { parseString, parseDate, parseNumber, parseStatus } from './utils';

export const groupInviteMapper: ResourceMapper<GroupInvite> = {
  type: 'GroupInvite',
  map(resource: JsonApiResource, _included: IncludedMap): GroupInvite {
    const attrs = resource.attributes ?? {};
    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      groupUniqueId: parseString(attrs.group_unique_id) ?? '',
      code: parseString(attrs.code) ?? '',
      inviterUniqueId: parseString(attrs.inviter_unique_id),
      maxUses: attrs.max_uses != null ? parseNumber(attrs.max_uses) : undefined,
      usesCount: attrs.uses_count != null ? parseNumber(attrs.uses_count) : undefined,
      expiresAt: parseDate(attrs.expires_at),
      status: parseStatus(attrs.status),
      createdAt: parseDate(attrs.created_at),
      updatedAt: parseDate(attrs.updated_at),
    };
  },
};
