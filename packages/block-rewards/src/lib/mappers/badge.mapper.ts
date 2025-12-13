import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Badge, UserBadge } from '../types/badge';
import { parseString, parseDate, parseBoolean, parseStatus } from './utils';

export const badgeMapper: ResourceMapper<Badge> = {
  type: 'Badge',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    imageUrl: parseString(resource.attributes['image_url']),
    criteria: resource.attributes['criteria'] as Record<string, unknown> | undefined,
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};

export const userBadgeMapper: ResourceMapper<UserBadge> = {
  type: 'UserBadge',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    badgeUniqueId: parseString(resource.attributes['badge_unique_id']) || '',
    badgeCode: parseString(resource.attributes['badge_code']) || '',
    badgeName: parseString(resource.attributes['badge_name']) || '',
    badgeImageUrl: parseString(resource.attributes['badge_image_url']),
    userUniqueId: parseString(resource.attributes['user_unique_id']) || '',
    awardedAt: parseDate(resource.attributes['awarded_at']) || new Date(),
    reason: parseString(resource.attributes['reason']),
    metadata: resource.attributes['metadata'] as Record<string, unknown> | undefined,
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
