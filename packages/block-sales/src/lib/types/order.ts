import type { IdentityCore } from '@23blocks/contracts';

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order extends IdentityCore {
  code?: string;
  displayUniqueId?: string;
  parentUniqueId?: string;
  customerUniqueId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerNotes?: string;
  status: OrderStatus;
  logisticsStatus?: string;
  subtotal: number;
  discount: number;
  discountValue?: number;
  delivery?: number;
  tax: number;
  taxValue?: number;
  fees?: number;
  feesValue?: number;
  vendorDiscount?: number;
  vendorDiscountValue?: number;
  vendorPrice?: number;
  openPrice?: number;
  openStock?: number;
  total: number;
  balance?: number;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  internalNotes?: string;
  cartUniqueId?: string;
  referredBy?: string;
  promoCode?: string;
  tips?: number;
  tipsValue?: number;
  paidAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
}

/** Matches order_params in orders_controller.rb */
export interface CreateOrderRequest {
  code?: string;
  displayUniqueId?: string;
  parentUniqueId?: string;
  customerUniqueId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerNotes?: string;
  subtotal?: number;
  discount?: number;
  discountValue?: number;
  delivery?: number;
  tax?: number;
  taxValue?: number;
  fees?: number;
  feesValue?: number;
  vendorDiscount?: number;
  vendorDiscountValue?: number;
  vendorPrice?: number;
  openPrice?: number;
  openStock?: number;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  internalNotes?: string;
  cartUniqueId?: string;
  referredBy?: string;
  promoCode?: string;
}

/** Same as CreateOrderRequest — API uses same order_params for PUT */
export type UpdateOrderRequest = CreateOrderRequest;

/** Params for PUT /orders/:unique_id/status */
export interface UpdateOrderStatusRequest {
  status: string;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
}

/** Params for PUT /orders/:unique_id/logistics */
export interface UpdateOrderLogisticsRequest {
  logisticsStatus: string;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
}

/** Params for POST /orders/:unique_id/tips/add */
export interface AddOrderTipsRequest {
  tips?: number;
  tipsValue?: number;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
}

export interface ListOrdersParams {
  page?: number;
  perPage?: number;
  status?: OrderStatus;
  customerUniqueId?: string;
  parentUniqueId?: string;
  source?: string;
  referredBy?: string;
  promoCode?: string;
  startDate?: Date;
  endDate?: Date;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
