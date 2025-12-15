export interface StripeCustomer {
  id: string;
  stripeId: string;
  email?: string;
  name?: string;
  defaultPaymentMethod?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface CreateStripeCustomerRequest {
  email: string;
  name?: string;
  phone?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateStripeCustomerResponse {
  customerId: string;
  customer: StripeCustomer;
}

export interface StripeCheckoutSession {
  id: string;
  url: string;
  status: string;
  expiresAt?: Date;
}

export interface CreateStripeCheckoutSessionRequest {
  customerUniqueId?: string;
  stripeCustomerId?: string;
  successUrl: string;
  cancelUrl: string;
  mode: 'payment' | 'subscription' | 'setup';
  lineItems?: StripeLineItem[];
  subscriptionData?: {
    trialPeriodDays?: number;
    metadata?: Record<string, unknown>;
  };
  metadata?: Record<string, unknown>;
}

export interface StripeLineItem {
  priceId?: string;
  quantity: number;
  priceData?: {
    currency: string;
    unitAmount: number;
    productData: {
      name: string;
      description?: string;
    };
    recurring?: {
      interval: 'day' | 'week' | 'month' | 'year';
      intervalCount?: number;
    };
  };
}

export interface StripePaymentIntent {
  id: string;
  clientSecret: string;
  status: string;
  amount: number;
  currency: string;
}

export interface CreateStripePaymentIntentRequest {
  amount: number;
  currency: string;
  customerUniqueId?: string;
  stripeCustomerId?: string;
  paymentMethodTypes?: string[];
  metadata?: Record<string, unknown>;
}

export interface StripeSubscription {
  id: string;
  stripeId: string;
  customerId: string;
  status: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd: boolean;
  cancelledAt?: Date;
  metadata?: Record<string, unknown>;
}

export interface CreateStripeSubscriptionRequest {
  customerUniqueId?: string;
  stripeCustomerId?: string;
  priceId: string;
  quantity?: number;
  trialPeriodDays?: number;
  metadata?: Record<string, unknown>;
}

export interface UpdateStripeSubscriptionRequest {
  priceId?: string;
  quantity?: number;
  cancelAtPeriodEnd?: boolean;
  metadata?: Record<string, unknown>;
}

export interface StripeCustomerPortalSession {
  id: string;
  url: string;
}

export interface CreateStripeCustomerPortalRequest {
  returnUrl: string;
}

export interface StripeWebhook {
  id: string;
  url: string;
  enabledEvents: string[];
  status: string;
  createdAt: Date;
}

export interface CreateStripeWebhookRequest {
  url: string;
  enabledEvents: string[];
}

export interface ListStripeSubscriptionsParams {
  page?: number;
  perPage?: number;
  customerId?: string;
  status?: string;
}
