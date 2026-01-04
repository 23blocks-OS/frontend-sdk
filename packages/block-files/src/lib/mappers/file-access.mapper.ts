import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { FileAccess } from '../types/file-access';
import { parseString, parseDate, parseBoolean, parseStatus, parseNumber } from './utils';

function parseAccessLevel(value: unknown): 'read' | 'write' | 'admin' {
  const level = parseString(value);
  if (level === 'read' || level === 'write' || level === 'admin') {
    return level;
  }
  return 'read';
}

export const fileAccessMapper: ResourceMapper<FileAccess> = {
  type: 'FileAccess',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    fileUniqueId: parseString(resource.attributes['file_unique_id']) || '',
    granteeUniqueId: parseString(resource.attributes['grantee_unique_id']) || '',
    granteeType: parseString(resource.attributes['grantee_type']) || '',
    accessLevel: parseAccessLevel(resource.attributes['access_level']),
    grantedByUniqueId: parseString(resource.attributes['granted_by_unique_id']) || '',
    expiresAt: parseDate(resource.attributes['expires_at']),
    accessedAt: parseDate(resource.attributes['accessed_at']),
    accessCount: parseNumber(resource.attributes['access_count']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
