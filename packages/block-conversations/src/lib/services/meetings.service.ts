import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Meeting,
  MeetingSession,
  CreateMeetingRequest,
  UpdateMeetingRequest,
  ListMeetingsParams,
} from '../types/meeting.js';
import { meetingMapper } from '../mappers/meeting.mapper.js';

export interface MeetingsService {
  /**
   * List all meetings
   * @param params - Optional filtering, sorting, and pagination parameters
   * @returns Paginated list of Meeting records with pagination metadata
   */
  list(params?: ListMeetingsParams): Promise<PageResult<Meeting>>;

  /**
   * Get a meeting by unique ID
   * @param uniqueId - Unique ID of the meeting to retrieve
   * @returns The matching Meeting record
   */
  get(uniqueId: string): Promise<Meeting>;

  /**
   * Create a new meeting
   * @param data - Meeting creation payload including title, schedule, and provider details
   * @returns The newly created Meeting record
   */
  create(data: CreateMeetingRequest): Promise<Meeting>;

  /**
   * Update a meeting
   * @param uniqueId - Unique ID of the meeting to update
   * @param data - Fields to update on the meeting
   * @returns The updated Meeting record
   */
  update(uniqueId: string, data: UpdateMeetingRequest): Promise<Meeting>;

  /**
   * Delete a meeting
   * @param uniqueId - Unique ID of the meeting to delete
   * @returns void on successful deletion
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Create a session for joining a meeting
   * @param uniqueId - Unique ID of the meeting to join
   * @returns MeetingSession with session ID, token, join URL, and expiration
   */
  createSession(uniqueId: string): Promise<MeetingSession>;

  /**
   * Start a meeting
   * @param uniqueId - Unique ID of the meeting to start
   * @returns The updated Meeting record with active status
   */
  start(uniqueId: string): Promise<Meeting>;

  /**
   * End a meeting
   * @param uniqueId - Unique ID of the meeting to end
   * @returns The updated Meeting record with ended status
   */
  end(uniqueId: string): Promise<Meeting>;
}

export function createMeetingsService(transport: Transport, _config: { apiKey: string }): MeetingsService {
  return {
    async list(params?: ListMeetingsParams): Promise<PageResult<Meeting>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.hostUniqueId) queryParams['host_unique_id'] = params.hostUniqueId;
      if (params?.conversationUniqueId) queryParams['conversation_unique_id'] = params.conversationUniqueId;
      if (params?.groupUniqueId) queryParams['group_unique_id'] = params.groupUniqueId;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.scheduledAfter) queryParams['scheduled_after'] = params.scheduledAfter;
      if (params?.scheduledBefore) queryParams['scheduled_before'] = params.scheduledBefore;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/meetings', { params: queryParams });
      return decodePageResult(response, meetingMapper);
    },

    async get(uniqueId: string): Promise<Meeting> {
      const response = await transport.get<unknown>(`/meetings/${uniqueId}`);
      return decodeOne(response, meetingMapper);
    },

    async create(data: CreateMeetingRequest): Promise<Meeting> {
      const response = await transport.post<unknown>('/meetings', {
        meeting: {
          title: data.title,
          description: data.description,
          conversation_unique_id: data.conversationUniqueId,
          group_unique_id: data.groupUniqueId,
          scheduled_at: data.scheduledAt,
          meeting_type: data.meetingType,
          max_participants: data.maxParticipants,
          is_recording: data.isRecording,
          provider: data.provider,
          payload: data.payload,
        },
      });
      return decodeOne(response, meetingMapper);
    },

    async update(uniqueId: string, data: UpdateMeetingRequest): Promise<Meeting> {
      const response = await transport.put<unknown>(`/meetings/${uniqueId}`, {
        meeting: {
          title: data.title,
          description: data.description,
          scheduled_at: data.scheduledAt,
          max_participants: data.maxParticipants,
          is_recording: data.isRecording,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, meetingMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/meetings/${uniqueId}`);
    },

    async createSession(uniqueId: string): Promise<MeetingSession> {
      const response = await transport.post<Record<string, unknown>>(`/meetings/${uniqueId}/session`, {});
      return {
        sessionId: String(response.session_id ?? response.sessionId ?? ''),
        meetingUniqueId: uniqueId,
        token: String(response.token ?? ''),
        joinUrl: String(response.join_url ?? response.joinUrl ?? ''),
        expiresAt: new Date(response.expires_at as string ?? response.expiresAt as string),
      };
    },

    async start(uniqueId: string): Promise<Meeting> {
      const response = await transport.post<unknown>(`/meetings/${uniqueId}/start`, {});
      return decodeOne(response, meetingMapper);
    },

    async end(uniqueId: string): Promise<Meeting> {
      const response = await transport.post<unknown>(`/meetings/${uniqueId}/end`, {});
      return decodeOne(response, meetingMapper);
    },
  };
}
