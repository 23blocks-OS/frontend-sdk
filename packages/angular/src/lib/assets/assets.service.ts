import { Injectable, Inject, Optional } from '@angular/core';
import type { Transport } from '@23blocks/contracts';
import {
  createAssetsBlock,
  type AssetsBlock,
  type AssetsBlockConfig,
} from '@23blocks/block-assets';
import { TRANSPORT, ASSETS_TRANSPORT, ASSETS_CONFIG } from '../tokens';

/**
 * Angular service wrapping the Assets block.
 *
 * Exposes block sub-services directly via typed getters.
 * All methods return Promises - use `from()` to convert to Observables if needed.
 *
 * @example
 * ```typescript
 * const assets = await this.assetsService.assets.list();
 * ```
 */
@Injectable({ providedIn: 'root' })
export class AssetsService {
  private readonly block: AssetsBlock | null;

  constructor(
    @Optional() @Inject(ASSETS_TRANSPORT) serviceTransport: Transport | null,
    @Optional() @Inject(TRANSPORT) legacyTransport: Transport | null,
    @Inject(ASSETS_CONFIG) config: AssetsBlockConfig
  ) {
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createAssetsBlock(transport, config) : null;
  }

  private ensureConfigured(): AssetsBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] AssetsService is not configured. ' +
        "Add 'urls.assets' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  get assets() { return this.ensureConfigured().assets; }
  get events() { return this.ensureConfigured().events; }
  get audits() { return this.ensureConfigured().audits; }
  get categories() { return this.ensureConfigured().categories; }
  get tags() { return this.ensureConfigured().tags; }
  get vendors() { return this.ensureConfigured().vendors; }
  get warehouses() { return this.ensureConfigured().warehouses; }
  get entities() { return this.ensureConfigured().entities; }
  get operations() { return this.ensureConfigured().operations; }
  get alerts() { return this.ensureConfigured().alerts; }
  get users() { return this.ensureConfigured().users; }
  get images() { return this.ensureConfigured().images; }

  /** Full block access */
  get assetsBlock(): AssetsBlock { return this.ensureConfigured(); }
}
