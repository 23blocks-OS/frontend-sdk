import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, from } from 'rxjs';
import type { Transport, PageResult } from '@23blocks/contracts';
import {
  createWalletBlock,
  type WalletBlock,
  type WalletBlockConfig,
  type Wallet,
  type CreateWalletRequest,
  type UpdateWalletRequest,
  type ListWalletsParams,
  type CreditWalletRequest,
  type DebitWalletRequest,
  type Transaction,
  type ListTransactionsParams,
  type AuthorizationCode,
  type CreateAuthorizationCodeRequest,
  type ValidateAuthorizationCodeRequest,
  type UseAuthorizationCodeRequest,
  type ListAuthorizationCodesParams,
} from '@23blocks/block-wallet';
import { TRANSPORT, WALLET_TRANSPORT, WALLET_CONFIG } from '../tokens.js';

/**
 * Angular service wrapping the Wallet block.
 * Converts Promise-based APIs to RxJS Observables.
 *
 * @example
 * ```typescript
 * @Component({...})
 * export class WalletComponent {
 *   constructor(private wallet: WalletService) {}
 *
 *   createWallet(userUniqueId: string) {
 *     this.wallet.createWallet({ userUniqueId }).subscribe({
 *       next: (wallet) => console.log('Created:', wallet),
 *       error: (err) => console.error('Failed:', err),
 *     });
 *   }
 * }
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

  /**
   * Ensure the service is configured, throw helpful error if not
   */
  private ensureConfigured(): WalletBlock {
    if (!this.block) {
      throw new Error(
        '[23blocks] WalletService is not configured. ' +
        "Add 'urls.wallet' to your provideBlocks23() configuration."
      );
    }
    return this.block;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Wallets Service
  // ─────────────────────────────────────────────────────────────────────────────

  listWallets(params?: ListWalletsParams): Observable<PageResult<Wallet>> {
    return from(this.ensureConfigured().wallets.list(params));
  }

  getWallet(uniqueId: string): Observable<Wallet> {
    return from(this.ensureConfigured().wallets.get(uniqueId));
  }

  getWalletByUser(userUniqueId: string): Observable<Wallet> {
    return from(this.ensureConfigured().wallets.getByUser(userUniqueId));
  }

  createWallet(data: CreateWalletRequest): Observable<Wallet> {
    return from(this.ensureConfigured().wallets.create(data));
  }

  updateWallet(uniqueId: string, data: UpdateWalletRequest): Observable<Wallet> {
    return from(this.ensureConfigured().wallets.update(uniqueId, data));
  }

  creditWallet(uniqueId: string, data: CreditWalletRequest): Observable<Transaction> {
    return from(this.ensureConfigured().wallets.credit(uniqueId, data));
  }

  debitWallet(uniqueId: string, data: DebitWalletRequest): Observable<Transaction> {
    return from(this.ensureConfigured().wallets.debit(uniqueId, data));
  }

  getWalletBalance(uniqueId: string): Observable<{ balance: number; currency: string }> {
    return from(this.ensureConfigured().wallets.getBalance(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Transactions Service
  // ─────────────────────────────────────────────────────────────────────────────

  listTransactions(params?: ListTransactionsParams): Observable<PageResult<Transaction>> {
    return from(this.ensureConfigured().transactions.list(params));
  }

  getTransaction(uniqueId: string): Observable<Transaction> {
    return from(this.ensureConfigured().transactions.get(uniqueId));
  }

  listTransactionsByWallet(
    walletUniqueId: string,
    params?: ListTransactionsParams
  ): Observable<PageResult<Transaction>> {
    return from(this.ensureConfigured().transactions.listByWallet(walletUniqueId, params));
  }

  listTransactionsByReference(
    referenceType: string,
    referenceUniqueId: string,
    params?: ListTransactionsParams
  ): Observable<PageResult<Transaction>> {
    return from(this.ensureConfigured().transactions.listByReference(referenceType, referenceUniqueId, params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Authorization Codes Service
  // ─────────────────────────────────────────────────────────────────────────────

  listAuthorizationCodes(params?: ListAuthorizationCodesParams): Observable<PageResult<AuthorizationCode>> {
    return from(this.ensureConfigured().authorizationCodes.list(params));
  }

  getAuthorizationCode(uniqueId: string): Observable<AuthorizationCode> {
    return from(this.ensureConfigured().authorizationCodes.get(uniqueId));
  }

  createAuthorizationCode(data: CreateAuthorizationCodeRequest): Observable<AuthorizationCode> {
    return from(this.ensureConfigured().authorizationCodes.create(data));
  }

  validateAuthorizationCode(
    data: ValidateAuthorizationCodeRequest
  ): Observable<{ valid: boolean; authorizationCode?: AuthorizationCode }> {
    return from(this.ensureConfigured().authorizationCodes.validate(data));
  }

  useAuthorizationCode(data: UseAuthorizationCodeRequest): Observable<Transaction> {
    return from(this.ensureConfigured().authorizationCodes.use(data));
  }

  invalidateAuthorizationCode(uniqueId: string): Observable<AuthorizationCode> {
    return from(this.ensureConfigured().authorizationCodes.invalidate(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get rawBlock(): WalletBlock {
    return this.ensureConfigured();
  }
}
