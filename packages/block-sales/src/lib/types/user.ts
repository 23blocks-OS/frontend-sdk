export interface SalesUser {
  id: string;
  uniqueId: string;
  email?: string;
  name?: string;
  phone?: string;
  status: string;
  payload?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterSalesUserRequest {
  email?: string;
  name?: string;
  phone?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateSalesUserRequest {
  name?: string;
  phone?: string;
  status?: string;
  payload?: Record<string, unknown>;
}

export interface ListSalesUsersParams {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserSubscription {
  id: string;
  uniqueId: string;
  userUniqueId: string;
  subscriptionModelUniqueId: string;
  status: string;
  startDate?: Date;
  endDate?: Date;
  trialEndDate?: Date;
  cancelledAt?: Date;
  consumptions?: SubscriptionConsumption[];
  maxItems?: number;
  consumption?: number;
  subscriptionNumber?: string;
  code?: string;
  recurringPaymentAmount?: number;
  notes?: string;
  payload?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionConsumption {
  id: string;
  quantity: number;
  description?: string;
  consumedAt: Date;
}

/**
 * Request to create a user subscription.
 *
 * The `subscriptionModelUniqueId` is the only required field — the server
 * resolves all plan details (max_items, pricing, type) from the model.
 *
 * Do **not** send server-managed fields like `status`, `max_items`,
 * `consumption`, or payment/date fields — they will be ignored.
 */
export interface CreateUserSubscriptionRequest {
  /** UUID of the subscription model (plan) to subscribe to. Required. */
  subscriptionModelUniqueId: string;
  /** External reference number. */
  subscriptionNumber?: string;
  /** Free text notes. */
  notes?: string;
  payload?: Record<string, unknown>;
}

/**
 * Request to update a user subscription (e.g., plan change).
 *
 * The `subscriptionModelUniqueId` is the only required field — the server
 * loads all plan details from the new model.
 *
 * Do **not** send server-managed fields like `status`, `max_items`,
 * `consumption`, or payment/date fields — they will be ignored.
 */
export interface UpdateUserSubscriptionRequest {
  /** UUID of the new subscription model (plan). Required. */
  subscriptionModelUniqueId: string;
  /** External reference number. */
  subscriptionNumber?: string;
  /** Free text notes. */
  notes?: string;
  payload?: Record<string, unknown>;
}

export interface AddSubscriptionConsumptionRequest {
  quantity: number;
  description?: string;
  payload?: Record<string, unknown>;
}

export interface ListUserSubscriptionsParams {
  page?: number;
  perPage?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
