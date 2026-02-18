export interface Subscription {
  id: string;
  uniqueId: string;
  stripeCustomerId?: string;
  accountUniqueId?: string;
  accountCode?: string;
  accountName?: string;
  currency?: string;
  billingInterval?: string;
  trialPeriodDays?: number;
  status?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionItem {
  id: string;
  uniqueId: string;
  subscriptionUniqueId?: string;
  stripePriceId?: string;
  stripeProductId?: string;
  blockCode?: string;
  blockName?: string;
  appUniqueId?: string;
  appName?: string;
  appBlockUniqueId?: string;
  amountCents?: number;
  quantity?: number;
  status?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/** Matches subscription_params in subscriptions_controller.rb */
export interface CreateSubscriptionRequest {
  stripeCustomerId?: string;
  accountUniqueId?: string;
  accountCode?: string;
  accountName?: string;
  currency?: string;
  billingInterval?: string;
  trialPeriodDays?: number;
  metadata?: Record<string, unknown>;
  items?: CreateSubscriptionItemRequest[];
}

/** Matches item_params / create_item_params in subscriptions/subscription_items controllers */
export interface CreateSubscriptionItemRequest {
  stripePriceId?: string;
  stripeProductId?: string;
  blockCode?: string;
  blockName?: string;
  appUniqueId?: string;
  appName?: string;
  appBlockUniqueId?: string;
  amountCents?: number;
  quantity?: number;
  metadata?: Record<string, unknown>;
}

export interface ListSubscriptionsParams {
  page?: number;
  perPage?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
