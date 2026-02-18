export interface SalesEntity {
  id: string;
  uniqueId: string;
  entityType?: string;
  entityAlias?: string;
  entitySource?: string;
  entityUrl?: string;
  stripeId?: string;
  status?: string;
  timeZone?: string;
  preferredLanguage?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Matches entity_params in entities_controller.rb */
export interface RegisterSalesEntityRequest {
  entityType?: string;
  entityAlias?: string;
  entitySource?: string;
  entityUrl?: string;
  stripeId?: string;
  status?: string;
  timeZone?: string;
  preferredLanguage?: string;
  avatarUrl?: string;
}

export type UpdateSalesEntityRequest = RegisterSalesEntityRequest;

export interface ListSalesEntitiesParams {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface EntitySubscription {
  id: string;
  uniqueId: string;
  entityUniqueId: string;
  subscriptionModelUniqueId: string;
  ownerUniqueId?: string;
  ownerType?: string;
  status: string;
  startDate?: Date;
  endDate?: Date;
  trialEndDate?: Date;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/** Matches subscription_params in entity_subscriptions_controller.rb */
export interface CreateEntitySubscriptionRequest {
  subscriptionModelUniqueId: string;
  ownerUniqueId?: string;
  ownerType?: string;
}

export type UpdateEntitySubscriptionRequest = CreateEntitySubscriptionRequest;
