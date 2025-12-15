import type { JsonApiResource, JsonApiMapper } from '@23blocks/jsonapi-codec';
import type { IcsToken } from '../types/ics-token';
import { parseString, parseDate, parseBoolean, parseStatus, parseNumber } from './utils';

export const icsTokenMapper: JsonApiMapper<IcsToken> = {
  type: 'ics_token',
  map(resource: JsonApiResource): IcsToken {
    const attrs = resource.attributes || {};
    return {
      id: resource.id,
      uniqueId: parseString(attrs['unique_id']) || resource.id,
      userUniqueId: parseString(attrs['user_unique_id']) || '',
      token: parseString(attrs['token']) || '',
      name: parseString(attrs['name']),
      description: parseString(attrs['description']),
      expiresAt: parseDate(attrs['expires_at']),
      lastAccessedAt: parseDate(attrs['last_accessed_at']),
      accessCount: parseNumber(attrs['access_count']),
      status: parseStatus(attrs['status']),
      enabled: parseBoolean(attrs['enabled']),
      payload: attrs['payload'] as Record<string, unknown> | undefined,
      createdAt: parseDate(attrs['created_at']),
      updatedAt: parseDate(attrs['updated_at']),
    };
  },
};
