import type { JsonApiResource, JsonApiMapper } from '@23blocks/jsonapi-codec';
import type { Subscriber } from '../types/subscriber';
import { parseString, parseDate, parseBoolean, parseStatus, parseStringArray } from './utils';

export const subscriberMapper: JsonApiMapper<Subscriber> = {
  type: 'subscriber',
  map(resource: JsonApiResource): Subscriber {
    const attrs = resource.attributes || {};
    return {
      id: resource.id,
      uniqueId: parseString(attrs['unique_id']) || resource.id,
      email: parseString(attrs['email']) || '',
      firstName: parseString(attrs['first_name']),
      lastName: parseString(attrs['last_name']),
      phone: parseString(attrs['phone']),
      source: parseString(attrs['source']),
      sourceId: parseString(attrs['source_id']),
      status: parseStatus(attrs['status']),
      enabled: parseBoolean(attrs['enabled']),
      payload: attrs['payload'] as Record<string, unknown> | undefined,
      tags: parseStringArray(attrs['tags']),
      createdAt: parseDate(attrs['created_at']),
      updatedAt: parseDate(attrs['updated_at']),
    };
  },
};
