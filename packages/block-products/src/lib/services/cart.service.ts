import type { Transport } from '@23blocks/contracts';
import { decodeOne, decodeMany } from '@23blocks/jsonapi-codec';
import type {
  Cart,
  CartDetail,
  AddToCartRequest,
  UpdateCartItemRequest,
  UpdateCartRequest,
  CheckoutRequest,
} from '../types/cart.js';
import { cartMapper, cartDetailMapper } from '../mappers/cart.mapper.js';

export interface CartService {
  /**
   * Get a cart by user unique identifier.
   * @param userUniqueId - The user unique ID who owns the cart
   * @returns The user's Cart
   */
  get(userUniqueId: string): Promise<Cart>;

  /**
   * Get an existing cart or create a new one for the user.
   * @param userUniqueId - The user unique ID
   * @returns The existing or newly created Cart
   */
  getOrCreate(userUniqueId: string): Promise<Cart>;

  /**
   * Update cart metadata such as notes and payload.
   * @param userUniqueId - The user unique ID who owns the cart
   * @param data - Fields to update (notes, payload)
   * @returns The updated Cart
   */
  update(userUniqueId: string, data: UpdateCartRequest): Promise<Cart>;

  /**
   * Delete a user's cart.
   * @param userUniqueId - The user unique ID who owns the cart
   * @returns Resolves when the cart has been deleted
   */
  delete(userUniqueId: string): Promise<void>;

  // Items

  /**
   * Add an item to the user's cart.
   * @param userUniqueId - The user unique ID who owns the cart
   * @param item - Item details including product ID, quantity, and optional variation/vendor/warehouse
   * @returns The updated Cart after adding the item
   */
  addItem(userUniqueId: string, item: AddToCartRequest): Promise<Cart>;

  /**
   * Update a specific item in the cart (e.g., change quantity or notes).
   * @param userUniqueId - The user unique ID who owns the cart
   * @param productUniqueId - The product unique ID identifying the cart item
   * @param data - Fields to update on the cart item
   * @returns The updated Cart after modifying the item
   */
  updateItem(userUniqueId: string, productUniqueId: string, data: UpdateCartItemRequest): Promise<Cart>;

  /**
   * Remove a specific item from the cart.
   * @param userUniqueId - The user unique ID who owns the cart
   * @param productUniqueId - The product unique ID to remove
   * @returns The updated Cart after removing the item
   */
  removeItem(userUniqueId: string, productUniqueId: string): Promise<Cart>;

  /**
   * Get all line items in the user's cart.
   * @param userUniqueId - The user unique ID who owns the cart
   * @returns Array of CartDetail items
   */
  getItems(userUniqueId: string): Promise<CartDetail[]>;

  // Checkout

  /**
   * Initiate checkout for the user's cart.
   * @param userUniqueId - The user unique ID who owns the cart
   * @param data - Optional checkout details including address, delivery method, and payment method
   * @returns The Cart in checkout state
   */
  checkout(userUniqueId: string, data?: CheckoutRequest): Promise<Cart>;

  /**
   * Place an order for all items in the cart.
   * @param userUniqueId - The user unique ID who owns the cart
   * @returns Object containing the updated Cart and the generated orderUniqueId
   * @note The orderUniqueId falls back to an empty string if not present on the cart
   */
  order(userUniqueId: string): Promise<{ cart: Cart; orderUniqueId: string }>;

  /**
   * Place an order for a single item in the cart.
   * @param userUniqueId - The user unique ID who owns the cart
   * @param productUniqueId - The product unique ID to order
   * @returns Object containing the updated Cart and the generated orderUniqueId
   * @note The orderUniqueId falls back to an empty string if not present on the cart
   */
  orderItem(userUniqueId: string, productUniqueId: string): Promise<{ cart: Cart; orderUniqueId: string }>;

  /**
   * Cancel all items in the cart.
   * @param userUniqueId - The user unique ID who owns the cart
   * @returns The Cart after cancellation
   */
  cancel(userUniqueId: string): Promise<Cart>;

  /**
   * Cancel a specific item in the cart.
   * @param userUniqueId - The user unique ID who owns the cart
   * @param productUniqueId - The product unique ID to cancel
   * @returns The Cart after item cancellation
   */
  cancelItem(userUniqueId: string, productUniqueId: string): Promise<Cart>;
}

export function createCartService(transport: Transport, _config: { apiKey: string }): CartService {
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
