import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Company } from '../types/company';
import { parseString, parseDate, parseBoolean, parseStatus } from './utils';

export const companyMapper: ResourceMapper<Company> = {
  type: 'Company',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    legalName: parseString(resource.attributes['legal_name']),
    taxId: parseString(resource.attributes['tax_id']),
    industry: parseString(resource.attributes['industry']),
    website: parseString(resource.attributes['website']),
    logoUrl: parseString(resource.attributes['logo_url']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
