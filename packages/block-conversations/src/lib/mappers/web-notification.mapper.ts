import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { WebNotification } from '../types/web-notification';
import { parseString, parseDate, parseBoolean, parseStatus, parseStringArray } from './utils';

function parsePriority(value: unknown): 'low' | 'normal' | 'high' | 'urgent' {
  const priority = parseString(value);
  if (priority === 'low' || priority === 'normal' || priority === 'high' || priority === 'urgent') {
    return priority;
  }
  return 'normal';
}

export const webNotificationMapper: ResourceMapper<WebNotification> = {
  type: 'WebNotification',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    recipientUniqueId: parseString(resource.attributes['recipient_unique_id']) || '',
    title: parseString(resource.attributes['title']) || '',
    body: parseString(resource.attributes['body']) || '',
    icon: parseString(resource.attributes['icon']),
    imageUrl: parseString(resource.attributes['image_url']),
    actionUrl: parseString(resource.attributes['action_url']),
    notificationType: parseString(resource.attributes['notification_type']) || 'general',
    priority: parsePriority(resource.attributes['priority']),
    sentAt: parseDate(resource.attributes['sent_at']),
    readAt: parseDate(resource.attributes['read_at']),
    clickedAt: parseDate(resource.attributes['clicked_at']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    tags: parseStringArray(resource.attributes['tags']),
  }),
};
