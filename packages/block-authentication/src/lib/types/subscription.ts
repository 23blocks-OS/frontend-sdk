import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

/**
 * Subscription model (plan definition)
 */
export interface SubscriptionModel extends IdentityCore {
  code: string;
  status: EntityStatus;
  description: string | null;
  promotional: boolean;
  programCode: string | null;
  duration: number | null;
  durationUnit: string | null;
  durationDescription: string | null;
  recurringPaymentFees: number | null;
  recurringPaymentAmount: number | null;
  contentLink: string | null;
  startAt: Date | null;
  endAt: Date | null;
  isChannel: boolean;
  maxTenants: number | null;
  initialPayment: number | null;
  subscriptionType: string | null;
  payments: number | null;
  payload: Record<string, unknown> | null;
  maxItems: number | null;
}

/**
 * User subscription
 */
export interface UserSubscription extends IdentityCore {
  code: string;
  userUniqueId: string;
  programCode: string | null;
  recurringPaymentFees: number | null;
  recurringPaymentAmount: number | null;
  subscriptionNumber: string | null;
  subscribedAt: Date | null;
  closedAt: Date | null;
  lastPaymentAt: Date | null;
  nextPaymentAt: Date | null;
  lastPayment: number | null;
  paymentsMade: number;
  status: EntityStatus;
  bankruptcy: boolean;
  initialPayment: number | null;
  subscriptionType: string | null;
  payments: number | null;
  payload: Record<string, unknown> | null;
  maxItems: number | null;
  consumption: number;

  // Relationship
  subscriptionModel?: SubscriptionModel | null;
}

/**
 * Company subscription
 */
export interface CompanySubscription extends IdentityCore {
  code: string;
  companyUniqueId: string;
  programCode: string | null;
  recurringPaymentFees: number | null;
  recurringPaymentAmount: number | null;
  subscriptionNumber: string | null;
  subscribedAt: Date | null;
  closedAt: Date | null;
  lastPaymentAt: Date | null;
  nextPaymentAt: Date | null;
  lastPayment: number | null;
  paymentsMade: number;
  status: EntityStatus;
  bankruptcy: boolean;
  initialPayment: number | null;
  subscriptionType: string | null;
  payload: Record<string, unknown> | null;
  maxItems: number | null;
  consumption: number;

  // Relationship
  subscriptionModel?: SubscriptionModel | null;
}
