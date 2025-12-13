import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

/**
 * API Key entity
 */
export interface ApiKey extends IdentityCore {
  keyId: string;
  name: string;
  description: string | null;
  status: EntityStatus;
  serviceAccount: boolean;
  scopes: string[];
  expiresAt: Date | null;
  rateLimitPerMinute: number | null;
  rateLimitPerHour: number | null;
  rateLimitPerDay: number | null;
  allowedOrigins: string[];
  allowedIps: string[];
  lastUsedAt: Date | null;
  usageCount: number;
  revokedAt: Date | null;
  revocationReason: string | null;
  payload: Record<string, unknown> | null;

  // Computed attributes
  isExpired: boolean;
  daysUntilExpiry: number | null;
  usageToday: number;
  usageThisWeek: number;
  usageThisMonth: number;
}

/**
 * API Key with secret (only returned on create)
 */
export interface ApiKeyWithSecret extends ApiKey {
  secretKey: string;
}

/**
 * Create API key request
 */
export interface CreateApiKeyRequest {
  name: string;
  description?: string;
  serviceAccount?: boolean;
  scopes?: string[];
  expiresAt?: Date | string;
  rateLimitPerMinute?: number;
  rateLimitPerHour?: number;
  rateLimitPerDay?: number;
  allowedOrigins?: string[];
  allowedIps?: string[];
  payload?: Record<string, unknown>;
}

/**
 * Update API key request
 */
export interface UpdateApiKeyRequest {
  name?: string;
  description?: string;
  scopes?: string[];
  rateLimitPerMinute?: number;
  rateLimitPerHour?: number;
  rateLimitPerDay?: number;
  allowedOrigins?: string[];
  allowedIps?: string[];
  payload?: Record<string, unknown>;
}

/**
 * Revoke API key request
 */
export interface RevokeApiKeyRequest {
  reason?: string;
}
