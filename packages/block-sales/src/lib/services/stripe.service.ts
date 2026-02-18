import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  CreateStripeCustomerRequest,
  CreateStripeCustomerResponse,
  StripeCheckoutSession,
  CreateStripeCheckoutSessionRequest,
  StripePaymentIntent,
  CreateStripePaymentIntentRequest,
  StripeSubscription,
  CreateStripeSubscriptionRequest,
  UpdateStripeSubscriptionRequest,
  StripeCustomerPortalSession,
  CreateStripeCustomerPortalRequest,
  StripeWebhook,
  CreateStripeWebhookRequest,
  ListStripeSubscriptionsParams,
} from '../types/stripe.js';
import {
  stripeCustomerResponseMapper,
  stripeCheckoutSessionMapper,
  stripePaymentIntentMapper,
  stripeSubscriptionMapper,
  stripeCustomerPortalMapper,
  stripeWebhookMapper,
} from '../mappers/stripe.mapper.js';

function buildSubscriptionBody(data: CreateStripeSubscriptionRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.customerId) body['customer_id'] = data.customerId;
  if (data.setupPriceId) body['setup_price_id'] = data.setupPriceId;
  if (data.subscriptionPriceId) body['subscription_price_id'] = data.subscriptionPriceId;
  if (data.priceUniqueId) body['price_unique_id'] = data.priceUniqueId;
  if (data.localPriceId) body['local_price_id'] = data.localPriceId;
  if (data.cardToken) body['card_token'] = data.cardToken;
  if (data.trialPeriodDays !== undefined) body['trial_period_days'] = data.trialPeriodDays;
  if (data.multipleSubscriptions !== undefined) body['multiple_subscriptions'] = data.multipleSubscriptions;
  if (data.appName) body['app_name'] = data.appName;
  if (data.parentName) body['parent_name'] = data.parentName;
  if (data.description) body['description'] = data.description;
  if (data.subscriptionType) body['subscription_type'] = data.subscriptionType;
  if (data.entityType) body['entity_type'] = data.entityType;
  if (data.entityId) body['entity_id'] = data.entityId;
  if (data.customerCompanyId) body['customer_company_id'] = data.customerCompanyId;
  return body;
}

export interface StripeService {
  createCustomer(data: CreateStripeCustomerRequest): Promise<CreateStripeCustomerResponse>;
  createCheckoutSession(data: CreateStripeCheckoutSessionRequest): Promise<StripeCheckoutSession>;
  verifySession(sessionId: string): Promise<StripeCheckoutSession>;
  createPaymentIntent(data: CreateStripePaymentIntentRequest): Promise<StripePaymentIntent>;
  createCustomerPortal(uniqueId: string, data: CreateStripeCustomerPortalRequest): Promise<StripeCustomerPortalSession>;
  listSubscriptions(params?: ListStripeSubscriptionsParams): Promise<PageResult<StripeSubscription>>;
  createSubscription(data: CreateStripeSubscriptionRequest): Promise<StripeSubscription>;
  updateSubscription(stripeSubscriptionId: string, data: UpdateStripeSubscriptionRequest): Promise<StripeSubscription>;
  cancelSubscription(stripeSubscriptionId: string): Promise<void>;
  listWebhooks(): Promise<StripeWebhook[]>;
  createWebhook(data: CreateStripeWebhookRequest): Promise<StripeWebhook>;
}

export function createStripeService(transport: Transport, _config: { appId: string }): StripeService {
  return {
    async createCustomer(data: CreateStripeCustomerRequest): Promise<CreateStripeCustomerResponse> {
      const response = await transport.post<unknown>('/stripe/customers', {
        customer: {
          name: data.name,
          phone: data.phone,
          email: data.email,
          token: data.token,
          user_unique_id: data.userUniqueId,
          identity_type: data.identityType,
          company_unique_id: data.companyUniqueId,
          entity_unique_id: data.entityUniqueId,
          entity_type: data.entityType,
        },
      });
      return decodeOne(response, stripeCustomerResponseMapper);
    },

    async createCheckoutSession(data: CreateStripeCheckoutSessionRequest): Promise<StripeCheckoutSession> {
      const response = await transport.post<unknown>('/stripe/sessions', {
        session: {
          price: data.price,
          success_url: data.successUrl,
          cancel_url: data.cancelUrl,
          mode: data.mode,
          customer: data.customer,
          quantity: data.quantity,
          trial_period_days: data.trialPeriodDays,
          subscription_type: data.subscriptionType,
          price_unique_id: data.priceUniqueId,
          identity_type: data.identityType,
          description: data.description,
          subscription_model_code: data.subscriptionModelCode,
          allow_promotion_codes: data.allowPromotionCodes,
          coupon_id: data.couponId,
        },
      });
      return decodeOne(response, stripeCheckoutSessionMapper);
    },

    async verifySession(sessionId: string): Promise<StripeCheckoutSession> {
      const response = await transport.get<unknown>(`/stripe/sessions/${sessionId}`);
      return decodeOne(response, stripeCheckoutSessionMapper);
    },

    async createPaymentIntent(data: CreateStripePaymentIntentRequest): Promise<StripePaymentIntent> {
      const response = await transport.post<unknown>('/stripe/payments', {
        payment: {
          customer_id: data.customerId,
          currency: data.currency,
          order_unique_id: data.orderUniqueId,
          identity_type: data.identityType,
          entity_type: data.entityType,
          entity_id: data.entityId,
        },
      });
      return decodeOne(response, stripePaymentIntentMapper);
    },

    async createCustomerPortal(uniqueId: string, data: CreateStripeCustomerPortalRequest): Promise<StripeCustomerPortalSession> {
      const response = await transport.post<unknown>(`/stripe/customers/${uniqueId}/portal`, {
        portal: {
          customer_id: data.customerId,
          return_url: data.returnUrl,
        },
      });
      return decodeOne(response, stripeCustomerPortalMapper);
    },

    async listSubscriptions(params?: ListStripeSubscriptionsParams): Promise<PageResult<StripeSubscription>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.customerId) queryParams['customer_id'] = params.customerId;
      if (params?.status) queryParams['status'] = params.status;

      const response = await transport.get<unknown>('/stripe/subscriptions', { params: queryParams });
      return decodePageResult(response, stripeSubscriptionMapper);
    },

    async createSubscription(data: CreateStripeSubscriptionRequest): Promise<StripeSubscription> {
      const response = await transport.post<unknown>('/stripe/subscriptions', {
        subscription: buildSubscriptionBody(data),
      });
      return decodeOne(response, stripeSubscriptionMapper);
    },

    async updateSubscription(stripeSubscriptionId: string, data: UpdateStripeSubscriptionRequest): Promise<StripeSubscription> {
      const response = await transport.put<unknown>(`/stripe/subscriptions/${stripeSubscriptionId}`, {
        subscription: buildSubscriptionBody(data),
      });
      return decodeOne(response, stripeSubscriptionMapper);
    },

    async cancelSubscription(stripeSubscriptionId: string): Promise<void> {
      await transport.delete(`/stripe/subscriptions/${stripeSubscriptionId}`);
    },

    async listWebhooks(): Promise<StripeWebhook[]> {
      const response = await transport.get<unknown>('/stripe/webhooks');
      return decodeMany(response, stripeWebhookMapper);
    },

    async createWebhook(data: CreateStripeWebhookRequest): Promise<StripeWebhook> {
      const response = await transport.post<unknown>('/stripe/webhooks', {
        webhook: {
          url: data.url,
          enabled_events: data.enabledEvents,
        },
      });
      return decodeOne(response, stripeWebhookMapper);
    },
  };
}
