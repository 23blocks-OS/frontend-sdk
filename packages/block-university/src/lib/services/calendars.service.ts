import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Availability,
  CalendarEvent,
  CreateAvailabilityRequest,
  UpdateAvailabilityRequest,
  BulkUpdateAvailabilityRequest,
  CreateCalendarEventRequest,
  UpdateCalendarEventRequest,
  ListCalendarEventsParams,
} from '../types/calendar';
import { availabilityMapper, calendarEventMapper } from '../mappers/calendar.mapper';

export interface CalendarsService {
  // Student Availability
  getStudentAvailability(userUniqueId: string): Promise<Availability[]>;
  addStudentAvailability(userUniqueId: string, data: CreateAvailabilityRequest): Promise<Availability>;
  updateStudentAvailability(userUniqueId: string, availabilityUniqueId: string, data: UpdateAvailabilityRequest): Promise<Availability>;
  updateStudentAvailabilities(userUniqueId: string, data: BulkUpdateAvailabilityRequest): Promise<Availability[]>;
  deleteStudentAvailability(userUniqueId: string, availabilityUniqueId: string): Promise<void>;
  deleteAllStudentAvailability(userUniqueId: string): Promise<void>;

  // Teacher Availability
  getTeacherAvailability(teacherUniqueId: string): Promise<Availability[]>;
  addTeacherAvailability(teacherUniqueId: string, data: CreateAvailabilityRequest): Promise<Availability>;
  updateTeacherAvailability(teacherUniqueId: string, availabilityUniqueId: string, data: UpdateAvailabilityRequest): Promise<Availability>;
  deleteTeacherAvailability(teacherUniqueId: string, availabilityUniqueId: string): Promise<void>;
  deleteAllTeacherAvailability(teacherUniqueId: string): Promise<void>;

  // Events
  listEvents(params?: ListCalendarEventsParams): Promise<PageResult<CalendarEvent>>;
  getEvent(uniqueId: string): Promise<CalendarEvent>;
  createEvent(data: CreateCalendarEventRequest): Promise<CalendarEvent>;
  updateEvent(uniqueId: string, data: UpdateCalendarEventRequest): Promise<CalendarEvent>;
  deleteEvent(uniqueId: string): Promise<void>;
}

export function createCalendarsService(transport: Transport, _config: { appId: string }): CalendarsService {
  return {
    // Student Availability
    async getStudentAvailability(userUniqueId: string): Promise<Availability[]> {
      const response = await transport.get<unknown>(`/users/${userUniqueId}/availability`);
      return decodeMany(response, availabilityMapper);
    },

    async addStudentAvailability(userUniqueId: string, data: CreateAvailabilityRequest): Promise<Availability> {
      const response = await transport.post<unknown>(`/users/${userUniqueId}/availability`, {
        availability: {
          day_of_week: data.dayOfWeek,
          start_time: data.startTime,
          end_time: data.endTime,
          timezone: data.timezone,
          is_recurring: data.isRecurring,
          effective_from: data.effectiveFrom,
          effective_until: data.effectiveUntil,
        },
      });
      return decodeOne(response, availabilityMapper);
    },

    async updateStudentAvailability(userUniqueId: string, availabilityUniqueId: string, data: UpdateAvailabilityRequest): Promise<Availability> {
      const response = await transport.put<unknown>(`/users/${userUniqueId}/availability/${availabilityUniqueId}`, {
        availability: {
          day_of_week: data.dayOfWeek,
          start_time: data.startTime,
          end_time: data.endTime,
          timezone: data.timezone,
          is_recurring: data.isRecurring,
          effective_from: data.effectiveFrom,
          effective_until: data.effectiveUntil,
          status: data.status,
        },
      });
      return decodeOne(response, availabilityMapper);
    },

    async updateStudentAvailabilities(userUniqueId: string, data: BulkUpdateAvailabilityRequest): Promise<Availability[]> {
      const response = await transport.put<unknown>(`/users/${userUniqueId}/availabilities/slots`, {
        slots: data.slots.map((s) => ({
          day_of_week: s.dayOfWeek,
          start_time: s.startTime,
          end_time: s.endTime,
          timezone: s.timezone,
          is_recurring: s.isRecurring,
          effective_from: s.effectiveFrom,
          effective_until: s.effectiveUntil,
        })),
      });
      return decodeMany(response, availabilityMapper);
    },

    async deleteStudentAvailability(userUniqueId: string, availabilityUniqueId: string): Promise<void> {
      await transport.delete(`/users/${userUniqueId}/availability/${availabilityUniqueId}`);
    },

    async deleteAllStudentAvailability(userUniqueId: string): Promise<void> {
      await transport.delete(`/users/${userUniqueId}/availability`);
    },

    // Teacher Availability
    async getTeacherAvailability(teacherUniqueId: string): Promise<Availability[]> {
      const response = await transport.get<unknown>(`/teachers/${teacherUniqueId}/availability`);
      return decodeMany(response, availabilityMapper);
    },

    async addTeacherAvailability(teacherUniqueId: string, data: CreateAvailabilityRequest): Promise<Availability> {
      const response = await transport.post<unknown>(`/teachers/${teacherUniqueId}/availability`, {
        availability: {
          day_of_week: data.dayOfWeek,
          start_time: data.startTime,
          end_time: data.endTime,
          timezone: data.timezone,
          is_recurring: data.isRecurring,
          effective_from: data.effectiveFrom,
          effective_until: data.effectiveUntil,
        },
      });
      return decodeOne(response, availabilityMapper);
    },

    async updateTeacherAvailability(teacherUniqueId: string, availabilityUniqueId: string, data: UpdateAvailabilityRequest): Promise<Availability> {
      const response = await transport.put<unknown>(`/teachers/${teacherUniqueId}/availability/${availabilityUniqueId}`, {
        availability: {
          day_of_week: data.dayOfWeek,
          start_time: data.startTime,
          end_time: data.endTime,
          timezone: data.timezone,
          is_recurring: data.isRecurring,
          effective_from: data.effectiveFrom,
          effective_until: data.effectiveUntil,
          status: data.status,
        },
      });
      return decodeOne(response, availabilityMapper);
    },

    async deleteTeacherAvailability(teacherUniqueId: string, availabilityUniqueId: string): Promise<void> {
      await transport.delete(`/teachers/${teacherUniqueId}/availability/${availabilityUniqueId}`);
    },

    async deleteAllTeacherAvailability(teacherUniqueId: string): Promise<void> {
      await transport.delete(`/teachers/${teacherUniqueId}/availability`);
    },

    // Events
    async listEvents(params?: ListCalendarEventsParams): Promise<PageResult<CalendarEvent>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.userUniqueId) queryParams['user_unique_id'] = params.userUniqueId;
      if (params?.courseUniqueId) queryParams['course_unique_id'] = params.courseUniqueId;
      if (params?.courseGroupUniqueId) queryParams['course_group_unique_id'] = params.courseGroupUniqueId;
      if (params?.startDate) queryParams['start_date'] = params.startDate;
      if (params?.endDate) queryParams['end_date'] = params.endDate;
      if (params?.eventType) queryParams['event_type'] = params.eventType;

      const response = await transport.get<unknown>('/events', { params: queryParams });
      return decodePageResult(response, calendarEventMapper);
    },

    async getEvent(uniqueId: string): Promise<CalendarEvent> {
      const response = await transport.get<unknown>(`/events/${uniqueId}`);
      return decodeOne(response, calendarEventMapper);
    },

    async createEvent(data: CreateCalendarEventRequest): Promise<CalendarEvent> {
      const response = await transport.post<unknown>('/events', {
        event: {
          title: data.title,
          description: data.description,
          event_type: data.eventType,
          start_at: data.startAt,
          end_at: data.endAt,
          all_day: data.allDay,
          location: data.location,
          user_unique_id: data.userUniqueId,
          course_unique_id: data.courseUniqueId,
          course_group_unique_id: data.courseGroupUniqueId,
          recurrence: data.recurrence,
          timezone: data.timezone,
          payload: data.payload,
        },
      });
      return decodeOne(response, calendarEventMapper);
    },

    async updateEvent(uniqueId: string, data: UpdateCalendarEventRequest): Promise<CalendarEvent> {
      const response = await transport.put<unknown>(`/events/${uniqueId}`, {
        event: {
          title: data.title,
          description: data.description,
          event_type: data.eventType,
          start_at: data.startAt,
          end_at: data.endAt,
          all_day: data.allDay,
          location: data.location,
          recurrence: data.recurrence,
          timezone: data.timezone,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, calendarEventMapper);
    },

    async deleteEvent(uniqueId: string): Promise<void> {
      await transport.delete(`/events/${uniqueId}`);
    },
  };
}
