import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Media } from '../types/media';
import { parseString, parseDate, parseStatus } from './utils';

export const mediaMapper: ResourceMapper<Media> = {
  type: 'Medium',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    name: parseString(resource.attributes['name']) || '',
    code: parseString(resource.attributes['code']),
    description: parseString(resource.attributes['description']),
    mediumType: parseString(resource.attributes['medium_type']),
    mediumLink: parseString(resource.attributes['medium_link']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseString(resource.attributes['enabled']),
  }),
};
