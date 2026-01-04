import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { FileDelegation } from '../types/delegation';
import { parseString, parseDate, parseBoolean, parseStatus, parseStringArray } from './utils';

export const fileDelegationMapper: ResourceMapper<FileDelegation> = {
  type: 'FileDelegation',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    delegatorUniqueId: parseString(resource.attributes['delegator_unique_id']) || '',
    delegateeUniqueId: parseString(resource.attributes['delegatee_unique_id']) || '',
    fileUniqueId: parseString(resource.attributes['file_unique_id']),
    folderUniqueId: parseString(resource.attributes['folder_unique_id']),
    permissions: parseStringArray(resource.attributes['permissions']) || [],
    expiresAt: parseDate(resource.attributes['expires_at']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
