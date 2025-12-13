import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Enrollment } from '../types/enrollment';
import { parseString, parseDate, parseOptionalNumber, parseEnrollmentStatus } from './utils';

export const enrollmentMapper: ResourceMapper<Enrollment> = {
  type: 'Enrollment',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    courseUniqueId: parseString(resource.attributes['course_unique_id']) || '',
    userUniqueId: parseString(resource.attributes['user_unique_id']) || '',
    progress: parseOptionalNumber(resource.attributes['progress']),
    completedLessons: parseOptionalNumber(resource.attributes['completed_lessons']),
    startedAt: parseDate(resource.attributes['started_at']),
    completedAt: parseDate(resource.attributes['completed_at']),
    certificateUrl: parseString(resource.attributes['certificate_url']),
    status: parseEnrollmentStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
