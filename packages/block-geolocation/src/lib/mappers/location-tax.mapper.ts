import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { LocationTax } from '../types/location-tax';
import { parseString, parseDate, parseStatus, parseNumber, parseBoolean } from './utils';

export const locationTaxMapper: ResourceMapper<LocationTax> = {
  type: 'location_tax',
  map: (resource) => ({
    uniqueId: resource.id,
    locationUniqueId: parseString(resource.attributes['location_unique_id']) ?? '',
    name: parseString(resource.attributes['name']) ?? '',
    rate: parseNumber(resource.attributes['rate']),
    taxType: parseString(resource.attributes['tax_type']),
    isInclusive: parseBoolean(resource.attributes['is_inclusive']),
    isDefault: parseBoolean(resource.attributes['is_default']),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
