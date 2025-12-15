import type { Transport } from '@23blocks/contracts';
import { decodeOne, decodeMany } from '@23blocks/jsonapi-codec';
import type {
  Cart,
  CartDetail,
  AddToCartRequest,
  UpdateCartItemRequest,
  UpdateCartRequest,
  CheckoutRequest,
} from '../types/cart';
import { cartMapper, cartDetailMapper } from '../mappers/cart.mapper';

export interface CartService {
  get(userUniqueId: string): Promise<Cart>;
  getOrCreate(userUniqueId: string): Promise<Cart>;
  update(userUniqueId: string, data: UpdateCartRequest): Promise<Cart>;
  delete(userUniqueId: string): Promise<void>;

  // Items
  addItem(userUniqueId: string, item: AddToCartRequest): Promise<Cart>;
  updateItem(userUniqueId: string, productUniqueId: string, data: UpdateCartItemRequest): Promise<Cart>;
  removeItem(userUniqueId: string, productUniqueId: string): Promise<Cart>;
  getItems(userUniqueId: string): Promise<CartDetail[]>;

  // Checkout
  checkout(userUniqueId: string, data?: CheckoutRequest): Promise<Cart>;
  order(userUniqueId: string): Promise<{ cart: Cart; orderUniqueId: string }>;
  orderItem(userUniqueId: string, productUniqueId: string): Promise<{ cart: Cart; orderUniqueId: string }>;
  cancel(userUniqueId: string): Promise<Cart>;
  cancelItem(userUniqueId: string, productUniqueId: string): Promise<Cart>;
}

export function createCartService(transport: Transport, _config: { appId: string }): CartService {
  return {
    async get(userUniqueId: string): Promise<Cart> {
      const response = await transport.get<unknown>(`/carts/${userUniqueId}`);
      return decodeOne(response, cartMapper);
    },

    async getOrCreate(userUniqueId: string): Promise<Cart> {
      const response = await transport.post<unknown>('/carts', {
        cart: {
          user_unique_id: userUniqueId,
        },
      });
      return decodeOne(response, cartMapper);
    },

    async update(userUniqueId: string, data: UpdateCartRequest): Promise<Cart> {
      const response = await transport.put<unknown>(`/carts/${userUniqueId}`, {
        cart: {
          notes: data.notes,
          payload: data.payload,
        },
      });
      return decodeOne(response, cartMapper);
    },

    async delete(userUniqueId: string): Promise<void> {
      await transport.delete(`/carts/${userUniqueId}`);
    },

    async addItem(userUniqueId: string, item: AddToCartRequest): Promise<Cart> {
      const response = await transport.put<unknown>(`/carts/${userUniqueId}/add`, {
        product: {
          product_unique_id: item.productUniqueId,
          product_variation_unique_id: item.productVariationUniqueId,
          quantity: item.quantity,
          vendor_unique_id: item.vendorUniqueId,
          warehouse_unique_id: item.warehouseUniqueId,
          notes: item.notes,
        },
      });
      return decodeOne(response, cartMapper);
    },

    async updateItem(userUniqueId: string, productUniqueId: string, data: UpdateCartItemRequest): Promise<Cart> {
      const response = await transport.put<unknown>(`/carts/${userUniqueId}/products/${productUniqueId}`, {
        product: {
          quantity: data.quantity,
          notes: data.notes,
        },
      });
      return decodeOne(response, cartMapper);
    },

    async removeItem(userUniqueId: string, productUniqueId: string): Promise<Cart> {
      const response = await transport.delete<unknown>(`/carts/${userUniqueId}/products/${productUniqueId}`);
      return decodeOne(response, cartMapper);
    },

    async getItems(userUniqueId: string): Promise<CartDetail[]> {
      const response = await transport.get<unknown>(`/carts/${userUniqueId}/items`);
      return decodeMany(response, cartDetailMapper);
    },

    async checkout(userUniqueId: string, data?: CheckoutRequest): Promise<Cart> {
      const response = await transport.post<unknown>(`/carts/${userUniqueId}/checkout`, {
        cart: {
          address_unique_id: data?.addressUniqueId,
          delivery_method: data?.deliveryMethod,
          payment_method: data?.paymentMethod,
          notes: data?.notes,
        },
      });
      return decodeOne(response, cartMapper);
    },

    async order(userUniqueId: string): Promise<{ cart: Cart; orderUniqueId: string }> {
      const response = await transport.put<unknown>(`/carts/${userUniqueId}/order`, {});
      const cart = decodeOne(response, cartMapper);
      return { cart, orderUniqueId: cart.orderUniqueId || '' };
    },

    async orderItem(userUniqueId: string, productUniqueId: string): Promise<{ cart: Cart; orderUniqueId: string }> {
      const response = await transport.put<unknown>(`/carts/${userUniqueId}/products/${productUniqueId}/order`, {});
      const cart = decodeOne(response, cartMapper);
      return { cart, orderUniqueId: cart.orderUniqueId || '' };
    },

    async cancel(userUniqueId: string): Promise<Cart> {
      const response = await transport.put<unknown>(`/carts/${userUniqueId}/cancel`, {});
      return decodeOne(response, cartMapper);
    },

    async cancelItem(userUniqueId: string, productUniqueId: string): Promise<Cart> {
      const response = await transport.put<unknown>(`/carts/${userUniqueId}/products/${productUniqueId}/cancel`, {});
      return decodeOne(response, cartMapper);
    },
  };
}
