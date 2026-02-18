import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Subscription, SubscriptionItem } from '../types/subscription.js';
import { parseString, parseDate, parseNumber } from './utils.js';

export const subscriptionMapper: ResourceMapper<Subscription> = {
  type: 'subscription',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes?.['unique_id']) || '',
    stripeCustomerId: parseString(resource.attributes?.['stripe_customer_id']),
    accountUniqueId: parseString(resource.attributes?.['account_unique_id']),
    accountCode: parseString(resource.attributes?.['account_code']),
    accountName: parseString(resource.attributes?.['account_name']),
    currency: parseString(resource.attributes?.['currency']),
    billingInterval: parseString(resource.attributes?.['billing_interval']),
    trialPeriodDays: parseNumber(resource.attributes?.['trial_period_days']) || undefined,
    status: parseString(resource.attributes?.['status']),
    metadata: resource.attributes?.['metadata'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes?.['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes?.['updated_at']) || new Date(),
  }),
};

export const subscriptionItemMapper: ResourceMapper<SubscriptionItem> = {
  type: 'subscription_item',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes?.['unique_id']) || '',
    subscriptionUniqueId: parseString(resource.attributes?.['subscription_unique_id']),
    stripePriceId: parseString(resource.attributes?.['stripe_price_id']),
    stripeProductId: parseString(resource.attributes?.['stripe_product_id']),
    blockCode: parseString(resource.attributes?.['block_code']),
    blockName: parseString(resource.attributes?.['block_name']),
    appUniqueId: parseString(resource.attributes?.['app_unique_id']),
    appName: parseString(resource.attributes?.['app_name']),
    appBlockUniqueId: parseString(resource.attributes?.['app_block_unique_id']),
    amountCents: parseNumber(resource.attributes?.['amount_cents']) || undefined,
    quantity: parseNumber(resource.attributes?.['quantity']) || undefined,
    status: parseString(resource.attributes?.['status']),
    metadata: resource.attributes?.['metadata'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes?.['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes?.['updated_at']) || new Date(),
  }),
};
