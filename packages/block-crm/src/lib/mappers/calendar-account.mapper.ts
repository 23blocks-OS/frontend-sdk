import type { JsonApiResource, JsonApiMapper } from '@23blocks/jsonapi-codec';
import type { CalendarAccount } from '../types/calendar-account';
import { parseString, parseDate, parseBoolean, parseStatus } from './utils';

export const calendarAccountMapper: JsonApiMapper<CalendarAccount> = {
  type: 'calendar_account',
  map(resource: JsonApiResource): CalendarAccount {
    const attrs = resource.attributes || {};
    return {
      id: resource.id,
      uniqueId: parseString(attrs['unique_id']) || resource.id,
      userUniqueId: parseString(attrs['user_unique_id']) || '',
      provider: parseString(attrs['provider']) || '',
      email: parseString(attrs['email']),
      name: parseString(attrs['name']),
      accessToken: parseString(attrs['access_token']),
      refreshToken: parseString(attrs['refresh_token']),
      tokenExpiresAt: parseDate(attrs['token_expires_at']),
      lastSyncAt: parseDate(attrs['last_sync_at']),
      syncEnabled: parseBoolean(attrs['sync_enabled']),
      status: parseStatus(attrs['status']),
      enabled: parseBoolean(attrs['enabled']),
      payload: attrs['payload'] as Record<string, unknown> | undefined,
      createdAt: parseDate(attrs['created_at']),
      updatedAt: parseDate(attrs['updated_at']),
    };
  },
};
