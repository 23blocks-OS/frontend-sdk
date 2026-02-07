import { Injectable, Inject, Optional } from '@angular/core';
import type { Transport } from '@23blocks/contracts';
import {
  createFormsBlock,
  type FormsBlock,
  type FormsBlockConfig,
} from '@23blocks/block-forms';
import { TRANSPORT, FORMS_TRANSPORT, FORMS_CONFIG } from '../tokens';

/**
 * Angular service wrapping the Forms block.
 *
 * Exposes block sub-services directly via typed getters.
 * All methods return Promises - use `from()` to convert to Observables if needed.
 *
 * @example
 * ```typescript
 * const forms = await this.formsService.forms.list();
 * ```
 */
@Injectable({ providedIn: 'root' })
export class FormsService {
  private readonly block: FormsBlock | null;

  constructor(
    @Optional() @Inject(FORMS_TRANSPORT) serviceTransport: Transport | null,
    @Optional() @Inject(TRANSPORT) legacyTransport: Transport | null,
    @Inject(FORMS_CONFIG) config: FormsBlockConfig
  ) {
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createFormsBlock(transport, config) : null;
  }

  private ensureConfigured(): FormsBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] FormsService is not configured. ' +
        "Add 'urls.forms' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  get forms() { return this.ensureConfigured().forms; }
  get schemas() { return this.ensureConfigured().schemas; }
  get schemaVersions() { return this.ensureConfigured().schemaVersions; }
  get instances() { return this.ensureConfigured().instances; }
  get sets() { return this.ensureConfigured().sets; }
  get landings() { return this.ensureConfigured().landings; }
  get subscriptions() { return this.ensureConfigured().subscriptions; }
  get appointments() { return this.ensureConfigured().appointments; }
  get surveys() { return this.ensureConfigured().surveys; }
  get referrals() { return this.ensureConfigured().referrals; }
  get mailTemplates() { return this.ensureConfigured().mailTemplates; }
  get applicationForms() { return this.ensureConfigured().applicationForms; }
  get crmSync() { return this.ensureConfigured().crmSync; }

  /** Full block access */
  get formsBlock(): FormsBlock { return this.ensureConfigured(); }
}
