import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Quarter } from '../types/quarter';
import { parseString, parseDate, parseBoolean, parseNumber, parseStatus } from './utils';

export const quarterMapper: ResourceMapper<Quarter> = {
  type: 'Quarter',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    companyUniqueId: parseString(resource.attributes['company_unique_id']) || '',
    name: parseString(resource.attributes['name']) || '',
    year: parseNumber(resource.attributes['year']),
    quarter: parseNumber(resource.attributes['quarter']),
    startDate: parseDate(resource.attributes['start_date']) || new Date(),
    endDate: parseDate(resource.attributes['end_date']) || new Date(),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
