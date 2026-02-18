import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type { Order, CreateOrderRequest, UpdateOrderRequest, ListOrdersParams } from '../types/order.js';
import { orderMapper } from '../mappers/order.mapper.js';

export interface OrdersService {
  /**
   * List orders with optional filtering and sorting.
   * @returns Paginated list of Order records with metadata.
   */
  list(params?: ListOrdersParams): Promise<PageResult<Order>>;

  /**
   * Get a single order by unique ID.
   * @returns The matching Order record.
   */
  get(uniqueId: string): Promise<Order>;

  /**
   * Create a new order. Line items are added separately via orderDetails.create().
   * @returns The newly created Order record.
   */
  create(data: CreateOrderRequest): Promise<Order>;

  /**
   * Update an existing order.
   * @returns The updated Order record.
   */
  update(uniqueId: string, data: UpdateOrderRequest): Promise<Order>;

  /**
   * Cancel an order.
   * @returns The Order record with cancelled status.
   */
  cancel(uniqueId: string): Promise<Order>;

  /**
   * Confirm an order.
   * @returns The Order record with confirmed status.
   */
  confirm(uniqueId: string): Promise<Order>;

  /**
   * Mark an order as shipped with an optional tracking number.
   * @returns The Order record with shipped status.
   */
  ship(uniqueId: string, trackingNumber?: string): Promise<Order>;

  /**
   * Mark an order as delivered.
   * @returns The Order record with delivered status.
   */
  deliver(uniqueId: string): Promise<Order>;

  /**
   * List orders for a specific user.
   * @returns Paginated list of Order records for the user.
   */
  listByUser(userUniqueId: string, params?: ListOrdersParams): Promise<PageResult<Order>>;
}

export function createOrdersService(transport: Transport, _config: { appId: string }): OrdersService {
  return {
    async list(params?: ListOrdersParams): Promise<PageResult<Order>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.userUniqueId) queryParams['user_unique_id'] = params.userUniqueId;
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
      const order: Record<string, unknown> = {};

      if (data.customerUniqueId) order['customer_unique_id'] = data.customerUniqueId;
      if (data.userUniqueId) order['user_unique_id'] = data.userUniqueId;
      if (data.subtotal !== undefined) order['subtotal'] = data.subtotal;
      if (data.source) order['source'] = data.source;
      if (data.sourceAlias) order['source_alias'] = data.sourceAlias;
      if (data.sourceId) order['source_id'] = data.sourceId;
      if (data.sourceType) order['source_type'] = data.sourceType;
      if (data.code) order['code'] = data.code;
      if (data.discount !== undefined) order['discount'] = data.discount;
      if (data.discountValue !== undefined) order['discount_value'] = data.discountValue;
      if (data.tax !== undefined) order['tax'] = data.tax;
      if (data.taxValue !== undefined) order['tax_value'] = data.taxValue;
      if (data.fees !== undefined) order['fees'] = data.fees;
      if (data.feesValue !== undefined) order['fees_value'] = data.feesValue;
      if (data.promoCode) order['promo_code'] = data.promoCode;
      if (data.internalNotes) order['internal_notes'] = data.internalNotes;
      if (data.cartUniqueId) order['cart_unique_id'] = data.cartUniqueId;
      if (data.referredBy) order['referred_by'] = data.referredBy;
      if (data.shippingAddressUniqueId) order['shipping_address_unique_id'] = data.shippingAddressUniqueId;
      if (data.billingAddressUniqueId) order['billing_address_unique_id'] = data.billingAddressUniqueId;
      if (data.notes) order['notes'] = data.notes;
      if (data.payload) order['payload'] = data.payload;

      const response = await transport.post<unknown>('/orders', { order });
      return decodeOne(response, orderMapper);
    },

    async update(uniqueId: string, data: UpdateOrderRequest): Promise<Order> {
      const response = await transport.put<unknown>(`/orders/${uniqueId}`, {
        order: {
          shipping_address_unique_id: data.shippingAddressUniqueId,
          billing_address_unique_id: data.billingAddressUniqueId,
          notes: data.notes,
          payload: data.payload,
        },
      });
      return decodeOne(response, orderMapper);
    },

    async cancel(uniqueId: string): Promise<Order> {
      const response = await transport.put<unknown>(`/orders/${uniqueId}/cancel`, {});
      return decodeOne(response, orderMapper);
    },

    async confirm(uniqueId: string): Promise<Order> {
      const response = await transport.put<unknown>(`/orders/${uniqueId}/confirm`, {});
      return decodeOne(response, orderMapper);
    },

    async ship(uniqueId: string, trackingNumber?: string): Promise<Order> {
      const response = await transport.put<unknown>(`/orders/${uniqueId}/ship`, {
        order: {
          tracking_number: trackingNumber,
        },
      });
      return decodeOne(response, orderMapper);
    },

    async deliver(uniqueId: string): Promise<Order> {
      const response = await transport.put<unknown>(`/orders/${uniqueId}/deliver`, {});
      return decodeOne(response, orderMapper);
    },

    async listByUser(userUniqueId: string, params?: ListOrdersParams): Promise<PageResult<Order>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.startDate) queryParams['start_date'] = params.startDate.toISOString();
      if (params?.endDate) queryParams['end_date'] = params.endDate.toISOString();
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/users/${userUniqueId}/orders`, { params: queryParams });
      return decodePageResult(response, orderMapper);
    },
  };
}
