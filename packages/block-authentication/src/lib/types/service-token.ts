import type { IdentityCore } from '@23blocks/contracts';

/**
 * Token category for service tokens
 */
export type ServiceTokenCategory = 'agent' | 'service';

/**
 * Service Token entity for machine-to-machine authentication.
 *
 * - `agent` tokens are short-lived (1-24h) for AI agents
 * - `service` tokens are long-lived (30-365 days) for block-to-block communication
 */
export interface ServiceToken extends IdentityCore {
  name: string;
  tokenCategory: ServiceTokenCategory;
  scopes: string[];
  status: string;
  expiresAt: Date | null;
  useCount: number;
  lastUsedAt: Date | null;

  // Computed attributes
  expired: boolean;
  active: boolean;
  expiresInSeconds: number | null;
}

/**
 * Service Token with JWT (only returned on create and regenerate)
 */
export interface ServiceTokenWithJwt extends ServiceToken {
  jwt: string;
}

/**
 * Create service token request
 */
export interface CreateServiceTokenRequest {
  name: string;
  tokenCategory: ServiceTokenCategory;
  scopes?: string[];
  expiresInDays?: number;
}
