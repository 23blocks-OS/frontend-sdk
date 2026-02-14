import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { EntitySubscription } from '../types/entity.js';
import { parseDate } from './utils.js';

export const entitySubscriptionMapper: ResourceMapper<EntitySubscription> = {
  type: 'EntitySubscription',
  map: (resource) => ({
    id: resource.id,
    uniqueId: (resource.attributes['subscription_unique_id'] ?? resource.attributes['unique_id']) as string,
    entityUniqueId: resource.attributes['entity_unique_id'] as string,
    subscriptionModelUniqueId: (resource.attributes['subscription_model_unique_id'] ?? resource.attributes['code']) as string,
    status: resource.attributes['status'] as string,
    startDate: parseDate(resource.attributes['start_at'] ?? resource.attributes['start_date']),
    endDate: parseDate(resource.attributes['end_at'] ?? resource.attributes['end_date']),
    trialEndDate: parseDate(resource.attributes['trial_end_date']),
    cancelledAt: parseDate(resource.attributes['closed_at'] ?? resource.attributes['cancelled_at']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes['created_at'] ?? resource.attributes['subscribed_at']) ?? new Date(),
    updatedAt: parseDate(resource.attributes['updated_at'] ?? resource.attributes['subscribed_at']) ?? new Date(),
  }),
};
