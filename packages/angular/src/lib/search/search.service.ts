import { Injectable, Inject, Optional } from '@angular/core';
import type { Transport } from '@23blocks/contracts';
import {
  createSearchBlock,
  type SearchBlock,
  type SearchBlockConfig,
} from '@23blocks/block-search';
import { TRANSPORT, SEARCH_TRANSPORT, SEARCH_CONFIG } from '../tokens';

/**
 * Angular service wrapping the Search block.
 *
 * Exposes block sub-services directly via typed getters.
 * All methods return Promises - use `from()` to convert to Observables if needed.
 *
 * @example
 * ```typescript
 * // Promise-based (recommended for modern Angular):
 * const result = await this.searchService.search.search(request);
 *
 * // Observable-based:
 * from(this.searchService.search.search(request)).subscribe(...)
 * ```
 */
@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly block: SearchBlock | null;

  constructor(
    @Optional() @Inject(SEARCH_TRANSPORT) serviceTransport: Transport | null,
    @Optional() @Inject(TRANSPORT) legacyTransport: Transport | null,
    @Inject(SEARCH_CONFIG) config: SearchBlockConfig
  ) {
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createSearchBlock(transport, config) : null;
  }

  private ensureConfigured(): SearchBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] SearchService is not configured. ' +
        "Add 'urls.search' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  get search() { return this.ensureConfigured().search; }
  get history() { return this.ensureConfigured().history; }
  get favorites() { return this.ensureConfigured().favorites; }
  get entities() { return this.ensureConfigured().entities; }
  get identities() { return this.ensureConfigured().identities; }
  get jarvis() { return this.ensureConfigured().jarvis; }

  /** Full block access */
  get searchBlock(): SearchBlock { return this.ensureConfigured(); }
}
