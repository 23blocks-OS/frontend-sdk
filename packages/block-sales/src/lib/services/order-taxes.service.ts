import type { Transport } from '@23blocks/contracts';
import { decodeOne, decodeMany } from '@23blocks/jsonapi-codec';
import type { OrderTax, CreateOrderTaxRequest, UpdateOrderTaxRequest } from '../types/order-tax.js';
import { orderTaxMapper } from '../mappers/order-tax.mapper.js';

function buildTaxBody(data: CreateOrderTaxRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.taxUniqueId) body['tax_unique_id'] = data.taxUniqueId;
  if (data.name) body['name'] = data.name;
  if (data.description) body['description'] = data.description;
  if (data.level) body['level'] = data.level;
  if (data.taxValue !== undefined) body['tax_value'] = data.taxValue;
  if (data.tax !== undefined) body['tax'] = data.tax;
  if (data.displayOrder !== undefined) body['display_order'] = data.displayOrder;
  if (data.status) body['status'] = data.status;
  return body;
}

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
        order_tax: buildTaxBody(data),
      });
      return decodeOne(response, orderTaxMapper);
    },

    async update(orderUniqueId: string, uniqueId: string, data: UpdateOrderTaxRequest): Promise<OrderTax> {
      const response = await transport.put<unknown>(`/orders/${orderUniqueId}/taxes/${uniqueId}`, {
        order_tax: buildTaxBody(data),
      });
      return decodeOne(response, orderTaxMapper);
    },

    async delete(orderUniqueId: string, uniqueId: string): Promise<void> {
      await transport.delete(`/orders/${orderUniqueId}/taxes/${uniqueId}`);
    },
  };
}
