/** Matches subscription_model_params in subscription_models_controller.rb */
export interface SubscriptionModel {
  id: string;
  uniqueId: string;
  code?: string;
  description?: string;
  promotional?: boolean;
  programCode?: string;
  duration?: number;
  durationUnit?: string;
  durationDescription?: string;
  recurringPaymentFees?: number;
  recurringPaymentAmount?: number;
  contentUrl?: string;
  startAt?: Date;
  endAt?: Date;
  initialPayment?: number;
  subscriptionType?: string;
  maxItems?: number;
  stripeProductId?: string;
  productType?: string;
  trialPeriodDays?: number;
  allowPromotionCodes?: boolean;
  features?: Record<string, unknown>;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubscriptionModelRequest {
  uniqueId?: string;
  code: string;
  description?: string;
  promotional?: boolean;
  programCode?: string;
  duration?: number;
  durationUnit?: string;
  durationDescription?: string;
  recurringPaymentFees?: number;
  recurringPaymentAmount?: number;
  contentUrl?: string;
  startAt?: string;
  endAt?: string;
  initialPayment?: number;
  subscriptionType?: string;
  maxItems?: number;
  stripeProductId?: string;
  productType?: string;
  trialPeriodDays?: number;
  allowPromotionCodes?: boolean;
  features?: Record<string, unknown>;
}

export type UpdateSubscriptionModelRequest = CreateSubscriptionModelRequest;

export interface ListSubscriptionModelsParams {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
