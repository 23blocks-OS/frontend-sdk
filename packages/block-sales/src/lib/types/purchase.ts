/**
 * A completed purchase record (Order + Payment + Subscription in a single call).
 */
export interface Purchase {
  orderUniqueId: string;
  orderDisplayId: string;
  subscriptionModelCode: string;
  subscriptionStatus: string;
  identityType: string;
  gateway: string;
  amount: number;
  purchasedAt: Date;
}

/** Common optional fields shared across all purchase identity types. */
interface CreatePurchaseBase {
  /** Plan code, e.g. `'free'`, `'pro-monthly'`. */
  subscriptionModelCode: string;
  /** Payment gateway. Default: `'none'`. */
  gateway?: 'Stripe' | 'MercadoPago' | 'none';
  /** Gateway transaction ID for server-confirmed purchases. */
  gatewayTransactionId?: string;
  /** Promotional code. */
  promoCode?: string;
  /** Specific SubscriptionModelPrice UUID. */
  priceUniqueId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Create a purchase as an individual user (B2C).
 *
 * @remarks
 * This is the default identity type when `identityType` is omitted.
 *
 * Required fields: `subscriptionModelCode`, `userUniqueId`
 */
export interface CreatePurchaseUserRequest extends CreatePurchaseBase {
  identityType?: 'user';
  /** Unique ID of the authenticated user. Required for identity type `'user'`. */
  userUniqueId: string;
  companyUniqueId?: never;
  entityUniqueId?: never;
}

/**
 * Create a purchase as a company (B2B).
 *
 * Required fields: `subscriptionModelCode`, `companyUniqueId`
 */
export interface CreatePurchaseCompanyRequest extends CreatePurchaseBase {
  identityType: 'customer';
  /** Unique ID of the company. Required for identity type `'customer'`. */
  companyUniqueId: string;
  userUniqueId?: never;
  entityUniqueId?: never;
}

/**
 * Create a purchase as an entity (AI agents, autonomous systems).
 *
 * Required fields: `subscriptionModelCode`, `entityUniqueId`
 */
export interface CreatePurchaseEntityRequest extends CreatePurchaseBase {
  identityType: 'entity';
  /** Unique ID of the entity. Required for identity type `'entity'`. */
  entityUniqueId: string;
  userUniqueId?: never;
  companyUniqueId?: never;
}

/**
 * Request to create a purchase.
 *
 * Creates an Order + OrderDetail + Payment + Subscription in a single call.
 * Use this for free plan activations and server-confirmed purchases.
 *
 * The required fields depend on the `identityType`:
 *
 * - **`'user'`** (default) — individual B2C: requires `userUniqueId`
 * - **`'customer'`** — company B2B: requires `companyUniqueId`
 * - **`'entity'`** — AI agent / autonomous system: requires `entityUniqueId`
 *
 * @example
 * ```ts
 * // Free plan signup (user)
 * await sales.purchases.create({ subscriptionModelCode: 'free', userUniqueId: 'uuid-...' });
 *
 * // Paid plan with Stripe (company)
 * await sales.purchases.create({
 *   identityType: 'customer',
 *   subscriptionModelCode: 'pro-monthly',
 *   companyUniqueId: 'uuid-...',
 *   gateway: 'Stripe',
 *   gatewayTransactionId: 'pi_...',
 * });
 *
 * // Entity purchase
 * await sales.purchases.create({ identityType: 'entity', subscriptionModelCode: 'agent-tier', entityUniqueId: 'uuid-...' });
 * ```
 */
export type CreatePurchaseRequest =
  | CreatePurchaseUserRequest
  | CreatePurchaseCompanyRequest
  | CreatePurchaseEntityRequest;
