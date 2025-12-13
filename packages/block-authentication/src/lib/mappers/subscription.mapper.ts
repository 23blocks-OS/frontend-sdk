import type { ResourceMapper, IncludedMap, JsonApiResource } from '@23blocks/jsonapi-codec';
import type { EntityStatus } from '@23blocks/contracts';
import type {
  SubscriptionModel,
  UserSubscription,
  CompanySubscription,
} from '../types/index.js';
import { parseString, parseDate, parseNumber, parseBoolean } from './utils.js';

/**
 * Mapper for SubscriptionModel resources
 */
export const subscriptionModelMapper: ResourceMapper<SubscriptionModel> = {
  type: 'subscription_models',

  map(resource: JsonApiResource, _included: IncludedMap): SubscriptionModel {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      createdAt: parseDate(attrs.created_at) ?? new Date(),
      updatedAt: parseDate(attrs.updated_at) ?? new Date(),
      code: String(attrs.code ?? ''),
      status: (parseString(attrs.status) ?? 'active') as EntityStatus,
      description: parseString(attrs.description),
      promotional: parseBoolean(attrs.promotional),
      programCode: parseString(attrs.program_code),
      duration: parseNumber(attrs.duration),
      durationUnit: parseString(attrs.duration_unit),
      durationDescription: parseString(attrs.duration_description),
      recurringPaymentFees: parseNumber(attrs.recurring_payment_fees),
      recurringPaymentAmount: parseNumber(attrs.recurring_payment_amount),
      contentLink: parseString(attrs.content_link),
      startAt: parseDate(attrs.start_at),
      endAt: parseDate(attrs.end_at),
      isChannel: parseBoolean(attrs.is_channel),
      maxTenants: parseNumber(attrs.max_tenants),
      initialPayment: parseNumber(attrs.initial_payment),
      subscriptionType: parseString(attrs.subscription_type),
      payments: parseNumber(attrs.payments),
      payload: attrs.payload as Record<string, unknown> | null,
      maxItems: parseNumber(attrs.max_items),
    };
  },
};

/**
 * Mapper for UserSubscription resources
 */
export const userSubscriptionMapper: ResourceMapper<UserSubscription> = {
  type: 'user_subscriptions',

  map(resource: JsonApiResource, included: IncludedMap): UserSubscription {
    const attrs = resource.attributes ?? {};

    const subscription: UserSubscription = {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      createdAt: parseDate(attrs.created_at) ?? new Date(),
      updatedAt: parseDate(attrs.updated_at) ?? new Date(),
      code: String(attrs.code ?? ''),
      userUniqueId: String(attrs.user_unique_id ?? ''),
      programCode: parseString(attrs.program_code),
      recurringPaymentFees: parseNumber(attrs.recurring_payment_fees),
      recurringPaymentAmount: parseNumber(attrs.recurring_payment_amount),
      subscriptionNumber: parseString(attrs.subscription_number),
      subscribedAt: parseDate(attrs.subscribed_at),
      closedAt: parseDate(attrs.closed_at),
      lastPaymentAt: parseDate(attrs.last_payment_at),
      nextPaymentAt: parseDate(attrs.next_payment_at),
      lastPayment: parseNumber(attrs.last_payment),
      paymentsMade: parseNumber(attrs.payments_made) ?? 0,
      status: (parseString(attrs.status) ?? 'active') as EntityStatus,
      bankruptcy: parseBoolean(attrs.bankruptcy),
      initialPayment: parseNumber(attrs.initial_payment),
      subscriptionType: parseString(attrs.subscription_type),
      payments: parseNumber(attrs.payments),
      payload: attrs.payload as Record<string, unknown> | null,
      maxItems: parseNumber(attrs.max_items),
      consumption: parseNumber(attrs.consumption) ?? 0,
    };

    // Resolve subscription_model relationship if included
    if (included && resource.relationships?.subscription_model?.data) {
      const relData = resource.relationships.subscription_model.data;
      if (!Array.isArray(relData)) {
        const modelResource = included.get(`${relData.type}:${relData.id}`);
        if (modelResource) {
          subscription.subscriptionModel = subscriptionModelMapper.map(modelResource, included);
        }
      }
    }

    return subscription;
  },
};

/**
 * Mapper for CompanySubscription resources
 */
export const companySubscriptionMapper: ResourceMapper<CompanySubscription> = {
  type: 'company_subscriptions',

  map(resource: JsonApiResource, included: IncludedMap): CompanySubscription {
    const attrs = resource.attributes ?? {};

    const subscription: CompanySubscription = {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      createdAt: parseDate(attrs.created_at) ?? new Date(),
      updatedAt: parseDate(attrs.updated_at) ?? new Date(),
      code: String(attrs.code ?? ''),
      companyUniqueId: String(attrs.company_unique_id ?? ''),
      programCode: parseString(attrs.program_code),
      recurringPaymentFees: parseNumber(attrs.recurring_payment_fees),
      recurringPaymentAmount: parseNumber(attrs.recurring_payment_amount),
      subscriptionNumber: parseString(attrs.subscription_number),
      subscribedAt: parseDate(attrs.subscribed_at),
      closedAt: parseDate(attrs.closed_at),
      lastPaymentAt: parseDate(attrs.last_payment_at),
      nextPaymentAt: parseDate(attrs.next_payment_at),
      lastPayment: parseNumber(attrs.last_payment),
      paymentsMade: parseNumber(attrs.payments_made) ?? 0,
      status: (parseString(attrs.status) ?? 'active') as EntityStatus,
      bankruptcy: parseBoolean(attrs.bankruptcy),
      initialPayment: parseNumber(attrs.initial_payment),
      subscriptionType: parseString(attrs.subscription_type),
      payload: attrs.payload as Record<string, unknown> | null,
      maxItems: parseNumber(attrs.max_items),
      consumption: parseNumber(attrs.consumption) ?? 0,
    };

    // Resolve subscription_model relationship if included
    if (included && resource.relationships?.subscription_model?.data) {
      const relData = resource.relationships.subscription_model.data;
      if (!Array.isArray(relData)) {
        const modelResource = included.get(`${relData.type}:${relData.id}`);
        if (modelResource) {
          subscription.subscriptionModel = subscriptionModelMapper.map(modelResource, included);
        }
      }
    }

    return subscription;
  },
};
