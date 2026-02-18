import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { SalesCustomer } from '../types/customer.js';
import { parseString, parseDate } from './utils.js';

export const salesCustomerMapper: ResourceMapper<SalesCustomer> = {
  type: 'customer',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes?.['unique_id']) || '',
    name: parseString(resource.attributes?.['name']),
    email: parseString(resource.attributes?.['email']),
    phone: parseString(resource.attributes?.['phone']),
    companyUniqueId: parseString(resource.attributes?.['company_unique_id']),
    stripeId: parseString(resource.attributes?.['stripe_id']),
    status: parseString(resource.attributes?.['status']),
    timeZone: parseString(resource.attributes?.['time_zone']),
    preferredLanguage: parseString(resource.attributes?.['preferred_language']),
    avatarUrl: parseString(resource.attributes?.['avatar_url']),
    emailNotifications: resource.attributes?.['email_notifications'] as boolean | undefined,
    smsNotifications: resource.attributes?.['sms_notifications'] as boolean | undefined,
    whatsappNotifications: resource.attributes?.['whatsapp_notifications'] as boolean | undefined,
    otherNotifications: resource.attributes?.['other_notifications'] as boolean | undefined,
    source: parseString(resource.attributes?.['source']),
    sourceAlias: parseString(resource.attributes?.['source_alias']),
    sourceId: parseString(resource.attributes?.['source_id']),
    sourceType: parseString(resource.attributes?.['source_type']),
    createdAt: parseDate(resource.attributes?.['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes?.['updated_at']) || new Date(),
  }),
};
