import type { IdentityCore } from '@23blocks/contracts';

export interface OrderDetail extends IdentityCore {
  orderUniqueId: string;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  productSku?: string;
  productUniqueId?: string;
  productName?: string;
  productDescription?: string;
  categoryName?: string;
  isVariation?: boolean;
  variationSku?: string;
  productSize?: string;
  color?: string;
  extraVariation?: string;
  quantity: number;
  notes?: string;
  subtotal: number;
  discount: number;
  discountValue?: number;
  tax: number;
  taxValue?: number;
  fees?: number;
  feesValue?: number;
  tips?: number;
  tipsValue?: number;
  vendorDiscount?: number;
  vendorDiscountValue?: number;
  vendorPrice?: number;
  total: number;
  cartDetailUniqueId?: string;
  referredBy?: string;
  promoCode?: string;
  orderCode?: string;
  status?: string;
  logisticsStatus?: string;
}

/** Matches order_detail_params in orders_controller.rb */
export interface CreateOrderDetailRequest {
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  productSku?: string;
  productUniqueId?: string;
  productName?: string;
  productDescription?: string;
  categoryName?: string;
  isVariation?: boolean;
  variationSku?: string;
  productSize?: string;
  color?: string;
  extraVariation?: string;
  quantity: number;
  notes?: string;
  subtotal?: number;
  discount?: number;
  discountValue?: number;
  tax?: number;
  taxValue?: number;
  fees?: number;
  feesValue?: number;
  tips?: number;
  tipsValue?: number;
  vendorDiscount?: number;
  vendorDiscountValue?: number;
  vendorPrice?: number;
  total?: number;
  cartDetailUniqueId?: string;
  referredBy?: string;
  promoCode?: string;
  orderCode?: string;
}

/** Same params for update */
export type UpdateOrderDetailRequest = CreateOrderDetailRequest;

/** Params for PUT /orders/:id/details/:id/status */
export interface UpdateOrderDetailStatusRequest {
  status: string;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
}

/** Params for PUT /orders/:id/details/:id/logistics */
export interface UpdateOrderDetailLogisticsRequest {
  logisticsStatus: string;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
}
