import type { JsonApiResource, JsonApiMapper } from '@23blocks/jsonapi-codec';
import type { MeetingParticipant } from '../types/meeting-participant';
import { parseString, parseDate, parseBoolean, parseStatus } from './utils';

export const meetingParticipantMapper: JsonApiMapper<MeetingParticipant> = {
  type: 'meeting_participant',
  map(resource: JsonApiResource): MeetingParticipant {
    const attrs = resource.attributes || {};
    return {
      id: resource.id,
      uniqueId: parseString(attrs['unique_id']) || resource.id,
      meetingUniqueId: parseString(attrs['meeting_unique_id']) || '',
      contactUniqueId: parseString(attrs['contact_unique_id']),
      userUniqueId: parseString(attrs['user_unique_id']),
      email: parseString(attrs['email']),
      name: parseString(attrs['name']),
      role: parseString(attrs['role']),
      rsvpStatus: parseString(attrs['rsvp_status']),
      joinedAt: parseDate(attrs['joined_at']),
      leftAt: parseDate(attrs['left_at']),
      status: parseStatus(attrs['status']),
      enabled: parseBoolean(attrs['enabled']),
      payload: attrs['payload'] as Record<string, unknown> | undefined,
      createdAt: parseDate(attrs['created_at']),
      updatedAt: parseDate(attrs['updated_at']),
    };
  },
};
