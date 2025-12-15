import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type { Order, CreateOrderRequest, UpdateOrderRequest, ListOrdersParams } from '../types/order';
import { orderMapper } from '../mappers/order.mapper';

export interface OrdersService {
  list(params?: ListOrdersParams): Promise<PageResult<Order>>;
  get(uniqueId: string): Promise<Order>;
  create(data: CreateOrderRequest): Promise<Order>;
  update(uniqueId: string, data: UpdateOrderRequest): Promise<Order>;
  cancel(uniqueId: string): Promise<Order>;
  confirm(uniqueId: string): Promise<Order>;
  ship(uniqueId: string, trackingNumber?: string): Promise<Order>;
  deliver(uniqueId: string): Promise<Order>;
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
      const response = await transport.post<unknown>('/orders', {
        order: {
          user_unique_id: data.userUniqueId,
          items: data.items.map((item) => ({
            product_unique_id: item.productUniqueId,
            product_variation_unique_id: item.productVariationUniqueId,
            quantity: item.quantity,
            unit_price: item.unitPrice,
          })),
          shipping_address_unique_id: data.shippingAddressUniqueId,
          billing_address_unique_id: data.billingAddressUniqueId,
          notes: data.notes,
          payload: data.payload,
        },
      });
      return decodeOne(response, orderMapper);
    },

    async update(uniqueId: string, data: UpdateOrderRequest): Promise<Order> {
      const response = await transport.put<unknown>(`/orders/${uniqueId}`, {
        order: {
          status: data.status,
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
