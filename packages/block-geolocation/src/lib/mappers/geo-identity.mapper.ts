import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { GeoIdentity } from '../types/geo-identity';
import { parseString, parseDate, parseStatus } from './utils';

export const geoIdentityMapper: ResourceMapper<GeoIdentity> = {
  type: 'user',
  map: (resource) => ({
    uniqueId: resource.id,
    name: parseString(resource.attributes['name']),
    email: parseString(resource.attributes['email']),
    phone: parseString(resource.attributes['phone']),
    avatarUrl: parseString(resource.attributes['avatar_url']),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
