import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { SubscriptionModel } from '../types/subscription-model';
import { parseDate } from './utils';

export const subscriptionModelMapper: ResourceMapper<SubscriptionModel> = {
  type: 'subscription_model',
  map: (resource) => ({
    id: resource.id,
    uniqueId: resource.attributes?.['unique_id'] as string,
    code: resource.attributes?.['code'] as string,
    name: resource.attributes?.['name'] as string,
    description: resource.attributes?.['description'] as string | undefined,
    price: resource.attributes?.['price'] as number,
    currency: resource.attributes?.['currency'] as string,
    interval: resource.attributes?.['interval'] as string,
    intervalCount: resource.attributes?.['interval_count'] as number,
    trialDays: resource.attributes?.['trial_days'] as number | undefined,
    features: resource.attributes?.['features'] as string[] | undefined,
    limits: resource.attributes?.['limits'] as Record<string, number> | undefined,
    enabled: resource.attributes?.['enabled'] as boolean,
    status: resource.attributes?.['status'] as string,
    payload: resource.attributes?.['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes?.['created_at']),
    updatedAt: parseDate(resource.attributes?.['updated_at']),
  }),
};
