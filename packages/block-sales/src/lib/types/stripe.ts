export interface StripeCustomer {
  id: string;
  stripeId: string;
  email?: string;
  name?: string;
  defaultPaymentMethod?: string;
  createdAt: Date;
}

/** Common optional fields shared across all identity types. */
interface CreateStripeCustomerBase {
  name?: string;
  phone?: string;
  token?: string;
}

/**
 * Create a Stripe customer as an individual user (B2C).
 *
 * Required fields: `email`, `userUniqueId`
 */
export interface CreateStripeCustomerUserRequest extends CreateStripeCustomerBase {
  identityType?: 'user';
  email: string;
  userUniqueId: string;
  companyUniqueId?: never;
  entityUniqueId?: never;
  entityType?: never;
}

/**
 * Create a Stripe customer as a company (B2B).
 *
 * Required fields: `email`, `companyUniqueId`
 */
export interface CreateStripeCustomerCompanyRequest extends CreateStripeCustomerBase {
  identityType: 'customer';
  email: string;
  companyUniqueId: string;
  userUniqueId?: never;
  entityUniqueId?: never;
  entityType?: never;
}

/**
 * Create a Stripe customer as an entity (AI agents, autonomous systems).
 *
 * Required fields: `entityUniqueId`
 */
export interface CreateStripeCustomerEntityRequest extends CreateStripeCustomerBase {
  identityType: 'entity';
  entityUniqueId: string;
  entityType?: string;
  email?: string;
  userUniqueId?: never;
  companyUniqueId?: never;
}

export type CreateStripeCustomerRequest =
  | CreateStripeCustomerUserRequest
  | CreateStripeCustomerCompanyRequest
  | CreateStripeCustomerEntityRequest;

export interface CreateStripeCustomerResponse {
  customerId: string;
  customer: StripeCustomer;
}

export interface StripeCheckoutSession {
  id: string;
  url: string;
  status: string;
  expiresAt?: Date;
  mode?: string;
  customer?: string;
  paymentStatus?: string;
}

/** Matches session_params in stripe_controller.rb */
export interface CreateStripeCheckoutSessionRequest {
  price?: string;
  successUrl: string;
  cancelUrl: string;
  mode?: 'payment' | 'subscription' | 'setup';
  customer?: string;
  quantity?: number;
  trialPeriodDays?: number;
  subscriptionType?: string;
  priceUniqueId?: string;
  identityType?: string;
  description?: string;
  subscriptionModelCode?: string;
  allowPromotionCodes?: boolean;
  couponId?: string;
}

export interface StripePaymentIntent {
  id: string;
  paymentIntentId: string;
  clientSecret: string;
  status: string;
  amount: number;
  currency: string;
  customer?: string;
  metadata?: Record<string, unknown>;
}

/** Matches payment_params in stripe_controller.rb */
export interface CreateStripePaymentIntentRequest {
  customerId?: string;
  currency: string;
  orderUniqueId?: string;
  identityType?: string;
  entityType?: string;
  entityId?: string;
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

/** Matches subscription_params in stripe_controller.rb */
export interface CreateStripeSubscriptionRequest {
  customerId?: string;
  setupPriceId?: string;
  subscriptionPriceId?: string;
  priceUniqueId?: string;
  localPriceId?: string;
  cardToken?: string;
  trialPeriodDays?: number;
  multipleSubscriptions?: boolean;
  appName?: string;
  parentName?: string;
  description?: string;
  subscriptionType?: string;
  entityType?: string;
  entityId?: string;
  customerCompanyId?: string;
}

export type UpdateStripeSubscriptionRequest = CreateStripeSubscriptionRequest;

export interface StripeCustomerPortalSession {
  id: string;
  url: string;
}

/** Matches portal_params in stripe_controller.rb */
export interface CreateStripeCustomerPortalRequest {
  customerId?: string;
  returnUrl: string;
}

export interface StripeWebhook {
  id: string;
  url: string;
  enabledEvents: string[];
  status: string;
  createdAt: Date;
}

/** Matches webhook_params in stripe_controller.rb */
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
