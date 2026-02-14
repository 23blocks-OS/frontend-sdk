export interface StripeCustomer {
  id: string;
  stripeId: string;
  email?: string;
  name?: string;
  defaultPaymentMethod?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

/** Common optional fields shared across all identity types. */
interface CreateStripeCustomerBase {
  name?: string;
  phone?: string;
  token?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Create a Stripe customer as an individual user (B2C).
 *
 * @remarks
 * This is the default identity type when `identityType` is omitted.
 *
 * Required fields: `email`, `userUniqueId`
 */
export interface CreateStripeCustomerUserRequest extends CreateStripeCustomerBase {
  identityType?: 'user';
  /** Email address for the customer. Required for identity type `'user'`. */
  email: string;
  /** Unique ID of the authenticated user. Required for identity type `'user'`. */
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
  /** Email address for the customer. Required for identity type `'customer'`. */
  email: string;
  /** Unique ID of the company. Required for identity type `'customer'`. */
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
  /** Unique ID of the entity. Required for identity type `'entity'`. */
  entityUniqueId: string;
  /** Entity classification (default: `'Item'`). */
  entityType?: string;
  email?: string;
  userUniqueId?: never;
  companyUniqueId?: never;
}

/**
 * Request to create a Stripe customer.
 *
 * The required fields depend on the `identityType`:
 *
 * - **`'user'`** (default) — individual B2C: requires `email`, `userUniqueId`
 * - **`'customer'`** — company B2B: requires `email`, `companyUniqueId`
 * - **`'entity'`** — AI agent / autonomous system: requires `entityUniqueId`
 *
 * @example
 * ```ts
 * // User (B2C) — identityType defaults to 'user'
 * await stripe.createCustomer({ email: 'john@example.com', userUniqueId: 'uuid-...' });
 *
 * // Company (B2B)
 * await stripe.createCustomer({ identityType: 'customer', email: 'billing@acme.com', companyUniqueId: 'uuid-...' });
 *
 * // Entity (AI agent)
 * await stripe.createCustomer({ identityType: 'entity', entityUniqueId: 'uuid-...', name: 'Trading Bot' });
 * ```
 */
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
  metadata?: Record<string, unknown>;
}

export interface CreateStripeCheckoutSessionRequest {
  customerUniqueId?: string;
  stripeCustomerId?: string;
  successUrl: string;
  cancelUrl: string;
  mode?: 'payment' | 'subscription' | 'setup';
  lineItems?: StripeLineItem[];
  subscriptionData?: {
    trialPeriodDays?: number;
    metadata?: Record<string, unknown>;
  };
  metadata?: Record<string, unknown>;
  subscriptionModelCode?: string;
  priceUniqueId?: string;
  price?: string;
  customer?: string;
  quantity?: number;
  trialPeriodDays?: number;
  subscriptionType?: string;
  identityType?: string;
  description?: string;
  allowPromotionCodes?: boolean;
  couponId?: string;
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

/**
 * Request to create a Stripe payment intent.
 *
 * **BREAKING (v4.1.0):** `amount` has been removed — the server derives it
 * from `order.balance`. `orderUniqueId` (or `orderId`) is now **required**.
 *
 * @example
 * ```ts
 * // User payment (amount derived from order balance)
 * await stripe.createPaymentIntent({ orderUniqueId: 'order-uuid', currency: 'usd', customerId: 'cus_xxx' });
 *
 * // Entity purchase (user pays for an entity item)
 * await stripe.createPaymentIntent({
 *   orderUniqueId: 'order-uuid',
 *   currency: 'usd',
 *   customerId: 'cus_payer_stripe_id',
 *   identityType: 'entity',
 *   entityId: 'entity-unique-id',
 *   entityType: 'Book',
 * });
 * ```
 */
export interface CreateStripePaymentIntentRequest {
  /** Order unique ID. Required — payment amount is derived from `order.balance`. */
  orderUniqueId: string;
  currency: string;
  /** Alternative to `orderUniqueId` — numeric order ID. */
  orderId?: string;
  /** Payer's Stripe customer ID. */
  customerId?: string;
  identityType?: 'user' | 'customer' | 'entity';
  entityType?: string;
  /** Entity unique ID. Required when `identityType` is `'entity'`. */
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

export interface CreateStripeSubscriptionRequest {
  customerUniqueId?: string;
  stripeCustomerId?: string;
  priceId?: string;
  priceUniqueId?: string;
  quantity?: number;
  trialPeriodDays?: number;
  customerId?: string;
  setupPriceId?: string;
  subscriptionPriceId?: string;
  cardToken?: string;
  subscriptionType?: string;
  identityType?: string;
  companyUniqueId?: string;
  entityUniqueId?: string;
  entityType?: string;
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
  customerId?: string;
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
