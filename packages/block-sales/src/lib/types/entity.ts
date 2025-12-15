export interface SalesEntity {
  id: string;
  uniqueId: string;
  code?: string;
  name?: string;
  email?: string;
  phone?: string;
  status: string;
  payload?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterSalesEntityRequest {
  code?: string;
  name?: string;
  email?: string;
  phone?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateSalesEntityRequest {
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
  payload?: Record<string, unknown>;
}

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
  status: string;
  startDate?: Date;
  endDate?: Date;
  trialEndDate?: Date;
  cancelledAt?: Date;
  payload?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEntitySubscriptionRequest {
  subscriptionModelUniqueId: string;
  startDate?: string;
  trialEndDate?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateEntitySubscriptionRequest {
  status?: string;
  endDate?: string;
  payload?: Record<string, unknown>;
}
