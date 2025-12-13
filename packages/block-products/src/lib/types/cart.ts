import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Cart extends IdentityCore {
  userUniqueId: string;
  qcode?: string;

  // Financial summary
  subtotal: number;
  subtotalFees?: number;
  discount?: number;
  delivery?: number;
  tax?: number;
  fees?: number;
  feesValue?: number;
  total: number;
  totalItems: number;

  // Configuration
  notes?: string;
  status: EntityStatus;
  enabled: boolean;
  openPrice?: boolean;
  openStock?: boolean;

  // Order linking
  orderUniqueId?: string;
  orderSystem?: string;
  orderDisplayId?: string;
  orderStatus?: string;

  // Extra data
  payload?: Record<string, unknown>;

  // Nested items
  items?: CartDetail[];
}

export interface CartDetail extends IdentityCore {
  cartUniqueId: string;
  productUniqueId: string;
  productVariationUniqueId?: string;
  vendorUniqueId?: string;
  warehouseUniqueId?: string;

  // Product info (denormalized)
  sku: string;
  name: string;
  description?: string;
  imageUrl?: string;

  // Quantity
  quantity: number;

  // Pricing
  unitPrice: number;
  discount?: number;
  tax?: number;
  taxValue?: number;
  fees?: number;
  feesValue?: number;
  subtotal: number;
  total: number;

  // Status
  status: EntityStatus;
  enabled: boolean;
  orderStatus?: string;

  // Extra
  notes?: string;
  payload?: Record<string, unknown>;
}

// Request types
export interface AddToCartRequest {
  productUniqueId: string;
  productVariationUniqueId?: string;
  quantity: number;
  vendorUniqueId?: string;
  warehouseUniqueId?: string;
  notes?: string;
}

export interface UpdateCartItemRequest {
  quantity?: number;
  notes?: string;
}

export interface UpdateCartRequest {
  notes?: string;
  payload?: Record<string, unknown>;
}

export interface CheckoutRequest {
  addressUniqueId?: string;
  deliveryMethod?: string;
  paymentMethod?: string;
  notes?: string;
}

export interface CartResponse {
  cart: Cart;
}

export interface OrderCartResponse {
  cart: Cart;
  orderUniqueId: string;
  orderDisplayId: string;
}
