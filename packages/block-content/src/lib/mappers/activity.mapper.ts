import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Activity, ActivityType } from '../types/activity';
import { parseString, parseDate, parseStatus, parseBoolean } from './utils';

export const activityMapper: ResourceMapper<Activity> = {
  type: 'activity',
  map: (resource) => ({
    uniqueId: resource.id,
    createdAt: parseDate(resource.attributes?.['created_at']) ?? new Date(),
    updatedAt: parseDate(resource.attributes?.['updated_at']) ?? new Date(),
    activityType: (parseString(resource.attributes?.['activity_type']) as ActivityType) ?? 'post_created',
    actorUniqueId: parseString(resource.attributes?.['actor_unique_id']) ?? '',
    actorName: parseString(resource.attributes?.['actor_name']),
    actorAvatarUrl: parseString(resource.attributes?.['actor_avatar_url']),
    targetType: (parseString(resource.attributes?.['target_type']) as 'post' | 'comment' | 'user') ?? 'post',
    targetUniqueId: parseString(resource.attributes?.['target_unique_id']) ?? '',
    targetTitle: parseString(resource.attributes?.['target_title']),
    targetPreview: parseString(resource.attributes?.['target_preview']),
    relatedUniqueId: parseString(resource.attributes?.['related_unique_id']),
    relatedType: parseString(resource.attributes?.['related_type']),
    metadata: resource.attributes?.['metadata'] as Record<string, unknown> | undefined,
    status: parseStatus(resource.attributes?.['status']),
    enabled: parseBoolean(resource.attributes?.['enabled']),
  }),
};
