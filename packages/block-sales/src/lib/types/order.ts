import type { IdentityCore } from '@23blocks/contracts';

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order extends IdentityCore {
  displayId: string;
  userUniqueId: string;
  customerUniqueId?: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  code?: string;
  discountValue?: number;
  taxValue?: number;
  fees?: number;
  feesValue?: number;
  promoCode?: string;
  internalNotes?: string;
  cartUniqueId?: string;
  referredBy?: string;
  shippingAddressUniqueId?: string;
  billingAddressUniqueId?: string;
  notes?: string;
  paidAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  payload?: Record<string, unknown>;
}

export interface CreateOrderRequest {
  /** Customer unique ID (flat order format) */
  customerUniqueId?: string;
  /** User unique ID (alternative to customerUniqueId) */
  userUniqueId?: string;
  /** Order subtotal amount */
  subtotal?: number;
  /** Source identifier (e.g., 'ppm', 'web', 'mobile') */
  source?: string;
  /** Source alias */
  sourceAlias?: string;
  /** Source ID */
  sourceId?: string;
  /** Source type */
  sourceType?: string;
  /** Order code */
  code?: string;
  /** Discount percentage or fixed */
  discount?: number;
  /** Discount value */
  discountValue?: number;
  /** Tax percentage or fixed */
  tax?: number;
  /** Tax value */
  taxValue?: number;
  /** Fees percentage or fixed */
  fees?: number;
  /** Fees value */
  feesValue?: number;
  /** Promo code */
  promoCode?: string;
  /** Internal notes (not visible to customer) */
  internalNotes?: string;
  /** Cart unique ID */
  cartUniqueId?: string;
  /** Referred by */
  referredBy?: string;
  /** Line items (optional - order details can be added separately via orderDetails.create) */
  items?: Array<{
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
