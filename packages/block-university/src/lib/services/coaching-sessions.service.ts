import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  CoachingSession,
  CreateCoachingSessionRequest,
  UpdateCoachingSessionRequest,
  ListCoachingSessionsParams,
} from '../types/coaching-session.js';
import { coachingSessionMapper } from '../mappers/coaching-session.mapper.js';

export interface CoachingSessionsService {
  /**
   * List coaching sessions with optional filtering and sorting.
   * @returns Paginated list of CoachingSession records with metadata.
   */
  list(params?: ListCoachingSessionsParams): Promise<PageResult<CoachingSession>>;

  /**
   * Create a new coaching session.
   * @returns The newly created CoachingSession record.
   */
  create(data: CreateCoachingSessionRequest): Promise<CoachingSession>;

  /**
   * Update an existing coaching session.
   * @returns The updated CoachingSession record.
   */
  update(uniqueId: string, data: UpdateCoachingSessionRequest): Promise<CoachingSession>;

  /**
   * Delete a coaching session.
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Get all coaching sessions for a student.
   * @returns Array of CoachingSession records.
   * @note Extracts the data array from a paginated response.
   */
  getByStudent(studentUniqueId: string): Promise<CoachingSession[]>;

  /**
   * Get all coaching sessions for a teacher.
   * @returns Array of CoachingSession records.
   * @note Extracts the data array from a paginated response.
   */
  getByTeacher(teacherUniqueId: string): Promise<CoachingSession[]>;

  /**
   * Record student confirmation of a coaching session.
   * @returns The updated CoachingSession record.
   */
  studentConfirm(uniqueId: string): Promise<CoachingSession>;

  /**
   * Record student check-in for a coaching session.
   * @returns The updated CoachingSession record.
   */
  studentCheckIn(uniqueId: string): Promise<CoachingSession>;

  /**
   * Record student check-out for a coaching session.
   * @returns The updated CoachingSession record.
   */
  studentCheckOut(uniqueId: string): Promise<CoachingSession>;

  /**
   * Add student notes to a coaching session.
   * @returns The updated CoachingSession record.
   */
  studentNotes(uniqueId: string, notes: string): Promise<CoachingSession>;

  /**
   * Record teacher confirmation of a coaching session.
   * @returns The updated CoachingSession record.
   */
  teacherConfirm(uniqueId: string): Promise<CoachingSession>;

  /**
   * Record teacher check-in for a coaching session.
   * @returns The updated CoachingSession record.
   */
  teacherCheckIn(uniqueId: string): Promise<CoachingSession>;

  /**
   * Record teacher check-out for a coaching session.
   * @returns The updated CoachingSession record.
   */
  teacherCheckOut(uniqueId: string): Promise<CoachingSession>;

  /**
   * Add admin notes to a coaching session.
   * @returns The updated CoachingSession record.
   */
  adminNotes(uniqueId: string, notes: string): Promise<CoachingSession>;
}

export function createCoachingSessionsService(transport: Transport, _config: { apiKey: string }): CoachingSessionsService {
  return {
    async list(params?: ListCoachingSessionsParams): Promise<PageResult<CoachingSession>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.teacherUniqueId) queryParams['teacher_unique_id'] = params.teacherUniqueId;
      if (params?.studentUniqueId) queryParams['student_unique_id'] = params.studentUniqueId;
      if (params?.fromDate) queryParams['from_date'] = params.fromDate.toISOString();
      if (params?.toDate) queryParams['to_date'] = params.toDate.toISOString();
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/coaching/sessions/', { params: queryParams });
      return decodePageResult(response, coachingSessionMapper);
    },

    async create(data: CreateCoachingSessionRequest): Promise<CoachingSession> {
      const response = await transport.post<unknown>('/coaching/sessions', {
        coaching_session: {
          teacher_unique_id: data.teacherUniqueId,
          student_unique_id: data.studentUniqueId,
          match_unique_id: data.matchUniqueId,
          scheduled_at: data.scheduledAt.toISOString(),
          duration: data.duration,
          payload: data.payload,
        },
      });
      return decodeOne(response, coachingSessionMapper);
    },

    async update(uniqueId: string, data: UpdateCoachingSessionRequest): Promise<CoachingSession> {
      const response = await transport.put<unknown>(`/coaching/sessions/${uniqueId}`, {
        coaching_session: {
          scheduled_at: data.scheduledAt?.toISOString(),
          duration: data.duration,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, coachingSessionMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/coaching/sessions/${uniqueId}`);
    },

    async getByStudent(studentUniqueId: string): Promise<CoachingSession[]> {
      const response = await transport.get<unknown>(`/users/${studentUniqueId}/coaching_sessions`);
      const result = await decodePageResult(response, coachingSessionMapper);
      return result.data;
    },

    async getByTeacher(teacherUniqueId: string): Promise<CoachingSession[]> {
      const response = await transport.get<unknown>(`/teachers/${teacherUniqueId}/coaching_sessions`);
      const result = await decodePageResult(response, coachingSessionMapper);
      return result.data;
    },

    async studentConfirm(uniqueId: string): Promise<CoachingSession> {
      const response = await transport.put<unknown>(`/coaching/sessions/${uniqueId}/students/confirmation`, {});
      return decodeOne(response, coachingSessionMapper);
    },

    async studentCheckIn(uniqueId: string): Promise<CoachingSession> {
      const response = await transport.put<unknown>(`/coaching/sessions/${uniqueId}/students/checking`, {});
      return decodeOne(response, coachingSessionMapper);
    },

    async studentCheckOut(uniqueId: string): Promise<CoachingSession> {
      const response = await transport.put<unknown>(`/coaching/sessions/${uniqueId}/students/checkout`, {});
      return decodeOne(response, coachingSessionMapper);
    },

    async studentNotes(uniqueId: string, notes: string): Promise<CoachingSession> {
      const response = await transport.put<unknown>(`/coaching/sessions/${uniqueId}/students/notes`, {
        notes,
      });
      return decodeOne(response, coachingSessionMapper);
    },

    async teacherConfirm(uniqueId: string): Promise<CoachingSession> {
      const response = await transport.put<unknown>(`/coaching/sessions/${uniqueId}/teachers/confirmation`, {});
      return decodeOne(response, coachingSessionMapper);
    },

    async teacherCheckIn(uniqueId: string): Promise<CoachingSession> {
      const response = await transport.put<unknown>(`/coaching/sessions/${uniqueId}/teachers/checking`, {});
      return decodeOne(response, coachingSessionMapper);
    },

    async teacherCheckOut(uniqueId: string): Promise<CoachingSession> {
      const response = await transport.put<unknown>(`/coaching/sessions/${uniqueId}/teachers/checkout`, {});
      return decodeOne(response, coachingSessionMapper);
    },

    async adminNotes(uniqueId: string, notes: string): Promise<CoachingSession> {
      const response = await transport.put<unknown>(`/coaching/sessions/${uniqueId}/admin/notes`, {
        notes,
      });
      return decodeOne(response, coachingSessionMapper);
    },
  };
}
