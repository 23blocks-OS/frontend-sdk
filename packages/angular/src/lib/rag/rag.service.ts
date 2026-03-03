import { Injectable, Inject, Optional } from '@angular/core';
import type { Transport } from '@23blocks/contracts';
import {
  createRagBlock,
  type RagBlock,
  type RagBlockConfig,
} from '@23blocks/block-rag';
import { TRANSPORT, RAG_TRANSPORT, RAG_CONFIG } from '../tokens';

/**
 * Angular service wrapping the RAG block.
 *
 * Exposes block sub-services directly via typed getters.
 * All methods return Promises - use `from()` to convert to Observables if needed.
 *
 * @example
 * ```typescript
 * // Promise-based (recommended for modern Angular):
 * const result = await this.ragService.scope.query('entities', { query: 'revenue' });
 *
 * // Observable-based:
 * from(this.ragService.scope.query('entities', { query: 'revenue' })).subscribe(...)
 * ```
 */
@Injectable({ providedIn: 'root' })
export class RagService {
  private readonly block: RagBlock | null;

  constructor(
    @Optional() @Inject(RAG_TRANSPORT) serviceTransport: Transport | null,
    @Optional() @Inject(TRANSPORT) legacyTransport: Transport | null,
    @Inject(RAG_CONFIG) config: RagBlockConfig
  ) {
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createRagBlock(transport, config) : null;
  }

  private ensureConfigured(): RagBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] RagService is not configured. ' +
        "Add 'urls.rag' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  get scope() { return this.ensureConfigured().scope; }
  get files() { return this.ensureConfigured().files; }
  get jobs() { return this.ensureConfigured().jobs; }
  get images() { return this.ensureConfigured().images; }
  get products() { return this.ensureConfigured().products; }

  /** Full block access */
  get ragBlock(): RagBlock { return this.ensureConfigured(); }
}
