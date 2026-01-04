import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { LocationIdentity } from '../types/location-identity';
import { parseString, parseDate, parseBoolean, parseStatus, parseOptionalNumber } from './utils';

export const locationIdentityMapper: ResourceMapper<LocationIdentity> = {
  type: 'LocationIdentity',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    locationUniqueId: parseString(resource.attributes['location_unique_id']) || '',
    identityUniqueId: parseString(resource.attributes['identity_unique_id']) || '',
    identityType: parseString(resource.attributes['identity_type']) || '',
    role: parseString(resource.attributes['role']),
    checkedInAt: parseDate(resource.attributes['checked_in_at']),
    checkedOutAt: parseDate(resource.attributes['checked_out_at']),
    lastSeenAt: parseDate(resource.attributes['last_seen_at']),
    isPresent: parseBoolean(resource.attributes['is_present']),
    deviceId: parseString(resource.attributes['device_id']),
    deviceType: parseString(resource.attributes['device_type']),
    accuracy: parseOptionalNumber(resource.attributes['accuracy']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
