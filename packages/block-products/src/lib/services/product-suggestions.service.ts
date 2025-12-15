import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type { Product } from '../types/product';
import { productMapper } from '../mappers/product.mapper';

export interface ProductSuggestionsService {
  list(productUniqueId: string): Promise<Product[]>;
  add(productUniqueId: string, suggestedProductUniqueId: string): Promise<void>;
  remove(productUniqueId: string, suggestedProductUniqueId: string): Promise<void>;
  getReplacements(productUniqueId: string): Promise<Product[]>;
  addReplacements(productUniqueId: string, replacementProductUniqueIds: string[]): Promise<void>;
}

export function createProductSuggestionsService(transport: Transport, _config: { appId: string }): ProductSuggestionsService {
  return {
    async list(productUniqueId: string): Promise<Product[]> {
      const response = await transport.get<unknown>(`/products/${productUniqueId}/suggestions`);
      return decodeMany(response, productMapper);
    },

    async add(productUniqueId: string, suggestedProductUniqueId: string): Promise<void> {
      await transport.post(`/products/${productUniqueId}/suggestions`, {
        product_unique_id: suggestedProductUniqueId,
      });
    },

    async remove(productUniqueId: string, suggestedProductUniqueId: string): Promise<void> {
      await transport.delete(`/products/${productUniqueId}/suggestions/${suggestedProductUniqueId}`);
    },

    async getReplacements(productUniqueId: string): Promise<Product[]> {
      const response = await transport.get<unknown>(`/products/${productUniqueId}/replacements`);
      return decodeMany(response, productMapper);
    },

    async addReplacements(productUniqueId: string, replacementProductUniqueIds: string[]): Promise<void> {
      await transport.post(`/products/${productUniqueId}/replacements`, {
        replacement_product_unique_ids: replacementProductUniqueIds,
      });
    },
  };
}
