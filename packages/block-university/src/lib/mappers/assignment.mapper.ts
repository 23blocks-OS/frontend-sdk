import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Assignment } from '../types/assignment';
import { parseString, parseDate, parseBoolean, parseOptionalNumber, parseStatus } from './utils';

export const assignmentMapper: ResourceMapper<Assignment> = {
  type: 'Assignment',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    lessonUniqueId: parseString(resource.attributes['lesson_unique_id']) || '',
    title: parseString(resource.attributes['title']) || '',
    description: parseString(resource.attributes['description']),
    dueDate: parseDate(resource.attributes['due_date']),
    maxScore: parseOptionalNumber(resource.attributes['max_score']),
    submissionType: parseString(resource.attributes['submission_type']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
