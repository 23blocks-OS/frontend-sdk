import type { ResourceMapper, IncludedMap, JsonApiResource } from '@23blocks/jsonapi-codec';
import type { ServiceToken, ServiceTokenWithJwt } from '../types/index.js';
import { parseDate, parseString, parseBoolean, parseStringArray, parseNumber } from './utils.js';

/**
 * Service Token mapper
 */
export const serviceTokenMapper: ResourceMapper<ServiceToken> = {
  type: 'ServiceToken',

  map(resource: JsonApiResource, _included: IncludedMap): ServiceToken {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      name: parseString(attrs.name) ?? '',
      tokenCategory: (attrs.token_category as ServiceToken['tokenCategory']) ?? 'service',
      scopes: parseStringArray(attrs.scopes),
      status: parseString(attrs.status) ?? 'active',
      expiresAt: attrs.expires_at ? parseDate(attrs.expires_at) : null,
      useCount: parseNumber(attrs.use_count),
      lastUsedAt: attrs.last_used_at ? parseDate(attrs.last_used_at) : null,
      createdAt: parseDate(attrs.created_at) ?? new Date(),
      updatedAt: parseDate(attrs.updated_at) ?? new Date(),

      // Computed attributes
      expired: parseBoolean(attrs.expired),
      active: parseBoolean(attrs.active),
      expiresInSeconds: attrs.expires_in_seconds != null ? parseNumber(attrs.expires_in_seconds) : null,
    };
  },
};

/**
 * Service Token with JWT mapper (only used on create/regenerate)
 */
export const serviceTokenWithJwtMapper: ResourceMapper<ServiceTokenWithJwt> = {
  type: 'ServiceToken',

  map(resource: JsonApiResource, included: IncludedMap): ServiceTokenWithJwt {
    const attrs = resource.attributes ?? {};
    const baseToken = serviceTokenMapper.map(resource, included);

    return {
      ...baseToken,
      jwt: parseString(attrs.jwt) ?? '',
    };
  },
};
