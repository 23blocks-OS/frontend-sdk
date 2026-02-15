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

export interface StripeService {
  /**
   * Create a Stripe customer.
   * @returns CreateStripeCustomerResponse with `customerId` and `customer` details.
   */
  createCustomer(data: CreateStripeCustomerRequest): Promise<CreateStripeCustomerResponse>;

  /**
   * Create a Stripe checkout session.
   * @returns StripeCheckoutSession with `id`, `url`, `status`, and `expiresAt`.
   */
  createCheckoutSession(data: CreateStripeCheckoutSessionRequest): Promise<StripeCheckoutSession>;

  /**
   * Verify/retrieve a Stripe checkout session by session ID.
   * @returns StripeCheckoutSession with session details.
   */
  verifySession(sessionId: string): Promise<StripeCheckoutSession>;

  /**
   * Create a Stripe payment intent.
   * @returns StripePaymentIntent with `id`, `clientSecret`, `status`, `amount`, and `currency`.
   */
  createPaymentIntent(data: CreateStripePaymentIntentRequest): Promise<StripePaymentIntent>;

  /**
   * Create a Stripe customer portal session for managing billing.
   * @returns StripeCustomerPortalSession with `id` and `url`.
   */
  createCustomerPortal(uniqueId: string, data: CreateStripeCustomerPortalRequest): Promise<StripeCustomerPortalSession>;

  /**
   * List Stripe subscriptions with optional filtering.
   * @returns Paginated list of StripeSubscription records.
   */
  listSubscriptions(params?: ListStripeSubscriptionsParams): Promise<PageResult<StripeSubscription>>;

  /**
   * Create a Stripe subscription.
   * @returns The newly created StripeSubscription record.
   */
  createSubscription(data: CreateStripeSubscriptionRequest): Promise<StripeSubscription>;

  /**
   * Update an existing Stripe subscription.
   * @returns The updated StripeSubscription record.
   */
  updateSubscription(stripeSubscriptionId: string, data: UpdateStripeSubscriptionRequest): Promise<StripeSubscription>;

  /**
   * Cancel a Stripe subscription.
   */
  cancelSubscription(stripeSubscriptionId: string): Promise<void>;

  /**
   * List configured Stripe webhooks.
   * @returns Array of StripeWebhook records.
   */
  listWebhooks(): Promise<StripeWebhook[]>;

  /**
   * Create a new Stripe webhook endpoint.
   * @returns The newly created StripeWebhook record.
   */
  createWebhook(data: CreateStripeWebhookRequest): Promise<StripeWebhook>;
}

export function createStripeService(transport: Transport, _config: { appId: string }): StripeService {
  return {
    async createCustomer(data: CreateStripeCustomerRequest): Promise<CreateStripeCustomerResponse> {
      const response = await transport.post<unknown>('/stripe/customers', {
        customer: {
          email: data.email,
          name: data.name,
          phone: data.phone,
          token: data.token,
          user_unique_id: data.userUniqueId,
          identity_type: data.identityType,
          company_unique_id: data.companyUniqueId,
          entity_unique_id: data.entityUniqueId,
          entity_type: data.entityType,
          metadata: data.metadata,
        },
      });
      return decodeOne(response, stripeCustomerResponseMapper);
    },

    async createCheckoutSession(data: CreateStripeCheckoutSessionRequest): Promise<StripeCheckoutSession> {
      const response = await transport.post<unknown>('/stripe/sessions', {
        session: {
          customer_unique_id: data.customerUniqueId,
          stripe_customer_id: data.stripeCustomerId,
          success_url: data.successUrl,
          cancel_url: data.cancelUrl,
          mode: data.mode,
          line_items: data.lineItems?.map(item => ({
            price_id: item.priceId,
            quantity: item.quantity,
            price_data: item.priceData ? {
              currency: item.priceData.currency,
              unit_amount: item.priceData.unitAmount,
              product_data: item.priceData.productData,
              recurring: item.priceData.recurring,
            } : undefined,
          })),
          subscription_data: data.subscriptionData ? {
            trial_period_days: data.subscriptionData.trialPeriodDays,
            metadata: data.subscriptionData.metadata,
          } : undefined,
          metadata: data.metadata,
          subscription_model_code: data.subscriptionModelCode,
          price_unique_id: data.priceUniqueId,
          price: data.price,
          customer: data.customer,
          quantity: data.quantity,
          trial_period_days: data.trialPeriodDays,
          subscription_type: data.subscriptionType,
          identity_type: data.identityType,
          description: data.description,
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
          currency: data.currency,
          order_unique_id: data.orderUniqueId,
          order_id: data.orderId,
          identity_type: data.identityType,
          entity_type: data.entityType,
          customer_id: data.customerId,
          entity_id: data.entityId,
        },
      });
      return decodeOne(response, stripePaymentIntentMapper);
    },

    async createCustomerPortal(uniqueId: string, data: CreateStripeCustomerPortalRequest): Promise<StripeCustomerPortalSession> {
      const response = await transport.post<unknown>(`/stripe/customers/${uniqueId}/portal`, {
        portal: {
          return_url: data.returnUrl,
          customer_id: data.customerId,
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
        subscription: {
          customer_unique_id: data.customerUniqueId,
          stripe_customer_id: data.stripeCustomerId,
          price_id: data.priceId,
          price_unique_id: data.priceUniqueId,
          quantity: data.quantity,
          trial_period_days: data.trialPeriodDays,
          customer_id: data.customerId,
          setup_price_id: data.setupPriceId,
          subscription_price_id: data.subscriptionPriceId,
          card_token: data.cardToken,
          subscription_type: data.subscriptionType,
          identity_type: data.identityType,
          company_unique_id: data.companyUniqueId,
          entity_unique_id: data.entityUniqueId,
          entity_type: data.entityType,
          metadata: data.metadata,
        },
      });
      return decodeOne(response, stripeSubscriptionMapper);
    },

    async updateSubscription(stripeSubscriptionId: string, data: UpdateStripeSubscriptionRequest): Promise<StripeSubscription> {
      const response = await transport.put<unknown>(`/stripe/subscriptions/${stripeSubscriptionId}`, {
        subscription: {
          price_id: data.priceId,
          quantity: data.quantity,
          cancel_at_period_end: data.cancelAtPeriodEnd,
          metadata: data.metadata,
        },
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
