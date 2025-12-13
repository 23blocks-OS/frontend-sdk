import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Opportunity } from '../types/opportunity';
import { parseString, parseDate, parseBoolean, parseOptionalNumber, parseStatus, parseStringArray } from './utils';

export const opportunityMapper: ResourceMapper<Opportunity> = {
  type: 'Opportunity',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    accountUniqueId: parseString(resource.attributes['account_unique_id']),
    contactUniqueId: parseString(resource.attributes['contact_unique_id']),
    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    notes: parseString(resource.attributes['notes']),
    budget: parseOptionalNumber(resource.attributes['budget']),
    total: parseOptionalNumber(resource.attributes['total']),
    duration: parseOptionalNumber(resource.attributes['duration']),
    durationUnit: parseString(resource.attributes['duration_unit']),
    durationDescription: parseString(resource.attributes['duration_description']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    nextActionAt: parseDate(resource.attributes['next_action_at']),
    ownerUniqueId: parseString(resource.attributes['owner_unique_id']),
    ownerName: parseString(resource.attributes['owner_name']),
    ownerEmail: parseString(resource.attributes['owner_email']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    tags: parseStringArray(resource.attributes['tags']),
  }),
};
