import type { Transport } from '@23blocks/contracts';
import { decodeMany } from '@23blocks/jsonapi-codec';
import type { Product } from '../types/product.js';
import { productMapper } from '../mappers/product.mapper.js';

export interface AddonsService {
  /**
   * List all addon products linked to a given product.
   * @param productUniqueId - The parent product unique ID
   * @returns Array of Product items representing the addons
   */
  list(productUniqueId: string): Promise<Product[]>;

  /**
   * Link an addon product to a product.
   * @param productUniqueId - The parent product unique ID
   * @param addonProductUniqueId - The addon product unique ID to link
   * @returns Resolves when the addon has been linked
   */
  add(productUniqueId: string, addonProductUniqueId: string): Promise<void>;

  /**
   * Remove an addon link from a product.
   * @param productUniqueId - The parent product unique ID
   * @param addonUniqueId - The addon unique ID to unlink
   * @returns Resolves when the addon has been removed
   */
  remove(productUniqueId: string, addonUniqueId: string): Promise<void>;
}

export function createAddonsService(transport: Transport, _config: { apiKey: string }): AddonsService {
  return {
    async list(productUniqueId: string): Promise<Product[]> {
      const response = await transport.get<unknown>(`/products/${productUniqueId}/addons`);
      return decodeMany(response, productMapper);
    },

    async add(productUniqueId: string, addonProductUniqueId: string): Promise<void> {
      await transport.post(`/products/${productUniqueId}/addons`, {
        addon_unique_id: addonProductUniqueId,
      });
    },

    async remove(productUniqueId: string, addonUniqueId: string): Promise<void> {
      await transport.delete(`/products/${productUniqueId}/addons/${addonUniqueId}`);
    },
  };
}
