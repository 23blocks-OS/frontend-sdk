import type { JsonApiResource, JsonApiMapper } from '@23blocks/jsonapi-codec';
import type { ZoomHost } from '../types/zoom-host';
import { parseString, parseDate, parseBoolean, parseStatus, parseOptionalNumber, parseNumber } from './utils';

export const zoomHostMapper: JsonApiMapper<ZoomHost> = {
  type: 'zoom_host',
  map(resource: JsonApiResource): ZoomHost {
    const attrs = resource.attributes || {};
    return {
      id: resource.id,
      uniqueId: parseString(attrs['unique_id']) || resource.id,
      userUniqueId: parseString(attrs['user_unique_id']),
      zoomUserId: parseString(attrs['zoom_user_id']),
      email: parseString(attrs['email']),
      firstName: parseString(attrs['first_name']),
      lastName: parseString(attrs['last_name']),
      displayName: parseString(attrs['display_name']),
      hostKey: parseString(attrs['host_key']),
      licenseType: parseString(attrs['license_type']),
      maxMeetings: parseOptionalNumber(attrs['max_meetings']),
      currentMeetings: parseOptionalNumber(attrs['current_meetings']),
      status: parseStatus(attrs['status']),
      enabled: parseBoolean(attrs['enabled']),
      payload: attrs['payload'] as Record<string, unknown> | undefined,
      createdAt: parseDate(attrs['created_at']),
      updatedAt: parseDate(attrs['updated_at']),
    };
  },
};
