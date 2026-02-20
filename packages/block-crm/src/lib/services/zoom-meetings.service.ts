import type { Transport } from '@23blocks/contracts';
import { decodeOne } from '@23blocks/jsonapi-codec';
import type {
  ZoomMeeting,
  ZoomAvailability,
  ProvisionZoomMeetingRequest,
  UpdateZoomMeetingRequest,
} from '../types/zoom-meeting.js';
import { zoomMeetingMapper } from '../mappers/zoom-meeting.mapper.js';

export interface ZoomMeetingsService {
  /**
   * Retrieve Zoom meeting details for a specific user and meeting.
   * @param userUniqueId - The unique identifier of the user.
   * @param meetingUniqueId - The unique identifier of the meeting.
   * @returns The matching ZoomMeeting object with Zoom-specific details.
   */
  get(userUniqueId: string, meetingUniqueId: string): Promise<ZoomMeeting>;

  /**
   * Provision a new Zoom meeting for a user's meeting.
   * @param userUniqueId - The unique identifier of the user.
   * @param meetingUniqueId - The unique identifier of the meeting to provision Zoom for.
   * @param request - Optional Zoom meeting settings (topic, agenda, duration, recording, waiting room, etc.).
   * @returns The newly provisioned ZoomMeeting object with join/start URLs.
   * @note Creates the Zoom meeting on the Zoom platform and links it to the CRM meeting.
   */
  provision(userUniqueId: string, meetingUniqueId: string, request?: ProvisionZoomMeetingRequest): Promise<ZoomMeeting>;

  /**
   * Update the Zoom meeting settings for a user's meeting.
   * @param userUniqueId - The unique identifier of the user.
   * @param meetingUniqueId - The unique identifier of the meeting.
   * @param request - The Zoom meeting fields to update.
   * @returns The updated ZoomMeeting object.
   * @note Uses PUT (not PATCH) as required by the 23blocks backend.
   */
  update(userUniqueId: string, meetingUniqueId: string, request: UpdateZoomMeetingRequest): Promise<ZoomMeeting>;

  /**
   * Cancel and remove the Zoom meeting for a user's meeting.
   * @param userUniqueId - The unique identifier of the user.
   * @param meetingUniqueId - The unique identifier of the meeting.
   * @returns Resolves when the Zoom meeting has been cancelled.
   */
  cancel(userUniqueId: string, meetingUniqueId: string): Promise<void>;

  /**
   * Check Zoom availability for a user.
   * @param userUniqueId - The unique identifier of the user.
   * @returns A ZoomAvailability object indicating whether the user can host Zoom meetings.
   */
  checkAvailability(userUniqueId: string): Promise<ZoomAvailability>;
}

export function createZoomMeetingsService(transport: Transport, _config: { apiKey: string }): ZoomMeetingsService {
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
