import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  CoachingSession,
  CreateCoachingSessionRequest,
  UpdateCoachingSessionRequest,
  ListCoachingSessionsParams,
} from '../types/coaching-session';
import { coachingSessionMapper } from '../mappers/coaching-session.mapper';

export interface CoachingSessionsService {
  list(params?: ListCoachingSessionsParams): Promise<PageResult<CoachingSession>>;
  create(data: CreateCoachingSessionRequest): Promise<CoachingSession>;
  update(uniqueId: string, data: UpdateCoachingSessionRequest): Promise<CoachingSession>;
  delete(uniqueId: string): Promise<void>;
  getByStudent(studentUniqueId: string): Promise<CoachingSession[]>;
  getByTeacher(teacherUniqueId: string): Promise<CoachingSession[]>;
  studentConfirm(uniqueId: string): Promise<CoachingSession>;
  studentCheckIn(uniqueId: string): Promise<CoachingSession>;
  studentCheckOut(uniqueId: string): Promise<CoachingSession>;
  studentNotes(uniqueId: string, notes: string): Promise<CoachingSession>;
  teacherConfirm(uniqueId: string): Promise<CoachingSession>;
  teacherCheckIn(uniqueId: string): Promise<CoachingSession>;
  teacherCheckOut(uniqueId: string): Promise<CoachingSession>;
  adminNotes(uniqueId: string, notes: string): Promise<CoachingSession>;
}

export function createCoachingSessionsService(transport: Transport, _config: { appId: string }): CoachingSessionsService {
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
