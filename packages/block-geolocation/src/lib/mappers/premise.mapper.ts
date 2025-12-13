import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Premise } from '../types/premise';
import { parseString, parseDate, parseBoolean, parseOptionalNumber, parseStatus, parseStringArray } from './utils';

export const premiseMapper: ResourceMapper<Premise> = {
  type: 'Premise',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    addressUniqueId: parseString(resource.attributes['address_unique_id']),
    areaUniqueId: parseString(resource.attributes['area_unique_id']),
    locationUniqueId: parseString(resource.attributes['location_unique_id']),
    parentId: parseString(resource.attributes['parent_id']),
    premiseType: parseString(resource.attributes['premise_type']),
    floor: parseString(resource.attributes['floor']),
    code: parseString(resource.attributes['code']),
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    accessInstructions: parseString(resource.attributes['access_instructions']),
    additionalInstructions: parseString(resource.attributes['additional_instructions']),
    source: parseString(resource.attributes['source']),
    sourceAlias: parseString(resource.attributes['source_alias']),
    sourceId: parseString(resource.attributes['source_id']),
    sourceType: parseString(resource.attributes['source_type']),
    notes: parseString(resource.attributes['notes']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    qcode: parseString(resource.attributes['qcode']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    allowBookingOverlap: parseBoolean(resource.attributes['allow_booking_overlap']),
    capacity: parseOptionalNumber(resource.attributes['capacity']),
    tags: parseStringArray(resource.attributes['tags']),
  }),
};
