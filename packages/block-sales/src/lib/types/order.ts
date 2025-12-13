import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order extends IdentityCore {
  displayId: string;
  userUniqueId: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddressUniqueId?: string;
  billingAddressUniqueId?: string;
  notes?: string;
  paidAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  payload?: Record<string, unknown>;
}

export interface CreateOrderRequest {
  userUniqueId: string;
  items: Array<{
    productUniqueId: string;
    productVariationUniqueId?: string;
    quantity: number;
    unitPrice: number;
  }>;
  shippingAddressUniqueId?: string;
  billingAddressUniqueId?: string;
  notes?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateOrderRequest {
  status?: OrderStatus;
  shippingAddressUniqueId?: string;
  billingAddressUniqueId?: string;
  notes?: string;
  payload?: Record<string, unknown>;
}

export interface ListOrdersParams {
  page?: number;
  perPage?: number;
  status?: OrderStatus;
  userUniqueId?: string;
  startDate?: Date;
  endDate?: Date;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
