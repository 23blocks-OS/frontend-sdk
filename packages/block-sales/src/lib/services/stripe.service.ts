import type { Transport, PageResult } from '@23blocks/contracts';
import type {
  StripeCustomer,
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
} from '../types/stripe';

export interface StripeService {
  createCustomer(data: CreateStripeCustomerRequest): Promise<CreateStripeCustomerResponse>;
  createCheckoutSession(data: CreateStripeCheckoutSessionRequest): Promise<StripeCheckoutSession>;
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
      const response = await transport.post<any>('/stripe/customers', {
        email: data.email,
        name: data.name,
        phone: data.phone,
        metadata: data.metadata,
      });
      return {
        customerId: response.customer_id,
        customer: {
          id: response.customer.id,
          stripeId: response.customer.stripe_id,
          email: response.customer.email,
          name: response.customer.name,
          defaultPaymentMethod: response.customer.default_payment_method,
          metadata: response.customer.metadata,
          createdAt: new Date(response.customer.created_at),
        },
      };
    },

    async createCheckoutSession(data: CreateStripeCheckoutSessionRequest): Promise<StripeCheckoutSession> {
      const response = await transport.post<any>('/stripe/sessions', {
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
      });
      return {
        id: response.id,
        url: response.url,
        status: response.status,
        expiresAt: response.expires_at ? new Date(response.expires_at) : undefined,
      };
    },

    async createPaymentIntent(data: CreateStripePaymentIntentRequest): Promise<StripePaymentIntent> {
      const response = await transport.post<any>('/stripe/payments', {
        amount: data.amount,
        currency: data.currency,
        customer_unique_id: data.customerUniqueId,
        stripe_customer_id: data.stripeCustomerId,
        payment_method_types: data.paymentMethodTypes,
        metadata: data.metadata,
      });
      return {
        id: response.id,
        clientSecret: response.client_secret,
        status: response.status,
        amount: response.amount,
        currency: response.currency,
      };
    },

    async createCustomerPortal(uniqueId: string, data: CreateStripeCustomerPortalRequest): Promise<StripeCustomerPortalSession> {
      const response = await transport.post<any>(`/stripe/customers/${uniqueId}/portal`, {
        return_url: data.returnUrl,
      });
      return {
        id: response.id,
        url: response.url,
      };
    },

    async listSubscriptions(params?: ListStripeSubscriptionsParams): Promise<PageResult<StripeSubscription>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.customerId) queryParams['customer_id'] = params.customerId;
      if (params?.status) queryParams['status'] = params.status;

      const response = await transport.get<any>('/stripe/subscriptions', { params: queryParams });
      const data = response.data || [];
      return {
        data: data.map((s: any) => ({
          id: s.id,
          stripeId: s.stripe_id,
          customerId: s.customer_id,
          status: s.status,
          currentPeriodStart: s.current_period_start ? new Date(s.current_period_start) : undefined,
          currentPeriodEnd: s.current_period_end ? new Date(s.current_period_end) : undefined,
          cancelAtPeriodEnd: s.cancel_at_period_end,
          cancelledAt: s.cancelled_at ? new Date(s.cancelled_at) : undefined,
          metadata: s.metadata,
        })),
        meta: {
          totalCount: response.meta?.total_count || data.length,
          page: response.meta?.page || 1,
          perPage: response.meta?.per_page || data.length,
          totalPages: response.meta?.total_pages || 1,
        },
      };
    },

    async createSubscription(data: CreateStripeSubscriptionRequest): Promise<StripeSubscription> {
      const response = await transport.post<any>('/stripe/subscriptions', {
        customer_unique_id: data.customerUniqueId,
        stripe_customer_id: data.stripeCustomerId,
        price_id: data.priceId,
        quantity: data.quantity,
        trial_period_days: data.trialPeriodDays,
        metadata: data.metadata,
      });
      return {
        id: response.id,
        stripeId: response.stripe_id,
        customerId: response.customer_id,
        status: response.status,
        currentPeriodStart: response.current_period_start ? new Date(response.current_period_start) : undefined,
        currentPeriodEnd: response.current_period_end ? new Date(response.current_period_end) : undefined,
        cancelAtPeriodEnd: response.cancel_at_period_end,
        cancelledAt: response.cancelled_at ? new Date(response.cancelled_at) : undefined,
        metadata: response.metadata,
      };
    },

    async updateSubscription(stripeSubscriptionId: string, data: UpdateStripeSubscriptionRequest): Promise<StripeSubscription> {
      const response = await transport.put<any>(`/stripe/subscriptions/${stripeSubscriptionId}`, {
        price_id: data.priceId,
        quantity: data.quantity,
        cancel_at_period_end: data.cancelAtPeriodEnd,
        metadata: data.metadata,
      });
      return {
        id: response.id,
        stripeId: response.stripe_id,
        customerId: response.customer_id,
        status: response.status,
        currentPeriodStart: response.current_period_start ? new Date(response.current_period_start) : undefined,
        currentPeriodEnd: response.current_period_end ? new Date(response.current_period_end) : undefined,
        cancelAtPeriodEnd: response.cancel_at_period_end,
        cancelledAt: response.cancelled_at ? new Date(response.cancelled_at) : undefined,
        metadata: response.metadata,
      };
    },

    async cancelSubscription(stripeSubscriptionId: string): Promise<void> {
      await transport.delete(`/stripe/subscriptions/${stripeSubscriptionId}`);
    },

    async listWebhooks(): Promise<StripeWebhook[]> {
      const response = await transport.get<any>('/stripe/webhooks');
      return (response.webhooks || response || []).map((w: any) => ({
        id: w.id,
        url: w.url,
        enabledEvents: w.enabled_events,
        status: w.status,
        createdAt: new Date(w.created_at),
      }));
    },

    async createWebhook(data: CreateStripeWebhookRequest): Promise<StripeWebhook> {
      const response = await transport.post<any>('/stripe/webhooks', {
        url: data.url,
        enabled_events: data.enabledEvents,
      });
      return {
        id: response.id,
        url: response.url,
        enabledEvents: response.enabled_events,
        status: response.status,
        createdAt: new Date(response.created_at),
      };
    },
  };
}
