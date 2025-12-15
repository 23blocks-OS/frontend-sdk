import type { EntityStatus, IdentityCore } from '@23blocks/contracts';

export interface OfferCode extends IdentityCore {
  code: string;
  name?: string;
  description?: string;
  offerType: string;
  value?: number;
  isRedeemed: boolean;
  redeemedAt?: Date;
  redeemedBy?: string;
  expiresAt?: Date;
  status: EntityStatus;
  payload?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateOfferCodeRequest {
  code?: string;
  name?: string;
  description?: string;
  offerType: string;
  value?: number;
  expiresAt?: Date;
  payload?: Record<string, unknown>;
}

export interface SendOfferCodeRequest {
  code?: string;
  email: string;
  name?: string;
  templateId?: string;
  payload?: Record<string, unknown>;
}

export interface RedeemOfferCodeRequest {
  code: string;
  userUniqueId?: string;
}
