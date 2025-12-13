import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Course } from '../types/course';
import { parseString, parseDate, parseBoolean, parseOptionalNumber, parseStatus } from './utils';

export const courseMapper: ResourceMapper<Course> = {
  type: 'Course',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    instructorUniqueId: parseString(resource.attributes['instructor_unique_id']),
    categoryUniqueId: parseString(resource.attributes['category_unique_id']),
    level: parseString(resource.attributes['level']),
    duration: parseOptionalNumber(resource.attributes['duration']),
    imageUrl: parseString(resource.attributes['image_url']),
    price: parseOptionalNumber(resource.attributes['price']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
