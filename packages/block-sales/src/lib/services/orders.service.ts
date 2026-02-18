import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Order,
  CreateOrderRequest,
  UpdateOrderRequest,
  UpdateOrderStatusRequest,
  UpdateOrderLogisticsRequest,
  AddOrderTipsRequest,
  ListOrdersParams,
} from '../types/order.js';
import { orderMapper } from '../mappers/order.mapper.js';

export interface OrdersService {
  list(params?: ListOrdersParams): Promise<PageResult<Order>>;
  get(uniqueId: string): Promise<Order>;
  create(data: CreateOrderRequest): Promise<Order>;
  update(uniqueId: string, data: UpdateOrderRequest): Promise<Order>;
  updateStatus(uniqueId: string, data: UpdateOrderStatusRequest): Promise<Order>;
  updateLogistics(uniqueId: string, data: UpdateOrderLogisticsRequest): Promise<Order>;
  addTips(uniqueId: string, data: AddOrderTipsRequest): Promise<Order>;
  listByCustomer(customerUniqueId: string, params?: ListOrdersParams): Promise<PageResult<Order>>;
}

function buildOrderBody(data: CreateOrderRequest): Record<string, unknown> {
  const order: Record<string, unknown> = {};
  if (data.code) order['code'] = data.code;
  if (data.displayUniqueId) order['display_unique_id'] = data.displayUniqueId;
  if (data.parentUniqueId) order['parent_unique_id'] = data.parentUniqueId;
  if (data.customerUniqueId) order['customer_unique_id'] = data.customerUniqueId;
  if (data.customerName) order['customer_name'] = data.customerName;
  if (data.customerEmail) order['customer_email'] = data.customerEmail;
  if (data.customerPhone) order['customer_phone'] = data.customerPhone;
  if (data.customerNotes) order['customer_notes'] = data.customerNotes;
  if (data.subtotal !== undefined) order['subtotal'] = data.subtotal;
  if (data.discount !== undefined) order['discount'] = data.discount;
  if (data.discountValue !== undefined) order['discount_value'] = data.discountValue;
  if (data.delivery !== undefined) order['delivery'] = data.delivery;
  if (data.tax !== undefined) order['tax'] = data.tax;
  if (data.taxValue !== undefined) order['tax_value'] = data.taxValue;
  if (data.fees !== undefined) order['fees'] = data.fees;
  if (data.feesValue !== undefined) order['fees_value'] = data.feesValue;
  if (data.vendorDiscount !== undefined) order['vendor_discount'] = data.vendorDiscount;
  if (data.vendorDiscountValue !== undefined) order['vendor_discount_value'] = data.vendorDiscountValue;
  if (data.vendorPrice !== undefined) order['vendor_price'] = data.vendorPrice;
  if (data.openPrice !== undefined) order['open_price'] = data.openPrice;
  if (data.openStock !== undefined) order['open_stock'] = data.openStock;
  if (data.source) order['source'] = data.source;
  if (data.sourceAlias) order['source_alias'] = data.sourceAlias;
  if (data.sourceId) order['source_id'] = data.sourceId;
  if (data.sourceType) order['source_type'] = data.sourceType;
  if (data.internalNotes) order['internal_notes'] = data.internalNotes;
  if (data.cartUniqueId) order['cart_unique_id'] = data.cartUniqueId;
  if (data.referredBy) order['referred_by'] = data.referredBy;
  if (data.promoCode) order['promo_code'] = data.promoCode;
  return order;
}

export function createOrdersService(transport: Transport, _config: { appId: string }): OrdersService {
  return {
    async list(params?: ListOrdersParams): Promise<PageResult<Order>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.customerUniqueId) queryParams['customer_unique_id'] = params.customerUniqueId;
      if (params?.parentUniqueId) queryParams['parent_unique_id'] = params.parentUniqueId;
      if (params?.source) queryParams['source'] = params.source;
      if (params?.referredBy) queryParams['referred_by'] = params.referredBy;
      if (params?.promoCode) queryParams['promo_code'] = params.promoCode;
      if (params?.startDate) queryParams['start_date'] = params.startDate.toISOString();
      if (params?.endDate) queryParams['end_date'] = params.endDate.toISOString();
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/orders', { params: queryParams });
      return decodePageResult(response, orderMapper);
    },

    async get(uniqueId: string): Promise<Order> {
      const response = await transport.get<unknown>(`/orders/${uniqueId}`);
      return decodeOne(response, orderMapper);
    },

    async create(data: CreateOrderRequest): Promise<Order> {
      const response = await transport.post<unknown>('/orders', { order: buildOrderBody(data) });
      return decodeOne(response, orderMapper);
    },

    async update(uniqueId: string, data: UpdateOrderRequest): Promise<Order> {
      const response = await transport.put<unknown>(`/orders/${uniqueId}`, { order: buildOrderBody(data) });
      return decodeOne(response, orderMapper);
    },

    async updateStatus(uniqueId: string, data: UpdateOrderStatusRequest): Promise<Order> {
      const body: Record<string, unknown> = { status: data.status };
      if (data.source) body['source'] = data.source;
      if (data.sourceAlias) body['source_alias'] = data.sourceAlias;
      if (data.sourceId) body['source_id'] = data.sourceId;
      if (data.sourceType) body['source_type'] = data.sourceType;
      const response = await transport.put<unknown>(`/orders/${uniqueId}/status`, { order: body });
      return decodeOne(response, orderMapper);
    },

    async updateLogistics(uniqueId: string, data: UpdateOrderLogisticsRequest): Promise<Order> {
      const body: Record<string, unknown> = { logistics_status: data.logisticsStatus };
      if (data.source) body['source'] = data.source;
      if (data.sourceAlias) body['source_alias'] = data.sourceAlias;
      if (data.sourceId) body['source_id'] = data.sourceId;
      if (data.sourceType) body['source_type'] = data.sourceType;
      const response = await transport.put<unknown>(`/orders/${uniqueId}/logistics`, { order: body });
      return decodeOne(response, orderMapper);
    },

    async addTips(uniqueId: string, data: AddOrderTipsRequest): Promise<Order> {
      const body: Record<string, unknown> = {};
      if (data.tips !== undefined) body['tips'] = data.tips;
      if (data.tipsValue !== undefined) body['tips_value'] = data.tipsValue;
      if (data.source) body['source'] = data.source;
      if (data.sourceAlias) body['source_alias'] = data.sourceAlias;
      if (data.sourceId) body['source_id'] = data.sourceId;
      if (data.sourceType) body['source_type'] = data.sourceType;
      const response = await transport.post<unknown>(`/orders/${uniqueId}/tips/add`, { order: body });
      return decodeOne(response, orderMapper);
    },

    async listByCustomer(customerUniqueId: string, params?: ListOrdersParams): Promise<PageResult<Order>> {
      const queryParams: Record<string, string> = { customer_unique_id: customerUniqueId };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.startDate) queryParams['start_date'] = params.startDate.toISOString();
      if (params?.endDate) queryParams['end_date'] = params.endDate.toISOString();
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/orders', { params: queryParams });
      return decodePageResult(response, orderMapper);
    },
  };
}
