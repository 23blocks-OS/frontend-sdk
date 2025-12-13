import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Audience, AudienceMember } from '../types/audience';
import { parseString, parseDate, parseBoolean, parseOptionalNumber, parseStatus } from './utils';

export const audienceMapper: ResourceMapper<Audience> = {
  type: 'Audience',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    criteria: resource.attributes['criteria'] as Record<string, unknown> | undefined,
    memberCount: parseOptionalNumber(resource.attributes['member_count']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};

export const audienceMemberMapper: ResourceMapper<AudienceMember> = {
  type: 'AudienceMember',
  map: (resource) => ({
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    audienceUniqueId: parseString(resource.attributes['audience_unique_id']) || '',
    userUniqueId: parseString(resource.attributes['user_unique_id']),
    email: parseString(resource.attributes['email']),
    name: parseString(resource.attributes['name']),
    addedAt: parseDate(resource.attributes['added_at']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
