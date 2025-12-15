import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Meeting,
  CreateMeetingRequest,
  UpdateMeetingRequest,
  ListMeetingsParams,
} from '../types/meeting';
import { meetingMapper } from '../mappers/meeting.mapper';

export interface MeetingsService {
  list(params?: ListMeetingsParams): Promise<PageResult<Meeting>>;
  get(uniqueId: string): Promise<Meeting>;
  create(data: CreateMeetingRequest): Promise<Meeting>;
  update(uniqueId: string, data: UpdateMeetingRequest): Promise<Meeting>;
  delete(uniqueId: string): Promise<void>;
  recover(uniqueId: string): Promise<Meeting>;
  search(query: string, params?: ListMeetingsParams): Promise<PageResult<Meeting>>;
  listDeleted(params?: ListMeetingsParams): Promise<PageResult<Meeting>>;
}

export function createMeetingsService(transport: Transport, _config: { appId: string }): MeetingsService {
  return {
    async list(params?: ListMeetingsParams): Promise<PageResult<Meeting>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.userUniqueId) queryParams['user_unique_id'] = params.userUniqueId;
      if (params?.accountUniqueId) queryParams['account_unique_id'] = params.accountUniqueId;
      if (params?.meetingType) queryParams['meeting_type'] = params.meetingType;
      if (params?.search) queryParams['search'] = params.search;
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
          code: data.code,
          title: data.title,
          meeting_type: data.meetingType,
          description: data.description,
          scheduled_at: data.scheduledAt,
          start_time: data.startTime,
          end_time: data.endTime,
          time_unit: data.timeUnit,
          time_quantity: data.timeQuantity,
          all_day: data.allDay,
          timezone: data.timezone,
          user_unique_id: data.userUniqueId,
          account_unique_id: data.accountUniqueId,
          meeting_location: data.meetingLocation,
          meeting_url: data.meetingUrl,
          payload: data.payload,
        },
      });
      return decodeOne(response, meetingMapper);
    },

    async update(uniqueId: string, data: UpdateMeetingRequest): Promise<Meeting> {
      const response = await transport.put<unknown>(`/meetings/${uniqueId}`, {
        meeting: {
          title: data.title,
          meeting_type: data.meetingType,
          description: data.description,
          scheduled_at: data.scheduledAt,
          start_time: data.startTime,
          end_time: data.endTime,
          time_unit: data.timeUnit,
          time_quantity: data.timeQuantity,
          all_day: data.allDay,
          timezone: data.timezone,
          meeting_location: data.meetingLocation,
          meeting_url: data.meetingUrl,
          meeting_score: data.meetingScore,
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

    async recover(uniqueId: string): Promise<Meeting> {
      const response = await transport.put<unknown>(`/meetings/${uniqueId}/recover`, {});
      return decodeOne(response, meetingMapper);
    },

    async search(query: string, params?: ListMeetingsParams): Promise<PageResult<Meeting>> {
      const queryParams: Record<string, string> = { search: query };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.post<unknown>('/meetings/search', { search: query }, { params: queryParams });
      return decodePageResult(response, meetingMapper);
    },

    async listDeleted(params?: ListMeetingsParams): Promise<PageResult<Meeting>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.get<unknown>('/meetings/trash/show', { params: queryParams });
      return decodePageResult(response, meetingMapper);
    },
  };
}
