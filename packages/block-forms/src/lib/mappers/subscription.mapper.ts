import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Subscription } from '../types/subscription';
import { parseString, parseDate, parseStatus } from './utils';

export const subscriptionMapper: ResourceMapper<Subscription> = {
  type: 'subscription',
  map: (resource) => ({
    uniqueId: resource.id,
    formUniqueId: parseString(resource.attributes['form_unique_id']) ?? '',
    userUniqueId: parseString(resource.attributes['user_unique_id']),
    email: parseString(resource.attributes['email']) ?? '',
    firstName: parseString(resource.attributes['first_name']),
    lastName: parseString(resource.attributes['last_name']),
    phone: parseString(resource.attributes['phone']),
    data: (resource.attributes['data'] as Record<string, unknown>) ?? {},
    status: parseStatus(resource.attributes['status']),
    subscribedAt: parseDate(resource.attributes['subscribed_at']),
    unsubscribedAt: parseDate(resource.attributes['unsubscribed_at']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at']),
    updatedAt: parseDate(resource.attributes['updated_at']),
  }),
};
