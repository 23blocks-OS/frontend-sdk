import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { CoachingSession } from '../types/coaching-session';
import { parseString, parseDate, parseStatus, parseOptionalNumber, parseBoolean } from './utils';

export const coachingSessionMapper: ResourceMapper<CoachingSession> = {
  type: 'coaching_session',
  map: (resource) => ({
    uniqueId: resource.id,
    teacherUniqueId: parseString(resource.attributes['teacher_unique_id']) ?? '',
    studentUniqueId: parseString(resource.attributes['student_unique_id']) ?? '',
    matchUniqueId: parseString(resource.attributes['match_unique_id']),
    scheduledAt: parseDate(resource.attributes['scheduled_at']) ?? new Date(),
    duration: parseOptionalNumber(resource.attributes['duration']),
    status: parseStatus(resource.attributes['status']),
    teacherConfirmed: parseBoolean(resource.attributes['teacher_confirmed']),
    studentConfirmed: parseBoolean(resource.attributes['student_confirmed']),
    teacherCheckedIn: parseBoolean(resource.attributes['teacher_checked_in']),
    studentCheckedIn: parseBoolean(resource.attributes['student_checked_in']),
    teacherNotes: parseString(resource.attributes['teacher_notes']),
    studentNotes: parseString(resource.attributes['student_notes']),
    adminNotes: parseString(resource.attributes['admin_notes']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
