import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeMany } from '@23blocks/jsonapi-codec';
import type { Product } from '../types/product.js';
import { productMapper } from '../mappers/product.mapper.js';

export interface ProductSuggestionsService {
  /**
   * List all suggested products for a given product.
   * @param productUniqueId - The product unique ID
   * @returns Array of suggested Product items
   */
  list(productUniqueId: string): Promise<Product[]>;

  /**
   * Add a product suggestion link.
   * @param productUniqueId - The source product unique ID
   * @param suggestedProductUniqueId - The suggested product unique ID to link
   * @returns Resolves when the suggestion has been added
   */
  add(productUniqueId: string, suggestedProductUniqueId: string): Promise<void>;

  /**
   * Remove a product suggestion link.
   * @param productUniqueId - The source product unique ID
   * @param suggestedProductUniqueId - The suggested product unique ID to unlink
   * @returns Resolves when the suggestion has been removed
   */
  remove(productUniqueId: string, suggestedProductUniqueId: string): Promise<void>;

  /**
   * Get replacement products for a given product.
   * @param productUniqueId - The product unique ID
   * @returns Array of replacement Product items
   */
  getReplacements(productUniqueId: string): Promise<Product[]>;

  /**
   * Add multiple replacement product links at once.
   * @param productUniqueId - The source product unique ID
   * @param replacementProductUniqueIds - Array of product unique IDs to link as replacements
   * @returns Resolves when the replacements have been added
   */
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
