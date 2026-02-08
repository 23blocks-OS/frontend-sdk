import type { Transport } from '@23blocks/contracts';
import { decodeOne, decodeMany } from '@23blocks/jsonapi-codec';
import type { OrderDetail, UpdateOrderDetailRequest } from '../types/order-detail.js';
import { orderDetailMapper } from '../mappers/order-detail.mapper.js';

export interface OrderDetailsService {
  /**
   * List all order details.
   * @returns Array of OrderDetail records.
   */
  list(): Promise<OrderDetail[]>;

  /**
   * Get a single order detail by unique ID.
   * @returns The matching OrderDetail record.
   */
  get(uniqueId: string): Promise<OrderDetail>;

  /**
   * Update an existing order detail.
   * @returns The updated OrderDetail record.
   */
  update(uniqueId: string, data: UpdateOrderDetailRequest): Promise<OrderDetail>;

  /**
   * List order details belonging to a specific order.
   * @returns Array of OrderDetail records for the order.
   */
  listByOrder(orderUniqueId: string): Promise<OrderDetail[]>;
}

export function createOrderDetailsService(transport: Transport, _config: { appId: string }): OrderDetailsService {
  return {
    async list(): Promise<OrderDetail[]> {
      const response = await transport.get<unknown>('/order_details');
      return decodeMany(response, orderDetailMapper);
    },

    async get(uniqueId: string): Promise<OrderDetail> {
      const response = await transport.get<unknown>(`/order_details/${uniqueId}`);
      return decodeOne(response, orderDetailMapper);
    },

    async update(uniqueId: string, data: UpdateOrderDetailRequest): Promise<OrderDetail> {
      const response = await transport.put<unknown>(`/order_details/${uniqueId}`, {
        details: {
          quantity: data.quantity,
          unit_price: data.unitPrice,
          discount: data.discount,
          tax: data.tax,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, orderDetailMapper);
    },

    async listByOrder(orderUniqueId: string): Promise<OrderDetail[]> {
      const response = await transport.get<unknown>(`/orders/${orderUniqueId}/details`);
      return decodeMany(response, orderDetailMapper);
    },
  };
}
