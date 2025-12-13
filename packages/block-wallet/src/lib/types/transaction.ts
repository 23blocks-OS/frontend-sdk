import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export type TransactionType = 'credit' | 'debit';

export interface Transaction extends IdentityCore {
  walletUniqueId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description?: string;
  referenceType?: string;
  referenceUniqueId?: string;
  balanceBefore: number;
  balanceAfter: number;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListTransactionsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  walletUniqueId?: string;
  type?: TransactionType;
  referenceType?: string;
  referenceUniqueId?: string;
  startDate?: Date;
  endDate?: Date;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
