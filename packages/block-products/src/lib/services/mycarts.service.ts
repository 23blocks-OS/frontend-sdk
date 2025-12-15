import type { Transport } from '@23blocks/contracts';
import { decodeOne } from '@23blocks/jsonapi-codec';
import type { Cart } from '../types/cart';
import { cartMapper } from '../mappers/cart.mapper';

export interface AddToMyCartRequest {
  productUniqueId: string;
  variationUniqueId?: string;
  quantity: number;
  price?: number;
  notes?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateMyCartRequest {
  notes?: string;
  payload?: Record<string, unknown>;
}

export interface MyCartsService {
  get(uniqueId: string): Promise<Cart>;
  create(): Promise<Cart>;
  update(uniqueId: string, data: UpdateMyCartRequest): Promise<Cart>;
  addToCart(data: AddToMyCartRequest): Promise<Cart>;
  checkout(uniqueId: string): Promise<Cart>;
  orderAll(uniqueId: string): Promise<Cart>;
  cancelAll(uniqueId: string): Promise<Cart>;
  delete(uniqueId: string): Promise<void>;
}

export function createMyCartsService(transport: Transport, _config: { appId: string }): MyCartsService {
  return {
    async get(uniqueId: string): Promise<Cart> {
      const response = await transport.get<unknown>(`/mycarts/${uniqueId}`);
      return decodeOne(response, cartMapper);
    },

    async create(): Promise<Cart> {
      const response = await transport.post<unknown>('/mycarts', {});
      return decodeOne(response, cartMapper);
    },

    async update(uniqueId: string, data: UpdateMyCartRequest): Promise<Cart> {
      const response = await transport.put<unknown>(`/mycarts/${uniqueId}`, {
        cart: {
          notes: data.notes,
          payload: data.payload,
        },
      });
      return decodeOne(response, cartMapper);
    },

    async addToCart(data: AddToMyCartRequest): Promise<Cart> {
      const response = await transport.put<unknown>('/mycarts', {
        cart: {
          product_unique_id: data.productUniqueId,
          variation_unique_id: data.variationUniqueId,
          quantity: data.quantity,
          price: data.price,
          notes: data.notes,
          payload: data.payload,
        },
      });
      return decodeOne(response, cartMapper);
    },

    async checkout(uniqueId: string): Promise<Cart> {
      const response = await transport.post<unknown>(`/mycarts/${uniqueId}/checkout`, {});
      return decodeOne(response, cartMapper);
    },

    async orderAll(uniqueId: string): Promise<Cart> {
      const response = await transport.put<unknown>(`/mycarts/${uniqueId}/order`, {});
      return decodeOne(response, cartMapper);
    },

    async cancelAll(uniqueId: string): Promise<Cart> {
      const response = await transport.put<unknown>(`/mycarts/${uniqueId}/cancel`, {});
      return decodeOne(response, cartMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/mycarts/${uniqueId}`);
    },
  };
}
