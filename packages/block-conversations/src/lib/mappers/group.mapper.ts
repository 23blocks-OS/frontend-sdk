import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Group } from '../types/group';
import { parseString, parseDate, parseBoolean, parseStatus, parseStringArray } from './utils';

export const groupMapper: ResourceMapper<Group> = {
  type: 'Group',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    name: parseString(resource.attributes['name']) || '',
    code: parseString(resource.attributes['code']),
    uniqueCode: parseString(resource.attributes['unique_code']),
    qcode: parseString(resource.attributes['qcode']),
    groupType: parseString(resource.attributes['group_type']),

    // Members
    members: parseStringArray(resource.attributes['members']),

    // Status
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),

    // Source
    source: parseString(resource.attributes['source']),
    sourceAlias: parseString(resource.attributes['source_alias']),
    sourceId: parseString(resource.attributes['source_id']),
    sourceType: parseString(resource.attributes['source_type']),

    // Extra data
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
