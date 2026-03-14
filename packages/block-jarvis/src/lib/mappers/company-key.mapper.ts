import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { CompanyKey } from '../types/company-key.js';
import { parseString, parseDate } from './utils.js';

export const companyKeyMapper: ResourceMapper<CompanyKey> = {
  type: 'company_key',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    name: parseString(resource.attributes['name']) || undefined,
    keyValue: parseString(resource.attributes['key_value']) || undefined,
    provider: parseString(resource.attributes['provider']) || undefined,
    status: parseString(resource.attributes['status']) || 'active',
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),
  }),
};
