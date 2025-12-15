import type { JsonApiResource, JsonApiMapper } from '@23blocks/jsonapi-codec';
import type { ContactEvent } from '../types/contact-event';
import { parseString, parseDate, parseBoolean, parseStatus } from './utils';

export const contactEventMapper: JsonApiMapper<ContactEvent> = {
  type: 'contact_event',
  map(resource: JsonApiResource): ContactEvent {
    const attrs = resource.attributes || {};
    return {
      id: resource.id,
      uniqueId: parseString(attrs['unique_id']) || resource.id,
      contactUniqueId: parseString(attrs['contact_unique_id']),
      userUniqueId: parseString(attrs['user_unique_id']),
      eventType: parseString(attrs['event_type']),
      title: parseString(attrs['title']),
      description: parseString(attrs['description']),
      scheduledAt: parseDate(attrs['scheduled_at']),
      startTime: parseDate(attrs['start_time']),
      endTime: parseDate(attrs['end_time']),
      status: parseStatus(attrs['status']),
      enabled: parseBoolean(attrs['enabled']),
      payload: attrs['payload'] as Record<string, unknown> | undefined,
      createdAt: parseDate(attrs['created_at']),
      updatedAt: parseDate(attrs['updated_at']),
    };
  },
};
