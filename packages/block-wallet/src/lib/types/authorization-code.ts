import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface AuthorizationCode extends IdentityCore {
  walletUniqueId: string;
  code: string;
  amount: number;
  purpose?: string;
  expiresAt?: Date;
  usedAt?: Date;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface CreateAuthorizationCodeRequest {
  walletUniqueId: string;
  amount: number;
  purpose?: string;
  expiresAt?: Date;
  payload?: Record<string, unknown>;
}

export interface ValidateAuthorizationCodeRequest {
  code: string;
  amount?: number;
}

export interface UseAuthorizationCodeRequest {
  code: string;
  amount: number;
  description?: string;
}

export interface ListAuthorizationCodesParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  walletUniqueId?: string;
  includeExpired?: boolean;
  includeUsed?: boolean;
}
