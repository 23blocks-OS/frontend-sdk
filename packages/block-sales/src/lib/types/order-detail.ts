import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface OrderDetail extends IdentityCore {
  orderUniqueId: string;
  productUniqueId: string;
  productVariationUniqueId?: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
  status: EntityStatus;
  vendorUniqueId?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateOrderDetailRequest {
  quantity?: number;
  unitPrice?: number;
  discount?: number;
  tax?: number;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}
