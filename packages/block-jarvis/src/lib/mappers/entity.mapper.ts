import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Entity } from '../types/entity.js';
import { parseString, parseDate, parseBoolean } from './utils.js';

export const entityMapper: ResourceMapper<Entity> = {
  type: 'entity',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || '',
    code: parseString(resource.attributes['code']),
    entityType: parseString(resource.attributes['entity_type']),
    entityAlias: parseString(resource.attributes['entity_alias']),
    entitySource: parseString(resource.attributes['entity_source']),
    entityUrl: parseString(resource.attributes['entity_url']),
    content: parseString(resource.attributes['content']),
    instructions: parseString(resource.attributes['instructions']) || undefined,
    stripeId: parseString(resource.attributes['stripe_id']),
    status: parseString(resource.attributes['status']) || 'active',
    timeZone: parseString(resource.attributes['time_zone']),
    createdBy: parseString(resource.attributes['created_by']) || undefined,
    updatedBy: parseString(resource.attributes['updated_by']) || undefined,
    preferredLanguage: parseString(resource.attributes['preferred_language']),
    entityAvatarUrl: parseString(resource.attributes['entity_avatar_url']),
    enabled: resource.attributes['enabled'] != null ? parseBoolean(resource.attributes['enabled']) : undefined,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),
  }),
};
