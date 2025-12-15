import type { JsonApiResource, JsonApiMapper } from '@23blocks/jsonapi-codec';
import type { ZoomMeeting } from '../types/zoom-meeting';
import { parseString, parseDate, parseBoolean, parseStatus, parseOptionalNumber } from './utils';

export const zoomMeetingMapper: JsonApiMapper<ZoomMeeting> = {
  type: 'zoom_meeting',
  map(resource: JsonApiResource): ZoomMeeting {
    const attrs = resource.attributes || {};
    return {
      id: resource.id,
      uniqueId: parseString(attrs['unique_id']) || resource.id,
      meetingUniqueId: parseString(attrs['meeting_unique_id']) || '',
      userUniqueId: parseString(attrs['user_unique_id']) || '',
      zoomMeetingId: parseString(attrs['zoom_meeting_id']),
      zoomHostId: parseString(attrs['zoom_host_id']),
      joinUrl: parseString(attrs['join_url']),
      startUrl: parseString(attrs['start_url']),
      password: parseString(attrs['password']),
      topic: parseString(attrs['topic']),
      agenda: parseString(attrs['agenda']),
      startTime: parseDate(attrs['start_time']),
      duration: parseOptionalNumber(attrs['duration']),
      timezone: parseString(attrs['timezone']),
      zoomStatus: parseString(attrs['zoom_status']),
      status: parseStatus(attrs['status']),
      enabled: parseBoolean(attrs['enabled']),
      payload: attrs['payload'] as Record<string, unknown> | undefined,
      createdAt: parseDate(attrs['created_at']),
      updatedAt: parseDate(attrs['updated_at']),
    };
  },
};
