import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Contact, ContactProfile } from '../types/contact';
import { parseString, parseDate, parseBoolean, parseStatus, parseStringArray } from './utils';

export const contactMapper: ResourceMapper<Contact> = {
  type: 'Contact',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    firstName: parseString(resource.attributes['first_name']) || '',
    lastName: parseString(resource.attributes['last_name']) || '',
    middleName: parseString(resource.attributes['middle_name']),
    primaryEmail: parseString(resource.attributes['primary_email']),
    primaryPhone: parseString(resource.attributes['primary_phone']),
    position: parseString(resource.attributes['position']),
    notes: parseString(resource.attributes['notes']),
    source: parseString(resource.attributes['source']),
    sourceId: parseString(resource.attributes['source_id']),
    sourceAlias: parseString(resource.attributes['source_alias']),
    sourceType: parseString(resource.attributes['source_type']),
    status: parseStatus(resource.attributes['status']),
    contactStatus: parseString(resource.attributes['contact_status']),
    userUniqueId: parseString(resource.attributes['user_unique_id']),
    enabled: parseBoolean(resource.attributes['enabled']),
    tags: parseStringArray(resource.attributes['tags']),
  }),
};

export const contactProfileMapper: ResourceMapper<ContactProfile> = {
  type: 'ContactProfile',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    contactUniqueId: parseString(resource.attributes['contact_unique_id']) || '',
    firstName: parseString(resource.attributes['first_name']) || '',
    lastName: parseString(resource.attributes['last_name']) || '',
    middleName: parseString(resource.attributes['middle_name']),
    primaryEmail: parseString(resource.attributes['primary_email']),
    primaryPhone: parseString(resource.attributes['primary_phone']),
    position: parseString(resource.attributes['position']),
    notes: parseString(resource.attributes['notes']),
    source: parseString(resource.attributes['source']),
    sourceId: parseString(resource.attributes['source_id']),
    sourceAlias: parseString(resource.attributes['source_alias']),
    sourceType: parseString(resource.attributes['source_type']),
    status: parseStatus(resource.attributes['status']),
    contactStatus: parseString(resource.attributes['contact_status']),
    userUniqueId: parseString(resource.attributes['user_unique_id']),
    enabled: parseBoolean(resource.attributes['enabled']),
    tags: parseStringArray(resource.attributes['tags']),
  }),
};
