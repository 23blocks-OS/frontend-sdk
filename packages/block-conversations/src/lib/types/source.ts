import type { IdentityCore } from '@23blocks/contracts';

export interface Source extends IdentityCore {
  name?: string;
  sourceType?: string;
  externalId?: string;
  status?: string;
  metadata?: Record<string, unknown>;
  payload?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}
