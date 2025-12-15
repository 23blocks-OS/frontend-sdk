export interface FlexibleOrder {
  id: string;
  uniqueId: string;
  customerUniqueId?: string;
  userUniqueId?: string;
  entityUniqueId?: string;
  orderNumber?: string;
  subtotal: number;
  tax: number;
  tips: number;
  total: number;
  currency: string;
  status: string;
  details: FlexibleOrderDetail[];
  payments?: FlexibleOrderPayment[];
  logistics?: OrderLogistics;
  payload?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface FlexibleOrderDetail {
  id: string;
  uniqueId: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  logistics?: OrderLogistics;
  payload?: Record<string, unknown>;
}

export interface FlexibleOrderPayment {
  id: string;
  uniqueId: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  confirmedAt?: Date;
  payload?: Record<string, unknown>;
}

export interface OrderLogistics {
  carrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
  estimatedDelivery?: Date;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  payload?: Record<string, unknown>;
}

export interface CreateFlexibleOrderRequest {
  customerUniqueId?: string;
  userUniqueId?: string;
  entityUniqueId?: string;
  currency?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateFlexibleOrderRequest {
  status?: string;
  payload?: Record<string, unknown>;
}

export interface AddFlexibleOrderDetailRequest {
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  tax?: number;
  payload?: Record<string, unknown>;
}

export interface AddFlexibleOrderTipsRequest {
  amount: number;
  payload?: Record<string, unknown>;
}

export interface AddFlexibleOrderPaymentMethodRequest {
  method: string;
  payload?: Record<string, unknown>;
}

export interface AddFlexibleOrderPaymentRequest {
  amount: number;
  method: string;
  payload?: Record<string, unknown>;
}

export interface UpdateFlexibleOrderLogisticsRequest {
  carrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  shippedAt?: string;
  deliveredAt?: string;
  estimatedDelivery?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  payload?: Record<string, unknown>;
}

export interface ListFlexibleOrdersParams {
  page?: number;
  perPage?: number;
  customerUniqueId?: string;
  userUniqueId?: string;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
