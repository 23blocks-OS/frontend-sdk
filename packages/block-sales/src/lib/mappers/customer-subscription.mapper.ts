import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { CustomerSubscription } from '../types/customer.js';
import { parseString, parseDate } from './utils.js';

export const customerSubscriptionMapper: ResourceMapper<CustomerSubscription> = {
  type: 'CustomerSubscription',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['subscription_unique_id'] ?? resource.attributes['unique_id']) || '',
    customerUniqueId: (resource.attributes['customer_unique_id'] as string) || '',
    subscriptionModelUniqueId: parseString(resource.attributes['subscription_model_unique_id'] ?? resource.attributes['code']) || '',
    subscriptionNumber: parseString(resource.attributes['subscription_number']),
    notes: parseString(resource.attributes['notes']),
    status: (resource.attributes['status'] as string) || '',
    startDate: parseDate(resource.attributes['start_at'] ?? resource.attributes['start_date']),
    endDate: parseDate(resource.attributes['end_at'] ?? resource.attributes['end_date']),
    trialEndDate: parseDate(resource.attributes['trial_end_date']),
    cancelledAt: parseDate(resource.attributes['closed_at'] ?? resource.attributes['cancelled_at']),
    createdAt: parseDate(resource.attributes['created_at'] ?? resource.attributes['subscribed_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at'] ?? resource.attributes['subscribed_at']) || new Date(),
  }),
};
