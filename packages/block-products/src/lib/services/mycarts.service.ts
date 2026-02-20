import type { Transport } from '@23blocks/contracts';
import { decodeOne } from '@23blocks/jsonapi-codec';
import type { Cart } from '../types/cart.js';
import { cartMapper } from '../mappers/cart.mapper.js';

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
  /**
   * Get the authenticated user's cart by unique identifier.
   * @param uniqueId - The cart unique ID
   * @returns The matching Cart
   */
  get(uniqueId: string): Promise<Cart>;

  /**
   * Create a new cart for the authenticated user.
   * @returns The newly created Cart
   */
  create(): Promise<Cart>;

  /**
   * Update cart metadata such as notes and payload.
   * @param uniqueId - The cart unique ID
   * @param data - Fields to update (notes, payload)
   * @returns The updated Cart
   */
  update(uniqueId: string, data: UpdateMyCartRequest): Promise<Cart>;

  /**
   * Add a product to the authenticated user's cart.
   * @param data - Item details including product ID, optional variation, quantity, price, and notes
   * @returns The updated Cart after adding the item
   * @note Uses PUT to upsert the item into the cart
   */
  addToCart(data: AddToMyCartRequest): Promise<Cart>;

  /**
   * Initiate checkout for the cart.
   * @param uniqueId - The cart unique ID
   * @returns The Cart in checkout state
   */
  checkout(uniqueId: string): Promise<Cart>;

  /**
   * Place an order for all items in the cart.
   * @param uniqueId - The cart unique ID
   * @returns The Cart after ordering all items
   */
  orderAll(uniqueId: string): Promise<Cart>;

  /**
   * Cancel all items in the cart.
   * @param uniqueId - The cart unique ID
   * @returns The Cart after cancelling all items
   */
  cancelAll(uniqueId: string): Promise<Cart>;

  /**
   * Delete a cart.
   * @param uniqueId - The cart unique ID
   * @returns Resolves when the cart has been deleted
   */
  delete(uniqueId: string): Promise<void>;
}

export function createMyCartsService(transport: Transport, _config: { apiKey: string }): MyCartsService {
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
