import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Subscription } from '../types/subscription';
import { parseString, parseDate, parseNumber, parseSubscriptionStatus, parseSubscriptionInterval } from './utils';

export const subscriptionMapper: ResourceMapper<Subscription> = {
  type: 'Subscription',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    userUniqueId: parseString(resource.attributes['user_unique_id']) || '',
    planUniqueId: parseString(resource.attributes['plan_unique_id']) || '',
    planName: parseString(resource.attributes['plan_name']) || '',
    price: parseNumber(resource.attributes['price']),
    currency: parseString(resource.attributes['currency']) || 'USD',
    interval: parseSubscriptionInterval(resource.attributes['interval']),
    status: parseSubscriptionStatus(resource.attributes['status']),
    startDate: parseDate(resource.attributes['start_date']) || new Date(),
    endDate: parseDate(resource.attributes['end_date']),
    nextBillingDate: parseDate(resource.attributes['next_billing_date']),
    cancelledAt: parseDate(resource.attributes['cancelled_at']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
