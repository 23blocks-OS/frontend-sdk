import { Injectable, Inject, Optional } from '@angular/core';
import type { Transport } from '@23blocks/contracts';
import {
  createOnboardingBlock,
  type OnboardingBlock,
  type OnboardingBlockConfig,
} from '@23blocks/block-onboarding';
import { TRANSPORT, ONBOARDING_TRANSPORT, ONBOARDING_CONFIG } from '../tokens';

/**
 * Angular service wrapping the Onboarding block.
 *
 * Exposes block sub-services directly via typed getters.
 * All methods return Promises - use `from()` to convert to Observables if needed.
 *
 * @example
 * ```typescript
 * const onboarding = await this.onboardingService.onboardings.create({ code: 'user-onboarding', name: 'User Onboarding' });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class OnboardingService {
  private readonly block: OnboardingBlock | null;

  constructor(
    @Optional() @Inject(ONBOARDING_TRANSPORT) serviceTransport: Transport | null,
    @Optional() @Inject(TRANSPORT) legacyTransport: Transport | null,
    @Inject(ONBOARDING_CONFIG) config: OnboardingBlockConfig
  ) {
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createOnboardingBlock(transport, config) : null;
  }

  private ensureConfigured(): OnboardingBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] OnboardingService is not configured. ' +
        "Add 'urls.onboarding' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  get onboardings() { return this.ensureConfigured().onboardings; }
  get flows() { return this.ensureConfigured().flows; }
  get userJourneys() { return this.ensureConfigured().userJourneys; }
  get userIdentities() { return this.ensureConfigured().userIdentities; }
  get onboard() { return this.ensureConfigured().onboard; }
  get mailTemplates() { return this.ensureConfigured().mailTemplates; }
  get remarketing() { return this.ensureConfigured().remarketing; }

  /** Full block access */
  get onboardingBlock(): OnboardingBlock { return this.ensureConfigured(); }
}
