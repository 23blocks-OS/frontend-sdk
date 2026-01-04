import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Meeting } from '../types/meeting';
import { parseString, parseDate, parseBoolean, parseStatus, parseOptionalNumber } from './utils';

export const meetingMapper: ResourceMapper<Meeting> = {
  type: 'Meeting',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    title: parseString(resource.attributes['title']) || '',
    description: parseString(resource.attributes['description']),
    hostUniqueId: parseString(resource.attributes['host_unique_id']) || '',
    conversationUniqueId: parseString(resource.attributes['conversation_unique_id']),
    groupUniqueId: parseString(resource.attributes['group_unique_id']),
    scheduledAt: parseDate(resource.attributes['scheduled_at']),
    startedAt: parseDate(resource.attributes['started_at']),
    endedAt: parseDate(resource.attributes['ended_at']),
    duration: parseOptionalNumber(resource.attributes['duration']),
    meetingType: parseString(resource.attributes['meeting_type']) || 'video',
    meetingUrl: parseString(resource.attributes['meeting_url']),
    externalMeetingId: parseString(resource.attributes['external_meeting_id']),
    provider: parseString(resource.attributes['provider']),
    maxParticipants: parseOptionalNumber(resource.attributes['max_participants']),
    isRecording: parseBoolean(resource.attributes['is_recording']),
    recordingUrl: parseString(resource.attributes['recording_url']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
