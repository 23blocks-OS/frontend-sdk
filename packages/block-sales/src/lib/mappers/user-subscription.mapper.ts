import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { UserSubscription } from '../types/user.js';
import { parseDate, parseNumber, parseOptionalNumber } from './utils.js';

export const userSubscriptionMapper: ResourceMapper<UserSubscription> = {
  type: 'UserSubscription',
  map: (resource) => ({
    id: resource.id,
    uniqueId: (resource.attributes['subscription_unique_id'] ?? resource.attributes['unique_id']) as string,
    userUniqueId: resource.attributes['user_unique_id'] as string,
    subscriptionModelUniqueId: (resource.attributes['subscription_model_unique_id'] ?? resource.attributes['code']) as string,
    status: resource.attributes['status'] as string,
    startDate: parseDate(resource.attributes['start_at'] ?? resource.attributes['start_date']),
    endDate: parseDate(resource.attributes['end_at'] ?? resource.attributes['end_date']),
    trialEndDate: parseDate(resource.attributes['trial_end_date']),
    cancelledAt: parseDate(resource.attributes['closed_at'] ?? resource.attributes['cancelled_at']),
    consumptions: Array.isArray(resource.attributes['consumptions'])
      ? (resource.attributes['consumptions'] as any[]).map((c) => ({
          id: c.id as string,
          quantity: parseNumber(c.quantity),
          description: c.description as string | undefined,
          consumedAt: parseDate(c.consumed_at) ?? new Date(),
        }))
      : undefined,
    maxItems: parseOptionalNumber(resource.attributes['max_items']),
    consumption: parseNumber(resource.attributes['consumption']),
    subscriptionNumber: resource.attributes['subscription_number'] as string | undefined,
    code: resource.attributes['code'] as string | undefined,
    recurringPaymentAmount: parseOptionalNumber(resource.attributes['recurring_payment_amount']),
    notes: resource.attributes['notes'] as string | undefined,
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at'] ?? resource.attributes['subscribed_at']) ?? new Date(),
    updatedAt: parseDate(resource.attributes['updated_at'] ?? resource.attributes['subscribed_at']) ?? new Date(),
  }),
};
