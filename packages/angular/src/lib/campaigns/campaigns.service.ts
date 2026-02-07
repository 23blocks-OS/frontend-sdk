import { Injectable, Inject, Optional } from '@angular/core';
import type { Transport } from '@23blocks/contracts';
import {
  createCampaignsBlock,
  type CampaignsBlock,
  type CampaignsBlockConfig,
} from '@23blocks/block-campaigns';
import { TRANSPORT, CAMPAIGNS_TRANSPORT, CAMPAIGNS_CONFIG } from '../tokens';

/**
 * Angular service wrapping the Campaigns block.
 *
 * Exposes block sub-services directly via typed getters.
 * All methods return Promises - use `from()` to convert to Observables if needed.
 *
 * @example
 * ```typescript
 * const campaigns = await this.campaignsService.campaigns.list({ page: 1, perPage: 10 });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class CampaignsService {
  private readonly block: CampaignsBlock | null;

  constructor(
    @Optional() @Inject(CAMPAIGNS_TRANSPORT) serviceTransport: Transport | null,
    @Optional() @Inject(TRANSPORT) legacyTransport: Transport | null,
    @Inject(CAMPAIGNS_CONFIG) config: CampaignsBlockConfig
  ) {
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createCampaignsBlock(transport, config) : null;
  }

  private ensureConfigured(): CampaignsBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] CampaignsService is not configured. ' +
        "Add 'urls.campaigns' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  get campaigns() { return this.ensureConfigured().campaigns; }
  get campaignMedia() { return this.ensureConfigured().campaignMedia; }
  get landingPages() { return this.ensureConfigured().landingPages; }
  get audiences() { return this.ensureConfigured().audiences; }
  get landingTemplates() { return this.ensureConfigured().landingTemplates; }
  get targets() { return this.ensureConfigured().targets; }
  get results() { return this.ensureConfigured().results; }
  get markets() { return this.ensureConfigured().markets; }
  get locations() { return this.ensureConfigured().locations; }
  get templates() { return this.ensureConfigured().templates; }
  get mediaResults() { return this.ensureConfigured().mediaResults; }
  get media() { return this.ensureConfigured().media; }

  /** Full block access */
  get campaignsBlock(): CampaignsBlock { return this.ensureConfigured(); }
}
