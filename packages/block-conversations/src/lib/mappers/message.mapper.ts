import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Message } from '../types/message';
import { parseString, parseDate, parseBoolean, parseOptionalNumber, parseStatus, parseStringArray } from './utils';

export const messageMapper: ResourceMapper<Message> = {
  type: 'Message',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    contextId: parseString(resource.attributes['context_id']),
    parentId: parseString(resource.attributes['parent_id']),
    content: parseString(resource.attributes['content']) || '',

    // Source (sender)
    source: parseString(resource.attributes['source']),
    sourceId: parseString(resource.attributes['source_id']),
    sourceAlias: parseString(resource.attributes['source_alias']),
    sourceEmail: parseString(resource.attributes['source_email']),
    sourcePhone: parseString(resource.attributes['source_phone']),
    sourceType: parseString(resource.attributes['source_type']),

    // Target (recipient)
    target: parseString(resource.attributes['target']),
    targetId: parseString(resource.attributes['target_id']),
    targetAlias: parseString(resource.attributes['target_alias']),
    targetEmail: parseString(resource.attributes['target_email']),
    targetPhone: parseString(resource.attributes['target_phone']),
    targetType: parseString(resource.attributes['target_type']),
    targetDeviceId: parseString(resource.attributes['target_device_id']),

    // Value and data source
    value: parseOptionalNumber(resource.attributes['value']),
    dataSource: parseString(resource.attributes['data_source']),
    dataSourceId: parseString(resource.attributes['data_source_id']),
    dataSourceType: parseString(resource.attributes['data_source_type']),
    dataSourceAlias: parseString(resource.attributes['data_source_alias']),

    // Status
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),

    // Extra data
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,

    // Notification
    notificationContent: parseString(resource.attributes['notification_content']),
    notificationUrl: parseString(resource.attributes['notification_url']),

    // Expiration
    expiresAt: parseDate(resource.attributes['expires_at']),

    // RAG sources
    ragSources: parseStringArray(resource.attributes['rag_sources']),

    // Idempotency
    idempotencyKey: parseString(resource.attributes['idempotency_key']),

    // Tracking
    createdBy: parseString(resource.attributes['created_by']),
    updatedBy: parseString(resource.attributes['updated_by']),
  }),
};
