import type { Transport } from '@23blocks/contracts';
import { decodeOne } from '@23blocks/jsonapi-codec';
import type { CartDetail } from '../types/cart.js';
import { cartDetailMapper } from '../mappers/cart.mapper.js';

/**
 * Cart Details Service - manages individual cart item lifecycle
 *
 * This service handles the order fulfillment workflow for individual cart items:
 * order -> accepted -> processing -> ready -> shipped -> delivered
 *
 * Items can also be cancelled or returned at various stages.
 */
export interface CartDetailsService {
  /**
   * Mark cart detail as ordered.
   * @param cartUniqueId - The cart unique ID
   * @param detailUniqueId - The cart detail unique ID
   * @returns The updated CartDetail with ordered status
   */
  order(cartUniqueId: string, detailUniqueId: string): Promise<CartDetail>;

  /**
   * Accept the order for this cart detail (vendor confirms).
   * @param cartUniqueId - The cart unique ID
   * @param detailUniqueId - The cart detail unique ID
   * @returns The updated CartDetail with accepted status
   */
  accept(cartUniqueId: string, detailUniqueId: string): Promise<CartDetail>;

  /**
   * Start processing the cart detail item.
   * @param cartUniqueId - The cart unique ID
   * @param detailUniqueId - The cart detail unique ID
   * @returns The updated CartDetail with start-processing status
   */
  startProcessing(cartUniqueId: string, detailUniqueId: string): Promise<CartDetail>;

  /**
   * Mark cart detail as being processed.
   * @param cartUniqueId - The cart unique ID
   * @param detailUniqueId - The cart detail unique ID
   * @returns The updated CartDetail with processing status
   */
  processing(cartUniqueId: string, detailUniqueId: string): Promise<CartDetail>;

  /**
   * Mark cart detail as ready for shipping/pickup.
   * @param cartUniqueId - The cart unique ID
   * @param detailUniqueId - The cart detail unique ID
   * @returns The updated CartDetail with ready status
   */
  ready(cartUniqueId: string, detailUniqueId: string): Promise<CartDetail>;

  /**
   * Mark cart detail as shipped.
   * @param cartUniqueId - The cart unique ID
   * @param detailUniqueId - The cart detail unique ID
   * @returns The updated CartDetail with shipped status
   */
  ship(cartUniqueId: string, detailUniqueId: string): Promise<CartDetail>;

  /**
   * Mark cart detail as delivered.
   * @param cartUniqueId - The cart unique ID
   * @param detailUniqueId - The cart detail unique ID
   * @returns The updated CartDetail with delivered status
   */
  deliver(cartUniqueId: string, detailUniqueId: string): Promise<CartDetail>;

  /**
   * Cancel this cart detail item.
   * @param cartUniqueId - The cart unique ID
   * @param detailUniqueId - The cart detail unique ID
   * @returns The updated CartDetail with cancelled status
   */
  cancel(cartUniqueId: string, detailUniqueId: string): Promise<CartDetail>;

  /**
   * Initiate return for this cart detail item.
   * @param cartUniqueId - The cart unique ID
   * @param detailUniqueId - The cart detail unique ID
   * @returns The updated CartDetail with return-initiated status
   */
  return(cartUniqueId: string, detailUniqueId: string): Promise<CartDetail>;
}

export function createCartDetailsService(transport: Transport, _config: { appId: string }): CartDetailsService {
  return {
    async order(cartUniqueId: string, detailUniqueId: string): Promise<CartDetail> {
      const response = await transport.put<unknown>(
        `/carts/${cartUniqueId}/details/${detailUniqueId}/order`,
        {}
      );
      return decodeOne(response, cartDetailMapper);
    },

    async accept(cartUniqueId: string, detailUniqueId: string): Promise<CartDetail> {
      const response = await transport.put<unknown>(
        `/carts/${cartUniqueId}/details/${detailUniqueId}/accepted`,
        {}
      );
      return decodeOne(response, cartDetailMapper);
    },

    async startProcessing(cartUniqueId: string, detailUniqueId: string): Promise<CartDetail> {
      const response = await transport.put<unknown>(
        `/carts/${cartUniqueId}/details/${detailUniqueId}/start`,
        {}
      );
      return decodeOne(response, cartDetailMapper);
    },

    async processing(cartUniqueId: string, detailUniqueId: string): Promise<CartDetail> {
      const response = await transport.put<unknown>(
        `/carts/${cartUniqueId}/details/${detailUniqueId}/processing`,
        {}
      );
      return decodeOne(response, cartDetailMapper);
    },

    async ready(cartUniqueId: string, detailUniqueId: string): Promise<CartDetail> {
      const response = await transport.put<unknown>(
        `/carts/${cartUniqueId}/details/${detailUniqueId}/ready`,
        {}
      );
      return decodeOne(response, cartDetailMapper);
    },

    async ship(cartUniqueId: string, detailUniqueId: string): Promise<CartDetail> {
      const response = await transport.put<unknown>(
        `/carts/${cartUniqueId}/details/${detailUniqueId}/ship`,
        {}
      );
      return decodeOne(response, cartDetailMapper);
    },

    async deliver(cartUniqueId: string, detailUniqueId: string): Promise<CartDetail> {
      const response = await transport.put<unknown>(
        `/carts/${cartUniqueId}/details/${detailUniqueId}/deliver`,
        {}
      );
      return decodeOne(response, cartDetailMapper);
    },

    async cancel(cartUniqueId: string, detailUniqueId: string): Promise<CartDetail> {
      const response = await transport.put<unknown>(
        `/carts/${cartUniqueId}/details/${detailUniqueId}/cancel`,
        {}
      );
      return decodeOne(response, cartDetailMapper);
    },

    async return(cartUniqueId: string, detailUniqueId: string): Promise<CartDetail> {
      const response = await transport.put<unknown>(
        `/carts/${cartUniqueId}/details/${detailUniqueId}/return`,
        {}
      );
      return decodeOne(response, cartDetailMapper);
    },
  };
}
