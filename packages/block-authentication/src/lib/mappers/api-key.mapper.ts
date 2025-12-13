import type { ResourceMapper, IncludedMap, JsonApiResource } from '@23blocks/jsonapi-codec';
import type { ApiKey, ApiKeyWithSecret } from '../types/index.js';
import { parseDate, parseString, parseBoolean, parseStringArray, parseNumber } from './utils.js';

/**
 * API Key mapper
 */
export const apiKeyMapper: ResourceMapper<ApiKey> = {
  type: 'ApiKey',

  map(resource: JsonApiResource, _included: IncludedMap): ApiKey {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      keyId: parseString(attrs.key_id) ?? '',
      name: parseString(attrs.name) ?? '',
      description: parseString(attrs.description),
      status: (attrs.status as ApiKey['status']) ?? 'active',
      serviceAccount: parseBoolean(attrs.service_account),
      scopes: parseStringArray(attrs.scopes),
      expiresAt: parseDate(attrs.expires_at),
      rateLimitPerMinute: parseNumber(attrs.rate_limit_per_minute),
      rateLimitPerHour: parseNumber(attrs.rate_limit_per_hour),
      rateLimitPerDay: parseNumber(attrs.rate_limit_per_day),
      allowedOrigins: parseStringArray(attrs.allowed_origins),
      allowedIps: parseStringArray(attrs.allowed_ips),
      lastUsedAt: parseDate(attrs.last_used_at),
      usageCount: parseNumber(attrs.usage_count) ?? 0,
      revokedAt: parseDate(attrs.revoked_at),
      revocationReason: parseString(attrs.revocation_reason),
      payload: attrs.payload as Record<string, unknown> | null,
      createdAt: parseDate(attrs.created_at) ?? new Date(),
      updatedAt: parseDate(attrs.updated_at) ?? new Date(),

      // Computed attributes
      isExpired: parseBoolean(attrs.is_expired),
      daysUntilExpiry: parseNumber(attrs.days_until_expiry),
      usageToday: parseNumber(attrs.usage_today) ?? 0,
      usageThisWeek: parseNumber(attrs.usage_this_week) ?? 0,
      usageThisMonth: parseNumber(attrs.usage_this_month) ?? 0,
    };
  },
};

/**
 * API Key with secret mapper (only used on create/regenerate)
 */
export const apiKeyWithSecretMapper: ResourceMapper<ApiKeyWithSecret> = {
  type: 'ApiKey',

  map(resource: JsonApiResource, included: IncludedMap): ApiKeyWithSecret {
    const attrs = resource.attributes ?? {};
    const baseKey = apiKeyMapper.map(resource, included);

    return {
      ...baseKey,
      secretKey: parseString(attrs.secret_key) ?? '',
    };
  },
};
