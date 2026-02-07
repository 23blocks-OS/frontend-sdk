import { Injectable, Inject, Optional } from '@angular/core';
import type { Transport } from '@23blocks/contracts';
import {
  createRewardsBlock,
  type RewardsBlock,
  type RewardsBlockConfig,
} from '@23blocks/block-rewards';
import { TRANSPORT, REWARDS_TRANSPORT, REWARDS_CONFIG } from '../tokens';

/**
 * Angular service wrapping the Rewards block.
 *
 * Exposes block sub-services directly via typed getters.
 * All methods return Promises - use `from()` to convert to Observables if needed.
 *
 * @example
 * ```typescript
 * const rewards = await this.rewardsService.rewards.list({ status: 'active' });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class RewardsService {
  private readonly block: RewardsBlock | null;

  constructor(
    @Optional() @Inject(REWARDS_TRANSPORT) serviceTransport: Transport | null,
    @Optional() @Inject(TRANSPORT) legacyTransport: Transport | null,
    @Inject(REWARDS_CONFIG) config: RewardsBlockConfig
  ) {
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createRewardsBlock(transport, config) : null;
  }

  private ensureConfigured(): RewardsBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] RewardsService is not configured. ' +
        "Add 'urls.rewards' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  get rewards() { return this.ensureConfigured().rewards; }
  get coupons() { return this.ensureConfigured().coupons; }
  get loyalty() { return this.ensureConfigured().loyalty; }
  get badges() { return this.ensureConfigured().badges; }
  get couponConfigurations() { return this.ensureConfigured().couponConfigurations; }
  get offerCodes() { return this.ensureConfigured().offerCodes; }
  get expirationRules() { return this.ensureConfigured().expirationRules; }
  get customers() { return this.ensureConfigured().customers; }
  get badgeCategories() { return this.ensureConfigured().badgeCategories; }
  get moneyRules() { return this.ensureConfigured().moneyRules; }
  get productRules() { return this.ensureConfigured().productRules; }
  get eventRules() { return this.ensureConfigured().eventRules; }

  /** Full block access */
  get rewardsBlock(): RewardsBlock { return this.ensureConfigured(); }
}
