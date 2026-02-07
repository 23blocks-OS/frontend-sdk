import { Injectable, Inject, Optional } from '@angular/core';
import type { Transport } from '@23blocks/contracts';
import {
  createWalletBlock,
  type WalletBlock,
  type WalletBlockConfig,
} from '@23blocks/block-wallet';
import { TRANSPORT, WALLET_TRANSPORT, WALLET_CONFIG } from '../tokens';

/**
 * Angular service wrapping the Wallet block.
 *
 * Exposes block sub-services directly via typed getters.
 * All methods return Promises - use `from()` to convert to Observables if needed.
 *
 * @example
 * ```typescript
 * const wallet = await this.walletService.wallets.create({ userUniqueId });
 * ```
 */
@Injectable({ providedIn: 'root' })
export class WalletService {
  private readonly block: WalletBlock | null;

  constructor(
    @Optional() @Inject(WALLET_TRANSPORT) serviceTransport: Transport | null,
    @Optional() @Inject(TRANSPORT) legacyTransport: Transport | null,
    @Inject(WALLET_CONFIG) config: WalletBlockConfig
  ) {
    const transport = serviceTransport ?? legacyTransport;
    this.block = transport ? createWalletBlock(transport, config) : null;
  }

  private ensureConfigured(): WalletBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] WalletService is not configured. ' +
        "Add 'urls.wallet' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  get wallets() { return this.ensureConfigured().wallets; }
  get transactions() { return this.ensureConfigured().transactions; }
  get authorizationCodes() { return this.ensureConfigured().authorizationCodes; }
  get webhooks() { return this.ensureConfigured().webhooks; }

  /** Full block access */
  get walletBlock(): WalletBlock { return this.ensureConfigured(); }
}
