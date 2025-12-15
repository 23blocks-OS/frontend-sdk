import type { Transport } from '@23blocks/contracts';
import { decodeOne } from '@23blocks/jsonapi-codec';
import type {
  ZoomMeeting,
  ZoomAvailability,
  ProvisionZoomMeetingRequest,
  UpdateZoomMeetingRequest,
} from '../types/zoom-meeting';
import { zoomMeetingMapper } from '../mappers/zoom-meeting.mapper';

export interface ZoomMeetingsService {
  get(userUniqueId: string, meetingUniqueId: string): Promise<ZoomMeeting>;
  provision(userUniqueId: string, meetingUniqueId: string, request?: ProvisionZoomMeetingRequest): Promise<ZoomMeeting>;
  update(userUniqueId: string, meetingUniqueId: string, request: UpdateZoomMeetingRequest): Promise<ZoomMeeting>;
  cancel(userUniqueId: string, meetingUniqueId: string): Promise<void>;
  checkAvailability(userUniqueId: string): Promise<ZoomAvailability>;
}

export function createZoomMeetingsService(transport: Transport, _config: { appId: string }): ZoomMeetingsService {
  return {
    async get(userUniqueId: string, meetingUniqueId: string): Promise<ZoomMeeting> {
      const response = await transport.get<unknown>(`/users/${userUniqueId}/meetings/${meetingUniqueId}/zoom`);
      return decodeOne(response, zoomMeetingMapper);
    },

    async provision(userUniqueId: string, meetingUniqueId: string, request?: ProvisionZoomMeetingRequest): Promise<ZoomMeeting> {
      const response = await transport.post<unknown>(`/users/${userUniqueId}/meetings/${meetingUniqueId}/zoom`, {
        zoom_meeting: {
          topic: request?.topic,
          agenda: request?.agenda,
          duration: request?.duration,
          timezone: request?.timezone,
          password: request?.password,
          waiting_room: request?.waitingRoom,
          join_before_host: request?.joinBeforeHost,
          mute_on_entry: request?.muteOnEntry,
          auto_recording: request?.autoRecording,
          payload: request?.payload,
        },
      });
      return decodeOne(response, zoomMeetingMapper);
    },

    async update(userUniqueId: string, meetingUniqueId: string, request: UpdateZoomMeetingRequest): Promise<ZoomMeeting> {
      const response = await transport.put<unknown>(`/users/${userUniqueId}/meetings/${meetingUniqueId}/zoom`, {
        zoom_meeting: {
          topic: request.topic,
          agenda: request.agenda,
          start_time: request.startTime?.toISOString(),
          duration: request.duration,
          timezone: request.timezone,
          password: request.password,
          waiting_room: request.waitingRoom,
          join_before_host: request.joinBeforeHost,
          mute_on_entry: request.muteOnEntry,
          auto_recording: request.autoRecording,
          payload: request.payload,
        },
      });
      return decodeOne(response, zoomMeetingMapper);
    },

    async cancel(userUniqueId: string, meetingUniqueId: string): Promise<void> {
      await transport.delete(`/users/${userUniqueId}/meetings/${meetingUniqueId}/zoom`);
    },

    async checkAvailability(userUniqueId: string): Promise<ZoomAvailability> {
      const response = await transport.get<{ data: ZoomAvailability }>(`/users/${userUniqueId}/zoom/availability`);
      return response.data;
    },
  };
}
