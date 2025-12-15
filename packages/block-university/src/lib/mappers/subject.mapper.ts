import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Subject } from '../types/subject';
import { parseString, parseDate, parseStatus, parseOptionalNumber } from './utils';

export const subjectMapper: ResourceMapper<Subject> = {
  type: 'subject',
  map: (resource) => ({
    uniqueId: resource.id,
    courseUniqueId: parseString(resource.attributes['course_unique_id']),
    name: parseString(resource.attributes['name']) ?? '',
    description: parseString(resource.attributes['description']),
    sortOrder: parseOptionalNumber(resource.attributes['sort_order']),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
