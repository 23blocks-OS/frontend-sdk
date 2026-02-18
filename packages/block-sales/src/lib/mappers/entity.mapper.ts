import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { SalesEntity } from '../types/entity.js';
import { parseString, parseDate } from './utils.js';

export const salesEntityMapper: ResourceMapper<SalesEntity> = {
  type: 'entity',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes?.['unique_id']) || '',
    entityType: parseString(resource.attributes?.['entity_type']),
    entityAlias: parseString(resource.attributes?.['entity_alias']),
    entitySource: parseString(resource.attributes?.['entity_source']),
    entityUrl: parseString(resource.attributes?.['entity_url']),
    stripeId: parseString(resource.attributes?.['stripe_id']),
    status: parseString(resource.attributes?.['status']),
    timeZone: parseString(resource.attributes?.['time_zone']),
    preferredLanguage: parseString(resource.attributes?.['preferred_language']),
    avatarUrl: parseString(resource.attributes?.['avatar_url']),
    createdAt: parseDate(resource.attributes?.['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes?.['updated_at']) || new Date(),
  }),
};
