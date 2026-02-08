import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  MeetingParticipant,
  CreateMeetingParticipantRequest,
  UpdateMeetingParticipantRequest,
  ListMeetingParticipantsParams,
} from '../types/meeting-participant.js';
import { meetingParticipantMapper } from '../mappers/meeting-participant.mapper.js';

export interface MeetingParticipantsService {
  /**
   * List participants for a specific meeting with optional filtering, pagination, and sorting.
   * @param meetingUniqueId - The unique identifier of the parent meeting.
   * @param params - Optional filtering (status, role, rsvpStatus, search), pagination, and sorting.
   * @returns Paginated result containing MeetingParticipant objects and metadata.
   */
  list(meetingUniqueId: string, params?: ListMeetingParticipantsParams): Promise<PageResult<MeetingParticipant>>;

  /**
   * Add a participant to a meeting.
   * @param meetingUniqueId - The unique identifier of the parent meeting.
   * @param data - The participant creation payload with contact/user reference, email, name, role, and RSVP status.
   * @returns The newly created MeetingParticipant object.
   */
  create(meetingUniqueId: string, data: CreateMeetingParticipantRequest): Promise<MeetingParticipant>;

  /**
   * Remove a participant from a meeting.
   * @param meetingUniqueId - The unique identifier of the parent meeting.
   * @param participantUniqueId - The unique identifier of the participant to remove.
   * @returns Resolves when the participant has been removed.
   */
  delete(meetingUniqueId: string, participantUniqueId: string): Promise<void>;
}

export function createMeetingParticipantsService(transport: Transport, _config: { appId: string }): MeetingParticipantsService {
  return {
    async list(meetingUniqueId: string, params?: ListMeetingParticipantsParams): Promise<PageResult<MeetingParticipant>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.role) queryParams['role'] = params.role;
      if (params?.rsvpStatus) queryParams['rsvp_status'] = params.rsvpStatus;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/meetings/${meetingUniqueId}/participants`, { params: queryParams });
      return decodePageResult(response, meetingParticipantMapper);
    },

    async create(meetingUniqueId: string, data: CreateMeetingParticipantRequest): Promise<MeetingParticipant> {
      const response = await transport.post<unknown>(`/meetings/${meetingUniqueId}/participants`, {
        participant: {
          contact_unique_id: data.contactUniqueId,
          user_unique_id: data.userUniqueId,
          email: data.email,
          name: data.name,
          role: data.role,
          rsvp_status: data.rsvpStatus,
          payload: data.payload,
        },
      });
      return decodeOne(response, meetingParticipantMapper);
    },

    async delete(meetingUniqueId: string, participantUniqueId: string): Promise<void> {
      await transport.delete(`/meetings/${meetingUniqueId}/participants/${participantUniqueId}`);
    },
  };
}
