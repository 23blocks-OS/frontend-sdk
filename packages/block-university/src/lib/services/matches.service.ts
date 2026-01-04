import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Match,
  MatchEvaluation,
  AvailableCoach,
  AvailableCoachee,
  CreateMatchRequest,
  FindCoachesRequest,
  FindCoacheesRequest,
  EvaluateMatchesRequest,
  EvaluateAvailabilitiesRequest,
  ListMatchesParams,
} from '../types/match';
import { matchMapper, matchEvaluationMapper, availableCoachMapper, availableCoacheeMapper } from '../mappers/match.mapper';

export interface MatchesService {
  // Match CRUD
  create(data: CreateMatchRequest): Promise<Match>;
  activate(uniqueId: string): Promise<Match>;
  deactivate(uniqueId: string): Promise<Match>;
  delete(uniqueId: string): Promise<void>;

  // By Student
  getActiveByStudent(studentUniqueId: string): Promise<Match | null>;
  getAllByStudent(studentUniqueId: string): Promise<Match[]>;
  getAvailableByStudent(studentUniqueId: string): Promise<Match[]>;

  // By Teacher
  getActiveByTeacher(teacherUniqueId: string): Promise<Match | null>;
  getAllByTeacher(teacherUniqueId: string): Promise<Match[]>;
  getAvailableByTeacher(teacherUniqueId: string): Promise<Match[]>;

  // Matching Engine
  findCoaches(studentUniqueId: string, request?: FindCoachesRequest): Promise<AvailableCoach[]>;
  findCoachees(teacherUniqueId: string, request?: FindCoacheesRequest): Promise<AvailableCoachee[]>;
  evaluateMatches(request: EvaluateMatchesRequest): Promise<MatchEvaluation[]>;
  evaluateAvailabilities(request: EvaluateAvailabilitiesRequest): Promise<MatchEvaluation[]>;
}

export function createMatchesService(transport: Transport, _config: { appId: string }): MatchesService {
  return {
    // Match CRUD
    async create(data: CreateMatchRequest): Promise<Match> {
      const response = await transport.post<unknown>('/matches', {
        match: {
          teacher_unique_id: data.teacherUniqueId,
          student_unique_id: data.studentUniqueId,
          course_unique_id: data.courseUniqueId,
          subject_unique_id: data.subjectUniqueId,
          payload: data.payload,
        },
      });
      return decodeOne(response, matchMapper);
    },

    async activate(uniqueId: string): Promise<Match> {
      const response = await transport.put<unknown>(`/matches/${uniqueId}/activate`, {});
      return decodeOne(response, matchMapper);
    },

    async deactivate(uniqueId: string): Promise<Match> {
      const response = await transport.put<unknown>(`/matches/${uniqueId}/deactivate`, {});
      return decodeOne(response, matchMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/matches/${uniqueId}`);
    },

    // By Student
    async getActiveByStudent(studentUniqueId: string): Promise<Match | null> {
      try {
        const response = await transport.get<unknown>(`/users/${studentUniqueId}/coaching/active`);
        return decodeOne(response, matchMapper);
      } catch {
        return null;
      }
    },

    async getAllByStudent(studentUniqueId: string): Promise<Match[]> {
      const response = await transport.get<unknown>(`/users/${studentUniqueId}/coaching/matches`);
      return decodeMany(response, matchMapper);
    },

    async getAvailableByStudent(studentUniqueId: string): Promise<Match[]> {
      const response = await transport.get<unknown>(`/users/${studentUniqueId}/coaching/available`);
      return decodeMany(response, matchMapper);
    },

    // By Teacher
    async getActiveByTeacher(teacherUniqueId: string): Promise<Match | null> {
      try {
        const response = await transport.get<unknown>(`/teachers/${teacherUniqueId}/coaching/active`);
        return decodeOne(response, matchMapper);
      } catch {
        return null;
      }
    },

    async getAllByTeacher(teacherUniqueId: string): Promise<Match[]> {
      const response = await transport.get<unknown>(`/teachers/${teacherUniqueId}/coaching/matches`);
      return decodeMany(response, matchMapper);
    },

    async getAvailableByTeacher(teacherUniqueId: string): Promise<Match[]> {
      const response = await transport.get<unknown>(`/teachers/${teacherUniqueId}/coaching/available`);
      return decodeMany(response, matchMapper);
    },

    // Matching Engine
    async findCoaches(studentUniqueId: string, request?: FindCoachesRequest): Promise<AvailableCoach[]> {
      const response = await transport.post<unknown>(`/users/${studentUniqueId}/coaches/find`, {
        course_unique_id: request?.courseUniqueId,
        subject_unique_id: request?.subjectUniqueId,
        availability_required: request?.availabilityRequired,
        limit: request?.limit,
      });
      return decodeMany(response, availableCoachMapper);
    },

    async findCoachees(teacherUniqueId: string, request?: FindCoacheesRequest): Promise<AvailableCoachee[]> {
      const response = await transport.post<unknown>(`/teachers/${teacherUniqueId}/coachees/find`, {
        course_unique_id: request?.courseUniqueId,
        subject_unique_id: request?.subjectUniqueId,
        availability_required: request?.availabilityRequired,
        limit: request?.limit,
      });
      return decodeMany(response, availableCoacheeMapper);
    },

    async evaluateMatches(request: EvaluateMatchesRequest): Promise<MatchEvaluation[]> {
      const response = await transport.post<unknown>('/matches/evaluate', {
        teacher_unique_ids: request.teacherUniqueIds,
        student_unique_ids: request.studentUniqueIds,
        course_unique_id: request.courseUniqueId,
      });
      return decodeMany(response, matchEvaluationMapper);
    },

    async evaluateAvailabilities(request: EvaluateAvailabilitiesRequest): Promise<MatchEvaluation[]> {
      const response = await transport.post<unknown>('/matches/availabilities', {
        teacher_unique_id: request.teacherUniqueId,
        student_unique_id: request.studentUniqueId,
        start_date: request.startDate,
        end_date: request.endDate,
      });
      return decodeMany(response, matchEvaluationMapper);
    },
  };
}
