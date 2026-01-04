import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Attendance } from '../types/attendance';
import { parseString, parseDate, parseBoolean, parseStatus, parseOptionalNumber } from './utils';

function parseAttendanceType(value: unknown): 'present' | 'absent' | 'late' | 'excused' {
  const type = parseString(value);
  if (type === 'present' || type === 'absent' || type === 'late' || type === 'excused') {
    return type;
  }
  return 'present';
}

export const attendanceMapper: ResourceMapper<Attendance> = {
  type: 'Attendance',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    lessonUniqueId: parseString(resource.attributes['lesson_unique_id']) || '',
    courseUniqueId: parseString(resource.attributes['course_unique_id']) || '',
    studentUniqueId: parseString(resource.attributes['student_unique_id']) || '',
    enrollmentUniqueId: parseString(resource.attributes['enrollment_unique_id']),
    attendanceType: parseAttendanceType(resource.attributes['attendance_type']),
    attendedAt: parseDate(resource.attributes['attended_at']),
    duration: parseOptionalNumber(resource.attributes['duration']),
    notes: parseString(resource.attributes['notes']),
    verifiedByUniqueId: parseString(resource.attributes['verified_by_unique_id']),
    verifiedAt: parseDate(resource.attributes['verified_at']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
