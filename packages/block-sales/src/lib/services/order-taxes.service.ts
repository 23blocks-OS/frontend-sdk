import type { Transport } from '@23blocks/contracts';
import { decodeOne, decodeMany } from '@23blocks/jsonapi-codec';
import type { OrderTax, CreateOrderTaxRequest, UpdateOrderTaxRequest } from '../types/order-tax';
import { orderTaxMapper } from '../mappers/order-tax.mapper';

export interface OrderTaxesService {
  list(orderUniqueId: string): Promise<OrderTax[]>;
  get(orderUniqueId: string, uniqueId: string): Promise<OrderTax>;
  create(orderUniqueId: string, data: CreateOrderTaxRequest): Promise<OrderTax>;
  update(orderUniqueId: string, uniqueId: string, data: UpdateOrderTaxRequest): Promise<OrderTax>;
  delete(orderUniqueId: string, uniqueId: string): Promise<void>;
}

export function createOrderTaxesService(transport: Transport, _config: { appId: string }): OrderTaxesService {
  return {
    async list(orderUniqueId: string): Promise<OrderTax[]> {
      const response = await transport.get<unknown>(`/orders/${orderUniqueId}/taxes`);
      return decodeMany(response, orderTaxMapper);
    },

    async get(orderUniqueId: string, uniqueId: string): Promise<OrderTax> {
      const response = await transport.get<unknown>(`/orders/${orderUniqueId}/taxes/${uniqueId}`);
      return decodeOne(response, orderTaxMapper);
    },

    async create(orderUniqueId: string, data: CreateOrderTaxRequest): Promise<OrderTax> {
      const response = await transport.post<unknown>(`/orders/${orderUniqueId}/taxes`, {
        order_tax: {
          name: data.name,
          rate: data.rate,
          amount: data.amount,
          type: data.type,
          payload: data.payload,
        },
      });
      return decodeOne(response, orderTaxMapper);
    },

    async update(orderUniqueId: string, uniqueId: string, data: UpdateOrderTaxRequest): Promise<OrderTax> {
      const response = await transport.put<unknown>(`/orders/${orderUniqueId}/taxes/${uniqueId}`, {
        order_tax: {
          name: data.name,
          rate: data.rate,
          amount: data.amount,
          type: data.type,
          payload: data.payload,
        },
      });
      return decodeOne(response, orderTaxMapper);
    },

    async delete(orderUniqueId: string, uniqueId: string): Promise<void> {
      await transport.delete(`/orders/${orderUniqueId}/taxes/${uniqueId}`);
    },
  };
}
