import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Notification } from '../types/notification';
import { parseString, parseDate, parseBoolean, parseStatus } from './utils';

export const notificationMapper: ResourceMapper<Notification> = {
  type: 'Notification',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    content: parseString(resource.attributes['content']) || '',

    // Source
    source: parseString(resource.attributes['source']),
    sourceAlias: parseString(resource.attributes['source_alias']),
    sourceId: parseString(resource.attributes['source_id']),
    sourceType: parseString(resource.attributes['source_type']),

    // URL
    url: parseString(resource.attributes['url']),

    // Status
    status: parseStatus(resource.attributes['status']),

    // Target
    target: parseString(resource.attributes['target']),
    targetId: parseString(resource.attributes['target_id']),
    targetAlias: parseString(resource.attributes['target_alias']),
    targetType: parseString(resource.attributes['target_type']),
    targetEmail: parseString(resource.attributes['target_email']),
    targetPhone: parseString(resource.attributes['target_phone']),
    targetDeviceId: parseString(resource.attributes['target_device_id']),

    // Multichannel
    multichannel: parseBoolean(resource.attributes['multichannel']),

    // Extra data
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,

    // Expiration
    expiresAt: parseDate(resource.attributes['expires_at']),

    // Tracking
    createdBy: parseString(resource.attributes['created_by']),
    updatedBy: parseString(resource.attributes['updated_by']),
  }),
};
