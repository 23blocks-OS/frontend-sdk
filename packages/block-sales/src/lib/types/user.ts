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

export interface CreateUserSubscriptionRequest {
  startDate?: string;
  trialEndDate?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateUserSubscriptionRequest {
  status?: string;
  endDate?: string;
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
