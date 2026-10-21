/**
 * Status of an App Store subscription as tracked by Sales.
 * `refunded` means the transaction was revoked by Apple.
 */
export type AppleSubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'grace'
  | 'past_due'
  | 'expired'
  | 'refunded';

/** App Store subscription (Apple-managed; manage in iOS Settings, never the Stripe portal). */
export interface AppleSubscription {
  /** Always `apple`; use it to decide between Apple and Stripe management UI */
  source: 'apple';
  status: AppleSubscriptionStatus;
  productId: string;
  /** `Production` or `Sandbox` */
  environment: string;
  autoRenew: boolean;
  offerType: string | null;
  expiresAt: Date | null;
  gracePeriodExpiresAt: Date | null;
  subscriptionUniqueId: string;
  originalTransactionId: string;
  /** iOS Settings URL where the user manages the subscription */
  manageUrl: string | null;
}

/** App account token to pass to StoreKit 2 as the purchase `appAccountToken` */
export interface AppleAccountToken {
  appAccountToken: string;
}

export interface CreateAppleTransactionRequest {
  /** StoreKit 2 signed transaction (JWS) */
  signedTransaction: string;
  signedRenewalInfo?: string;
}

export interface RestoreAppleTransactionsRequest {
  /** Signed transactions (JWS), max 50 */
  signedTransactions: string[];
}

/** Per-transaction failure in a restore response (the call still returns 200 if at least one was linked) */
export interface AppleRestoreError {
  detail: string;
}

export interface AppleRestoreResult {
  data: AppleSubscription[];
  errors: AppleRestoreError[];
}
