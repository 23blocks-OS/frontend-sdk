import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { CourseGroup } from '../types/course-group';
import { parseString, parseDate, parseStatus, parseOptionalNumber } from './utils';

export const courseGroupMapper: ResourceMapper<CourseGroup> = {
  type: 'course_group',
  map: (resource) => ({
    uniqueId: resource.id,
    courseUniqueId: parseString(resource.attributes['course_unique_id']),
    name: parseString(resource.attributes['name']) ?? '',
    description: parseString(resource.attributes['description']),
    maxStudents: parseOptionalNumber(resource.attributes['max_students']),
    currentStudents: parseOptionalNumber(resource.attributes['current_students']),
    startDate: parseDate(resource.attributes['start_date']),
    endDate: parseDate(resource.attributes['end_date']),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
