import type { Transport } from '@23blocks/contracts';
import { decodeMany } from '@23blocks/jsonapi-codec';
import type { Product } from '../types/product';
import { productMapper } from '../mappers/product.mapper';

export interface AddonsService {
  list(productUniqueId: string): Promise<Product[]>;
  add(productUniqueId: string, addonProductUniqueId: string): Promise<void>;
  remove(productUniqueId: string, addonUniqueId: string): Promise<void>;
}

export function createAddonsService(transport: Transport, _config: { appId: string }): AddonsService {
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
