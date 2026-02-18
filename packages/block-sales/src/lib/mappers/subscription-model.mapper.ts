import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { SubscriptionModel } from '../types/subscription-model.js';
import { parseString, parseDate, parseNumber } from './utils.js';

export const subscriptionModelMapper: ResourceMapper<SubscriptionModel> = {
  type: 'subscription_model',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes?.['unique_id']) || '',
    code: parseString(resource.attributes?.['code']),
    description: parseString(resource.attributes?.['description']),
    promotional: resource.attributes?.['promotional'] as boolean | undefined,
    programCode: parseString(resource.attributes?.['program_code']),
    duration: parseNumber(resource.attributes?.['duration']) || undefined,
    durationUnit: parseString(resource.attributes?.['duration_unit']),
    durationDescription: parseString(resource.attributes?.['duration_description']),
    recurringPaymentFees: parseNumber(resource.attributes?.['recurring_payment_fees']) || undefined,
    recurringPaymentAmount: parseNumber(resource.attributes?.['recurring_payment_amount']) || undefined,
    contentUrl: parseString(resource.attributes?.['content_url']),
    startAt: parseDate(resource.attributes?.['start_at']),
    endAt: parseDate(resource.attributes?.['end_at']),
    initialPayment: parseNumber(resource.attributes?.['initial_payment']) || undefined,
    subscriptionType: parseString(resource.attributes?.['subscription_type']),
    maxItems: parseNumber(resource.attributes?.['max_items']) || undefined,
    stripeProductId: parseString(resource.attributes?.['stripe_product_id']),
    productType: parseString(resource.attributes?.['product_type']),
    trialPeriodDays: parseNumber(resource.attributes?.['trial_period_days']) || undefined,
    allowPromotionCodes: resource.attributes?.['allow_promotion_codes'] as boolean | undefined,
    features: resource.attributes?.['features'] as Record<string, unknown> | undefined,
    status: parseString(resource.attributes?.['status']),
    createdAt: parseDate(resource.attributes?.['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes?.['updated_at']) || new Date(),
  }),
};
