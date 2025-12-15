export interface SubscriptionModel {
  id: string;
  uniqueId: string;
  code: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  interval: string;
  intervalCount: number;
  trialDays?: number;
  features?: string[];
  limits?: Record<string, number>;
  enabled: boolean;
  status: string;
  payload?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSubscriptionModelRequest {
  code: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  interval: string;
  intervalCount?: number;
  trialDays?: number;
  features?: string[];
  limits?: Record<string, number>;
  payload?: Record<string, unknown>;
}

export interface UpdateSubscriptionModelRequest {
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  interval?: string;
  intervalCount?: number;
  trialDays?: number;
  features?: string[];
  limits?: Record<string, number>;
  enabled?: boolean;
  status?: string;
  payload?: Record<string, unknown>;
}

export interface ListSubscriptionModelsParams {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
