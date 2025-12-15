export interface SalesCustomer {
  id: string;
  uniqueId: string;
  email?: string;
  name?: string;
  phone?: string;
  stripeCustomerId?: string;
  mercadopagoCustomerId?: string;
  status: string;
  payload?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterSalesCustomerRequest {
  email?: string;
  name?: string;
  phone?: string;
  stripeCustomerId?: string;
  mercadopagoCustomerId?: string;
  payload?: Record<string, unknown>;
}

export interface CustomerSubscription {
  id: string;
  uniqueId: string;
  customerUniqueId: string;
  subscriptionModelUniqueId: string;
  status: string;
  startDate?: Date;
  endDate?: Date;
  trialEndDate?: Date;
  cancelledAt?: Date;
  payload?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCustomerSubscriptionRequest {
  subscriptionModelUniqueId: string;
  startDate?: string;
  trialEndDate?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateCustomerSubscriptionRequest {
  status?: string;
  endDate?: string;
  payload?: Record<string, unknown>;
}
