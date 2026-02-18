export interface SalesUser {
  id: string;
  uniqueId: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  roleName?: string;
  roleUniqueId?: string;
  stripeId?: string;
  timeZone?: string;
  preferredLanguage?: string;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  whatsappNotifications?: boolean;
  otherNotifications?: boolean;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Matches user_params in users_controller.rb */
export interface RegisterSalesUserRequest {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  roleName?: string;
  roleUniqueId?: string;
  stripeId?: string;
  timeZone?: string;
  preferredLanguage?: string;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  whatsappNotifications?: boolean;
  otherNotifications?: boolean;
}

export type UpdateSalesUserRequest = RegisterSalesUserRequest;

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
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionConsumption {
  id: string;
  quantity: number;
  description?: string;
  consumedAt: Date;
}

/** Matches user_subscription_params in users_subscriptions_controller.rb */
export interface CreateUserSubscriptionRequest {
  subscriptionModelUniqueId: string;
  subscriptionNumber?: string;
  notes?: string;
}

export type UpdateUserSubscriptionRequest = CreateUserSubscriptionRequest;

/** Matches user_consumption_params in users_subscriptions_controller.rb */
export interface AddSubscriptionConsumptionRequest {
  consumption: number;
}

export interface ListUserSubscriptionsParams {
  page?: number;
  perPage?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
