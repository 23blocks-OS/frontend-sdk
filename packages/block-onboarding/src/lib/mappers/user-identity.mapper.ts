import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { UserIdentity } from '../types/user-identity';
import { parseString, parseDate, parseBoolean, parseStatus } from './utils';

export const userIdentityMapper: ResourceMapper<UserIdentity> = {
  type: 'UserIdentity',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    userUniqueId: parseString(resource.attributes['user_unique_id']) || '',
    identityType: parseString(resource.attributes['identity_type']) || '',
    identityValue: parseString(resource.attributes['identity_value']) || '',
    verified: parseBoolean(resource.attributes['verified']),
    verifiedAt: parseDate(resource.attributes['verified_at']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
