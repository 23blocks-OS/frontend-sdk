import type { Transport } from '@23blocks/contracts';
import { decodeOne, decodeMany } from '@23blocks/jsonapi-codec';
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
} from '../types/match.js';
import { matchMapper, matchEvaluationMapper, availableCoachMapper, availableCoacheeMapper } from '../mappers/match.mapper.js';

export interface MatchesService {
  // Match CRUD

  /**
   * Create a new teacher-student match.
   * @returns The newly created Match record.
   */
  create(data: CreateMatchRequest): Promise<Match>;

  /**
   * Activate a match.
   * @returns The Match record with active status.
   */
  activate(uniqueId: string): Promise<Match>;

  /**
   * Deactivate a match.
   * @returns The Match record with inactive status.
   */
  deactivate(uniqueId: string): Promise<Match>;

  /**
   * Delete a match.
   */
  delete(uniqueId: string): Promise<void>;

  // By Student

  /**
   * Get the active match for a student.
   * @returns The active Match record, or null if none exists.
   * @note Returns null instead of throwing when no active match is found.
   */
  getActiveByStudent(studentUniqueId: string): Promise<Match | null>;

  /**
   * Get all matches for a student.
   * @returns Array of Match records.
   */
  getAllByStudent(studentUniqueId: string): Promise<Match[]>;

  /**
   * Get available matches for a student.
   * @returns Array of available Match records.
   */
  getAvailableByStudent(studentUniqueId: string): Promise<Match[]>;

  // By Teacher

  /**
   * Get the active match for a teacher.
   * @returns The active Match record, or null if none exists.
   * @note Returns null instead of throwing when no active match is found.
   */
  getActiveByTeacher(teacherUniqueId: string): Promise<Match | null>;

  /**
   * Get all matches for a teacher.
   * @returns Array of Match records.
   */
  getAllByTeacher(teacherUniqueId: string): Promise<Match[]>;

  /**
   * Get available matches for a teacher.
   * @returns Array of available Match records.
   */
  getAvailableByTeacher(teacherUniqueId: string): Promise<Match[]>;

  // Matching Engine

  /**
   * Find available coaches for a student.
   * @returns Array of AvailableCoach records with compatibility info.
   */
  findCoaches(studentUniqueId: string, request?: FindCoachesRequest): Promise<AvailableCoach[]>;

  /**
   * Find available coachees for a teacher.
   * @returns Array of AvailableCoachee records with compatibility info.
   */
  findCoachees(teacherUniqueId: string, request?: FindCoacheesRequest): Promise<AvailableCoachee[]>;

  /**
   * Evaluate potential matches between teachers and students.
   * @returns Array of MatchEvaluation records with scores.
   */
  evaluateMatches(request: EvaluateMatchesRequest): Promise<MatchEvaluation[]>;

  /**
   * Evaluate availability compatibility between a teacher and student.
   * @returns Array of MatchEvaluation records with availability overlap data.
   */
  evaluateAvailabilities(request: EvaluateAvailabilitiesRequest): Promise<MatchEvaluation[]>;
}

export function createMatchesService(transport: Transport, _config: { apiKey: string }): MatchesService {
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
