import type { JsonApiResource, JsonApiMapper } from '@23blocks/jsonapi-codec';
import type { Touch } from '../types/touch';
import { parseString, parseDate, parseBoolean, parseStatus } from './utils';

export const touchMapper: JsonApiMapper<Touch> = {
  type: 'touch',
  map(resource: JsonApiResource): Touch {
    const attrs = resource.attributes || {};
    return {
      id: resource.id,
      uniqueId: parseString(attrs['unique_id']) || resource.id,
      contactUniqueId: parseString(attrs['contact_unique_id']),
      userUniqueId: parseString(attrs['user_unique_id']),
      touchType: parseString(attrs['touch_type']),
      channel: parseString(attrs['channel']),
      subject: parseString(attrs['subject']),
      notes: parseString(attrs['notes']),
      touchedAt: parseDate(attrs['touched_at']),
      status: parseStatus(attrs['status']),
      enabled: parseBoolean(attrs['enabled']),
      payload: attrs['payload'] as Record<string, unknown> | undefined,
      createdAt: parseDate(attrs['created_at']),
      updatedAt: parseDate(attrs['updated_at']),
    };
  },
};
