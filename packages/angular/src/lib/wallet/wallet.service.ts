import { Injectable, Inject } from '@angular/core';
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
import { TRANSPORT, WALLET_CONFIG } from '../tokens.js';

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
  private readonly block: WalletBlock;

  constructor(
    @Inject(TRANSPORT) transport: Transport,
    @Inject(WALLET_CONFIG) config: WalletBlockConfig
  ) {
    this.block = createWalletBlock(transport, config);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Wallets Service
  // ─────────────────────────────────────────────────────────────────────────────

  listWallets(params?: ListWalletsParams): Observable<PageResult<Wallet>> {
    return from(this.block.wallets.list(params));
  }

  getWallet(uniqueId: string): Observable<Wallet> {
    return from(this.block.wallets.get(uniqueId));
  }

  getWalletByUser(userUniqueId: string): Observable<Wallet> {
    return from(this.block.wallets.getByUser(userUniqueId));
  }

  createWallet(data: CreateWalletRequest): Observable<Wallet> {
    return from(this.block.wallets.create(data));
  }

  updateWallet(uniqueId: string, data: UpdateWalletRequest): Observable<Wallet> {
    return from(this.block.wallets.update(uniqueId, data));
  }

  creditWallet(uniqueId: string, data: CreditWalletRequest): Observable<Transaction> {
    return from(this.block.wallets.credit(uniqueId, data));
  }

  debitWallet(uniqueId: string, data: DebitWalletRequest): Observable<Transaction> {
    return from(this.block.wallets.debit(uniqueId, data));
  }

  getWalletBalance(uniqueId: string): Observable<{ balance: number; currency: string }> {
    return from(this.block.wallets.getBalance(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Transactions Service
  // ─────────────────────────────────────────────────────────────────────────────

  listTransactions(params?: ListTransactionsParams): Observable<PageResult<Transaction>> {
    return from(this.block.transactions.list(params));
  }

  getTransaction(uniqueId: string): Observable<Transaction> {
    return from(this.block.transactions.get(uniqueId));
  }

  listTransactionsByWallet(
    walletUniqueId: string,
    params?: ListTransactionsParams
  ): Observable<PageResult<Transaction>> {
    return from(this.block.transactions.listByWallet(walletUniqueId, params));
  }

  listTransactionsByReference(
    referenceType: string,
    referenceUniqueId: string,
    params?: ListTransactionsParams
  ): Observable<PageResult<Transaction>> {
    return from(this.block.transactions.listByReference(referenceType, referenceUniqueId, params));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Authorization Codes Service
  // ─────────────────────────────────────────────────────────────────────────────

  listAuthorizationCodes(params?: ListAuthorizationCodesParams): Observable<PageResult<AuthorizationCode>> {
    return from(this.block.authorizationCodes.list(params));
  }

  getAuthorizationCode(uniqueId: string): Observable<AuthorizationCode> {
    return from(this.block.authorizationCodes.get(uniqueId));
  }

  createAuthorizationCode(data: CreateAuthorizationCodeRequest): Observable<AuthorizationCode> {
    return from(this.block.authorizationCodes.create(data));
  }

  validateAuthorizationCode(
    data: ValidateAuthorizationCodeRequest
  ): Observable<{ valid: boolean; authorizationCode?: AuthorizationCode }> {
    return from(this.block.authorizationCodes.validate(data));
  }

  useAuthorizationCode(data: UseAuthorizationCodeRequest): Observable<Transaction> {
    return from(this.block.authorizationCodes.use(data));
  }

  invalidateAuthorizationCode(uniqueId: string): Observable<AuthorizationCode> {
    return from(this.block.authorizationCodes.invalidate(uniqueId));
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Direct Block Access (for advanced usage)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Access the underlying block for advanced operations
   * Use this when you need access to services not wrapped by this Angular service
   */
  get rawBlock(): WalletBlock {
    return this.block;
  }
}
