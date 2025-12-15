import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Wallet extends IdentityCore {
  userUniqueId: string;
  balance: number;
  currency: string;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface CreateWalletRequest {
  userUniqueId: string;
  currency?: string;
  initialBalance?: number;
  payload?: Record<string, unknown>;
}

export interface UpdateWalletRequest {
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListWalletsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  userUniqueId?: string;
  currency?: string;
}

export interface CreditWalletRequest {
  amount: number;
  description?: string;
  referenceType?: string;
  referenceUniqueId?: string;
  payload?: Record<string, unknown>;
}

export interface DebitWalletRequest {
  amount: number;
  description?: string;
  referenceType?: string;
  referenceUniqueId?: string;
  payload?: Record<string, unknown>;
}

export interface TransferWalletRequest {
  destinationWalletCode: string;
  amount: number;
  description?: string;
  payload?: Record<string, unknown>;
}

export interface ValidateWalletRequest {
  walletCode: string;
  amount?: number;
}

export interface ValidateWalletResponse {
  valid: boolean;
  message?: string;
  balance?: number;
  currency?: string;
}

export interface WalletContent {
  uniqueId: string;
  walletUniqueId: string;
  contentType?: string;
  contentData?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StoreWalletContentRequest {
  contentType?: string;
  contentData: Record<string, unknown>;
}

export interface TransactionWebhookRequest {
  /** External transaction ID from the payment provider */
  externalId: string;
  /** Transaction type: 'credit' or 'debit' */
  type: 'credit' | 'debit';
  /** Transaction amount */
  amount: number;
  /** Currency code (e.g., 'USD') */
  currency?: string;
  /** Description of the transaction */
  description?: string;
  /** Reference type for linking to external entity */
  referenceType?: string;
  /** Reference unique ID for linking to external entity */
  referenceUniqueId?: string;
  /** Additional metadata */
  payload?: Record<string, unknown>;
}

export interface TransactionWebhookResponse {
  success: boolean;
  transactionUniqueId?: string;
  message?: string;
}
