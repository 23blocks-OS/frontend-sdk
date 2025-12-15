import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  MeetingParticipant,
  CreateMeetingParticipantRequest,
  UpdateMeetingParticipantRequest,
  ListMeetingParticipantsParams,
} from '../types/meeting-participant';
import { meetingParticipantMapper } from '../mappers/meeting-participant.mapper';

export interface MeetingParticipantsService {
  list(meetingUniqueId: string, params?: ListMeetingParticipantsParams): Promise<PageResult<MeetingParticipant>>;
  create(meetingUniqueId: string, data: CreateMeetingParticipantRequest): Promise<MeetingParticipant>;
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
