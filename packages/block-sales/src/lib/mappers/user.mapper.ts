import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { SalesUser } from '../types/user.js';
import { parseString, parseDate } from './utils.js';

export const salesUserMapper: ResourceMapper<SalesUser> = {
  type: 'user',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes?.['unique_id']) || '',
    name: parseString(resource.attributes?.['name']),
    firstName: parseString(resource.attributes?.['first_name']),
    lastName: parseString(resource.attributes?.['last_name']),
    email: parseString(resource.attributes?.['email']),
    phone: parseString(resource.attributes?.['phone']),
    avatarUrl: parseString(resource.attributes?.['avatar_url']),
    roleName: parseString(resource.attributes?.['role_name']),
    roleUniqueId: parseString(resource.attributes?.['role_unique_id']),
    stripeId: parseString(resource.attributes?.['stripe_id']),
    timeZone: parseString(resource.attributes?.['time_zone']),
    preferredLanguage: parseString(resource.attributes?.['preferred_language']),
    emailNotifications: resource.attributes?.['email_notifications'] as boolean | undefined,
    smsNotifications: resource.attributes?.['sms_notifications'] as boolean | undefined,
    whatsappNotifications: resource.attributes?.['whatsapp_notifications'] as boolean | undefined,
    otherNotifications: resource.attributes?.['other_notifications'] as boolean | undefined,
    status: parseString(resource.attributes?.['status']),
    createdAt: parseDate(resource.attributes?.['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes?.['updated_at']) || new Date(),
  }),
};
