// Products block aligned with backend strong params
import { Injectable, Inject, Optional } from '@angular/core';
import type { Transport } from '@23blocks/contracts';
import {
  createProductsBlock,
  type ProductsBlock,
  type ProductsBlockConfig,
} from '@23blocks/block-products';
import { TRANSPORT, PRODUCTS_TRANSPORT, PRODUCTS_CONFIG } from '../tokens';

/**
 * Angular service wrapping the Products block.
 *
 * Exposes block sub-services directly via typed getters.
 * All methods return Promises - use `from()` to convert to Observables if needed.
 *
 * @example
 * ```typescript
 * const products = await this.productsService.products.list();
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly block: ProductsBlock | null;

  constructor(
    @Optional() @Inject(PRODUCTS_TRANSPORT) serviceTransport: Transport | null,
    @Optional() @Inject(TRANSPORT) legacyTransport: Transport | null,
    @Inject(PRODUCTS_CONFIG) config: ProductsBlockConfig
  ) {
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createProductsBlock(transport, config) : null;
  }

  private ensureConfigured(): ProductsBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] ProductsService is not configured. ' +
        "Add 'urls.products' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  get products() { return this.ensureConfigured().products; }
  get cart() { return this.ensureConfigured().cart; }
  get cartDetails() { return this.ensureConfigured().cartDetails; }
  get categories() { return this.ensureConfigured().categories; }
  get brands() { return this.ensureConfigured().brands; }
  get vendors() { return this.ensureConfigured().vendors; }
  get warehouses() { return this.ensureConfigured().warehouses; }
  get channels() { return this.ensureConfigured().channels; }
  get collections() { return this.ensureConfigured().collections; }
  get productSets() { return this.ensureConfigured().productSets; }
  get shoppingLists() { return this.ensureConfigured().shoppingLists; }
  get promotions() { return this.ensureConfigured().promotions; }
  get prices() { return this.ensureConfigured().prices; }
  get filters() { return this.ensureConfigured().filters; }
  get images() { return this.ensureConfigured().images; }
  get variations() { return this.ensureConfigured().variations; }
  get reviews() { return this.ensureConfigured().reviews; }
  get variationReviews() { return this.ensureConfigured().variationReviews; }
  get stock() { return this.ensureConfigured().stock; }
  get suggestions() { return this.ensureConfigured().suggestions; }
  get addons() { return this.ensureConfigured().addons; }
  get myCarts() { return this.ensureConfigured().myCarts; }
  get remarketing() { return this.ensureConfigured().remarketing; }
  get visitors() { return this.ensureConfigured().visitors; }
  get productVendors() { return this.ensureConfigured().productVendors; }
  get tags() { return this.ensureConfigured().tags; }
  get catalogs() { return this.ensureConfigured().catalogs; }
  get categoryImages() { return this.ensureConfigured().categoryImages; }

  /** Full block access */
  get productsBlock(): ProductsBlock { return this.ensureConfigured(); }
}
