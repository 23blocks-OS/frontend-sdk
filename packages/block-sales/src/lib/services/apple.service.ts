import type { Transport } from '@23blocks/contracts';
import type {
  AppleAccountToken,
  AppleRestoreResult,
  AppleSubscription,
  CreateAppleTransactionRequest,
  RestoreAppleTransactionsRequest,
} from '../types/apple.js';
import { appleSubscriptionMapper } from '../mappers/apple.mapper.js';

/** Maximum signed transactions accepted per restore call */
const MAX_RESTORE_TRANSACTIONS = 50;

/**
 * Apple In-App Purchase (App Store) service.
 *
 * Responses are plain JSON `{ data: ... }` (snake_case), not JSON:API.
 * Apple subscriptions are managed in iOS Settings (`manageUrl`), never via the Stripe portal.
 */
export interface AppleService {
  /** Mint the token to pass to StoreKit 2 as `appAccountToken` (token user only) */
  accountToken(): Promise<AppleAccountToken>;
  /** Record a StoreKit 2 purchase; 403 if it belongs to another user */
  createTransaction(data: CreateAppleTransactionRequest): Promise<AppleSubscription>;
  /** Restore purchases (max 50 signed transactions) */
  restore(data: RestoreAppleTransactionsRequest): Promise<AppleRestoreResult>;
  /** List the user's App Store subscriptions */
  listSubscriptions(): Promise<AppleSubscription[]>;
}

export function createAppleService(transport: Transport, _config?: unknown): AppleService {
  return {
    async accountToken(): Promise<AppleAccountToken> {
      const response = await transport.post<{ data: { app_account_token: string } }>(
        '/apple/account_token'
      );
      return { appAccountToken: response.data.app_account_token };
    },

    async createTransaction(data: CreateAppleTransactionRequest): Promise<AppleSubscription> {
      const body: Record<string, unknown> = { signed_transaction: data.signedTransaction };
      if (data.signedRenewalInfo) body['signed_renewal_info'] = data.signedRenewalInfo;
      const response = await transport.post<{ data: Record<string, unknown> }>(
        '/apple/transactions',
        body
      );
      return appleSubscriptionMapper(response.data);
    },

    async restore(data: RestoreAppleTransactionsRequest): Promise<AppleRestoreResult> {
      if (data.signedTransactions.length > MAX_RESTORE_TRANSACTIONS) {
        throw new Error(`restore accepts at most ${MAX_RESTORE_TRANSACTIONS} signed transactions`);
      }
      const response = await transport.post<{
        data?: Record<string, unknown>[];
        errors?: Record<string, unknown>[];
      }>('/apple/restore', { signed_transactions: data.signedTransactions });
      return {
        data: (response.data ?? []).map(appleSubscriptionMapper),
        errors: response.errors ?? [],
      };
    },

    async listSubscriptions(): Promise<AppleSubscription[]> {
      const response = await transport.get<{ data?: Record<string, unknown>[] }>(
        '/apple/subscriptions'
      );
      return (response.data ?? []).map(appleSubscriptionMapper);
    },
  };
}
