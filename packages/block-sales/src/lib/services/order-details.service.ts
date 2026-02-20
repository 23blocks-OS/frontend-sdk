import type { Transport } from '@23blocks/contracts';
import { decodeOne, decodeMany } from '@23blocks/jsonapi-codec';
import type {
  OrderDetail,
  CreateOrderDetailRequest,
  UpdateOrderDetailRequest,
  UpdateOrderDetailStatusRequest,
  UpdateOrderDetailLogisticsRequest,
} from '../types/order-detail.js';
import { orderDetailMapper } from '../mappers/order-detail.mapper.js';

function buildDetailBody(data: CreateOrderDetailRequest): Record<string, unknown> {
  const detail: Record<string, unknown> = {};
  if (data.source) detail['source'] = data.source;
  if (data.sourceAlias) detail['source_alias'] = data.sourceAlias;
  if (data.sourceId) detail['source_id'] = data.sourceId;
  if (data.sourceType) detail['source_type'] = data.sourceType;
  if (data.productSku) detail['product_sku'] = data.productSku;
  if (data.productUniqueId) detail['product_unique_id'] = data.productUniqueId;
  if (data.productName) detail['product_name'] = data.productName;
  if (data.productDescription) detail['product_description'] = data.productDescription;
  if (data.categoryName) detail['category_name'] = data.categoryName;
  if (data.isVariation !== undefined) detail['is_variation'] = data.isVariation;
  if (data.variationSku) detail['variation_sku'] = data.variationSku;
  if (data.productSize) detail['product_size'] = data.productSize;
  if (data.color) detail['color'] = data.color;
  if (data.extraVariation) detail['extra_variation'] = data.extraVariation;
  detail['quantity'] = data.quantity;
  if (data.notes) detail['notes'] = data.notes;
  if (data.subtotal !== undefined) detail['subtotal'] = data.subtotal;
  if (data.discount !== undefined) detail['discount'] = data.discount;
  if (data.discountValue !== undefined) detail['discount_value'] = data.discountValue;
  if (data.tax !== undefined) detail['tax'] = data.tax;
  if (data.taxValue !== undefined) detail['tax_value'] = data.taxValue;
  if (data.fees !== undefined) detail['fees'] = data.fees;
  if (data.feesValue !== undefined) detail['fees_value'] = data.feesValue;
  if (data.tips !== undefined) detail['tips'] = data.tips;
  if (data.tipsValue !== undefined) detail['tips_value'] = data.tipsValue;
  if (data.vendorDiscount !== undefined) detail['vendor_discount'] = data.vendorDiscount;
  if (data.vendorDiscountValue !== undefined) detail['vendor_discount_value'] = data.vendorDiscountValue;
  if (data.vendorPrice !== undefined) detail['vendor_price'] = data.vendorPrice;
  if (data.total !== undefined) detail['total'] = data.total;
  if (data.cartDetailUniqueId) detail['cart_detail_unique_id'] = data.cartDetailUniqueId;
  if (data.referredBy) detail['referred_by'] = data.referredBy;
  if (data.promoCode) detail['promo_code'] = data.promoCode;
  if (data.orderCode) detail['order_code'] = data.orderCode;
  return detail;
}

export interface OrderDetailsService {
  list(): Promise<OrderDetail[]>;
  get(uniqueId: string): Promise<OrderDetail>;
  create(orderUniqueId: string, data: CreateOrderDetailRequest): Promise<OrderDetail>;
  update(orderUniqueId: string, detailUniqueId: string, data: UpdateOrderDetailRequest): Promise<OrderDetail>;
  updateStatus(orderUniqueId: string, detailUniqueId: string, data: UpdateOrderDetailStatusRequest): Promise<OrderDetail>;
  updateLogistics(orderUniqueId: string, detailUniqueId: string, data: UpdateOrderDetailLogisticsRequest): Promise<OrderDetail>;
  listByOrder(orderUniqueId: string): Promise<OrderDetail[]>;
}

export function createOrderDetailsService(transport: Transport, _config: { apiKey: string }): OrderDetailsService {
  return {
    async list(): Promise<OrderDetail[]> {
      const response = await transport.get<unknown>('/order_details');
      return decodeMany(response, orderDetailMapper);
    },

    async get(uniqueId: string): Promise<OrderDetail> {
      const response = await transport.get<unknown>(`/order_details/${uniqueId}`);
      return decodeOne(response, orderDetailMapper);
    },

    async create(orderUniqueId: string, data: CreateOrderDetailRequest): Promise<OrderDetail> {
      const response = await transport.post<unknown>(`/orders/${orderUniqueId}/details`, {
        details: buildDetailBody(data),
      });
      return decodeOne(response, orderDetailMapper);
    },

    async update(orderUniqueId: string, detailUniqueId: string, data: UpdateOrderDetailRequest): Promise<OrderDetail> {
      const response = await transport.put<unknown>(`/orders/${orderUniqueId}/details/${detailUniqueId}`, {
        details: buildDetailBody(data),
      });
      return decodeOne(response, orderDetailMapper);
    },

    async updateStatus(orderUniqueId: string, detailUniqueId: string, data: UpdateOrderDetailStatusRequest): Promise<OrderDetail> {
      const body: Record<string, unknown> = { status: data.status };
      if (data.source) body['source'] = data.source;
      if (data.sourceAlias) body['source_alias'] = data.sourceAlias;
      if (data.sourceId) body['source_id'] = data.sourceId;
      if (data.sourceType) body['source_type'] = data.sourceType;
      const response = await transport.put<unknown>(`/orders/${orderUniqueId}/details/${detailUniqueId}/status`, { details: body });
      return decodeOne(response, orderDetailMapper);
    },

    async updateLogistics(orderUniqueId: string, detailUniqueId: string, data: UpdateOrderDetailLogisticsRequest): Promise<OrderDetail> {
      const body: Record<string, unknown> = { logistics_status: data.logisticsStatus };
      if (data.source) body['source'] = data.source;
      if (data.sourceAlias) body['source_alias'] = data.sourceAlias;
      if (data.sourceId) body['source_id'] = data.sourceId;
      if (data.sourceType) body['source_type'] = data.sourceType;
      const response = await transport.put<unknown>(`/orders/${orderUniqueId}/details/${detailUniqueId}/logistics`, { details: body });
      return decodeOne(response, orderDetailMapper);
    },

    async listByOrder(orderUniqueId: string): Promise<OrderDetail[]> {
      const response = await transport.get<unknown>(`/orders/${orderUniqueId}/details`);
      return decodeMany(response, orderDetailMapper);
    },
  };
}
