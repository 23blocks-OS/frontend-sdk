import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type {
  CreateStripeCustomerResponse,
  StripeCheckoutSession,
  StripePaymentIntent,
  StripeSubscription,
  StripeCustomerPortalSession,
  StripeWebhook,
} from '../types/stripe.js';
import { parseDate, parseNumber, parseBoolean, parseStringArray } from './utils.js';

export const stripeCustomerResponseMapper: ResourceMapper<CreateStripeCustomerResponse> = {
  type: 'StripeCustomer',
  map: (resource) => ({
    customerId: (resource.attributes['customer_id'] as string) ?? resource.id,
    customer: {
      id: resource.id,
      stripeId: (resource.attributes['stripe_id'] ?? resource.attributes['customer_id'] ?? resource.id) as string,
      email: resource.attributes['email'] as string | undefined,
      name: resource.attributes['name'] as string | undefined,
      defaultPaymentMethod: resource.attributes['default_payment_method'] as string | undefined,
      metadata: resource.attributes['metadata'] as Record<string, unknown> | undefined,
      createdAt: parseDate(resource.attributes['created_at']) ?? new Date(),
    },
  }),
};

export const stripeCheckoutSessionMapper: ResourceMapper<StripeCheckoutSession> = {
  type: 'StripeSession',
  map: (resource) => ({
    id: resource.id,
    url: resource.attributes['url'] as string,
    status: resource.attributes['status'] as string,
    expiresAt: parseDate(resource.attributes['expires_at']),
    mode: resource.attributes['mode'] as string | undefined,
    customer: resource.attributes['customer'] as string | undefined,
    paymentStatus: resource.attributes['payment_status'] as string | undefined,
    metadata: resource.attributes['metadata'] as Record<string, unknown> | undefined,
  }),
};

export const stripePaymentIntentMapper: ResourceMapper<StripePaymentIntent> = {
  type: 'StripePaymentIntent',
  map: (resource) => ({
    id: resource.id,
    paymentIntentId: resource.attributes['payment_intent_id'] as string,
    clientSecret: resource.attributes['client_secret'] as string,
    status: resource.attributes['status'] as string,
    amount: parseNumber(resource.attributes['amount']),
    currency: resource.attributes['currency'] as string,
    customer: resource.attributes['customer'] as string | undefined,
    metadata: resource.attributes['metadata'] as Record<string, unknown> | undefined,
  }),
};

export const stripeSubscriptionMapper: ResourceMapper<StripeSubscription> = {
  type: 'StripeSubscription',
  map: (resource) => ({
    id: resource.id,
    stripeId: (resource.attributes['stripe_id'] ?? resource.id) as string,
    customerId: resource.attributes['customer_id'] as string,
    status: resource.attributes['status'] as string,
    currentPeriodStart: parseDate(resource.attributes['current_period_start']),
    currentPeriodEnd: parseDate(resource.attributes['current_period_end']),
    cancelAtPeriodEnd: parseBoolean(resource.attributes['cancel_at_period_end']),
    cancelledAt: parseDate(resource.attributes['cancelled_at']),
    metadata: resource.attributes['metadata'] as Record<string, unknown> | undefined,
  }),
};

export const stripeCustomerPortalMapper: ResourceMapper<StripeCustomerPortalSession> = {
  type: 'StripeCustomerPortal',
  map: (resource) => ({
    id: resource.id,
    url: resource.attributes['url'] as string,
  }),
};

export const stripeWebhookMapper: ResourceMapper<StripeWebhook> = {
  type: 'StripeWebhook',
  map: (resource) => ({
    id: resource.id,
    url: resource.attributes['url'] as string,
    enabledEvents: parseStringArray(resource.attributes['enabled_events']) ?? [],
    status: resource.attributes['status'] as string,
    createdAt: parseDate(resource.attributes['created_at']) ?? new Date(),
  }),
};
