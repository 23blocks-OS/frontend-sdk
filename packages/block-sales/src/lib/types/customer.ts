export interface SalesCustomer {
  id: string;
  uniqueId: string;
  name?: string;
  email?: string;
  phone?: string;
  companyUniqueId?: string;
  stripeId?: string;
  status?: string;
  timeZone?: string;
  preferredLanguage?: string;
  avatarUrl?: string;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  whatsappNotifications?: boolean;
  otherNotifications?: boolean;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Matches customer_params in customers_controller.rb */
export interface RegisterSalesCustomerRequest {
  name?: string;
  email?: string;
  phone?: string;
  companyUniqueId?: string;
  stripeId?: string;
  status?: string;
  timeZone?: string;
  preferredLanguage?: string;
  avatarUrl?: string;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  whatsappNotifications?: boolean;
  otherNotifications?: boolean;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
}

export interface CustomerSubscription {
  id: string;
  uniqueId: string;
  customerUniqueId: string;
  subscriptionModelUniqueId: string;
  subscriptionNumber?: string;
  notes?: string;
  status: string;
  startDate?: Date;
  endDate?: Date;
  trialEndDate?: Date;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/** Matches customer_subscription_params in customers_controller.rb */
export interface CreateCustomerSubscriptionRequest {
  subscriptionModelUniqueId: string;
  subscriptionNumber?: string;
  notes?: string;
}

export type UpdateCustomerSubscriptionRequest = CreateCustomerSubscriptionRequest;
