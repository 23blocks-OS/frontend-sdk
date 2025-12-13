import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Lead } from '../types/lead';
import { parseString, parseDate, parseBoolean, parseStatus, parseStringArray } from './utils';

export const leadMapper: ResourceMapper<Lead> = {
  type: 'Lead',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    firstName: parseString(resource.attributes['first_name']) || '',
    lastName: parseString(resource.attributes['last_name']) || '',
    middleName: parseString(resource.attributes['middle_name']),
    leadEmail: parseString(resource.attributes['lead_email']),
    phoneNumber: parseString(resource.attributes['phone_number']),
    webSite: parseString(resource.attributes['web_site']),
    twitter: parseString(resource.attributes['twitter']),
    fb: parseString(resource.attributes['fb']),
    instagram: parseString(resource.attributes['instagram']),
    linkedin: parseString(resource.attributes['linkedin']),
    youtube: parseString(resource.attributes['youtube']),
    blog: parseString(resource.attributes['blog']),
    notes: parseString(resource.attributes['notes']),
    source: parseString(resource.attributes['source']),
    status: parseStatus(resource.attributes['status']),
    contactStatus: parseString(resource.attributes['contact_status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    tags: parseStringArray(resource.attributes['tags']),
  }),
};
