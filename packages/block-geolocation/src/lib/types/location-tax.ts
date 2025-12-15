import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface LocationTax extends IdentityCore {
  locationUniqueId: string;
  name: string;
  rate: number;
  taxType?: string;
  isInclusive: boolean;
  isDefault: boolean;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface CreateLocationTaxRequest {
  name: string;
  rate: number;
  taxType?: string;
  isInclusive?: boolean;
  isDefault?: boolean;
  payload?: Record<string, unknown>;
}

export interface UpdateLocationTaxRequest {
  name?: string;
  rate?: number;
  taxType?: string;
  isInclusive?: boolean;
  isDefault?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}
