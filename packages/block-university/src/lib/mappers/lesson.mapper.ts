import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Lesson } from '../types/lesson';
import { parseString, parseDate, parseBoolean, parseOptionalNumber, parseStatus, parseLessonContentType } from './utils';

export const lessonMapper: ResourceMapper<Lesson> = {
  type: 'Lesson',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    courseUniqueId: parseString(resource.attributes['course_unique_id']) || '',
    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    content: parseString(resource.attributes['content']),
    contentType: parseLessonContentType(resource.attributes['content_type']),
    contentUrl: parseString(resource.attributes['content_url']),
    duration: parseOptionalNumber(resource.attributes['duration']),
    displayOrder: parseOptionalNumber(resource.attributes['display_order']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
