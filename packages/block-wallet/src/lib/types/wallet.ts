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
