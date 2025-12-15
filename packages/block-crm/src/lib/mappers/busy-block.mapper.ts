import type { JsonApiResource, JsonApiMapper } from '@23blocks/jsonapi-codec';
import type { BusyBlock } from '../types/busy-block';
import { parseString, parseDate, parseBoolean, parseStatus } from './utils';

export const busyBlockMapper: JsonApiMapper<BusyBlock> = {
  type: 'busy_block',
  map(resource: JsonApiResource): BusyBlock {
    const attrs = resource.attributes || {};
    return {
      id: resource.id,
      uniqueId: parseString(attrs['unique_id']) || resource.id,
      userUniqueId: parseString(attrs['user_unique_id']) || '',
      title: parseString(attrs['title']),
      description: parseString(attrs['description']),
      startTime: parseDate(attrs['start_time']) || new Date(),
      endTime: parseDate(attrs['end_time']) || new Date(),
      allDay: parseBoolean(attrs['all_day']),
      recurring: parseBoolean(attrs['recurring']),
      recurrenceRule: parseString(attrs['recurrence_rule']),
      status: parseStatus(attrs['status']),
      enabled: parseBoolean(attrs['enabled']),
      payload: attrs['payload'] as Record<string, unknown> | undefined,
      createdAt: parseDate(attrs['created_at']),
      updatedAt: parseDate(attrs['updated_at']),
    };
  },
};
