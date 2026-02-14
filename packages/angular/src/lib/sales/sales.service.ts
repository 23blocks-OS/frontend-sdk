import { Injectable, Inject, Optional } from '@angular/core';
import type { Transport } from '@23blocks/contracts';
import {
  createSalesBlock,
  type SalesBlock,
  type SalesBlockConfig,
} from '@23blocks/block-sales';
import { TRANSPORT, SALES_TRANSPORT, SALES_CONFIG } from '../tokens';

/**
 * Angular service wrapping the Sales block.
 *
 * Exposes block sub-services directly via typed getters.
 * All methods return Promises - use `from()` to convert to Observables if needed.
 *
 * @example
 * ```typescript
 * const order = await this.salesService.orders.get('uuid');
 * const purchase = await this.salesService.purchases.create({ ... });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class SalesService {
  private readonly block: SalesBlock | null;

  constructor(
    @Optional() @Inject(SALES_TRANSPORT) serviceTransport: Transport | null,
    @Optional() @Inject(TRANSPORT) legacyTransport: Transport | null,
    @Inject(SALES_CONFIG) config: SalesBlockConfig
  ) {
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createSalesBlock(transport, config) : null;
  }

  private ensureConfigured(): SalesBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] SalesService is not configured. ' +
        "Add 'urls.sales' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  get orders() { return this.ensureConfigured().orders; }
  get orderDetails() { return this.ensureConfigured().orderDetails; }
  get orderTaxes() { return this.ensureConfigured().orderTaxes; }
  get payments() { return this.ensureConfigured().payments; }
  get subscriptions() { return this.ensureConfigured().subscriptions; }
  get subscriptionModels() { return this.ensureConfigured().subscriptionModels; }
  get entities() { return this.ensureConfigured().entities; }
  get users() { return this.ensureConfigured().users; }
  get customers() { return this.ensureConfigured().customers; }
  get flexibleOrders() { return this.ensureConfigured().flexibleOrders; }
  get stripe() { return this.ensureConfigured().stripe; }
  get mercadopago() { return this.ensureConfigured().mercadopago; }
  get vendorPayments() { return this.ensureConfigured().vendorPayments; }
  get purchases() { return this.ensureConfigured().purchases; }

  /** Full block access */
  get salesBlock(): SalesBlock { return this.ensureConfigured(); }
}
