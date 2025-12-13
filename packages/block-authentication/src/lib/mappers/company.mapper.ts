import type { ResourceMapper, IncludedMap, JsonApiResource } from '@23blocks/jsonapi-codec';
import { resolveRelationship, resolveRelationshipMany } from '@23blocks/jsonapi-codec';
import type { Company, CompanyDetail, CompanyBlock, CompanyKey, Tenant } from '../types/index.js';
import { parseDate, parseString, parseBoolean } from './utils.js';

/**
 * Company detail mapper
 */
export const companyDetailMapper: ResourceMapper<CompanyDetail> = {
  type: 'CompanyDetail',

  map(resource: JsonApiResource, _included: IncludedMap): CompanyDetail {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      companyUniqueId: parseString(attrs.company_unique_id) ?? '',
      address: parseString(attrs.address),
      city: parseString(attrs.city),
      state: parseString(attrs.state),
      zipcode: parseString(attrs.zipcode),
      country: parseString(attrs.country),
      phone: parseString(attrs.phone),
      email: parseString(attrs.email),
      website: parseString(attrs.website),
      description: parseString(attrs.description),
      logoUrl: parseString(attrs.logo_url),
      payload: attrs.payload as Record<string, unknown> | null,
      createdAt: parseDate(attrs.created_at) ?? new Date(),
      updatedAt: parseDate(attrs.updated_at) ?? new Date(),
    };
  },
};

/**
 * Company block mapper
 */
export const companyBlockMapper: ResourceMapper<CompanyBlock> = {
  type: 'CompanyBlock',

  map(resource: JsonApiResource, _included: IncludedMap): CompanyBlock {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      companyUniqueId: parseString(attrs.company_unique_id) ?? '',
      blockId: parseString(attrs.block_id) ?? '',
      blockName: parseString(attrs.block_name) ?? '',
      status: (attrs.status as CompanyBlock['status']) ?? 'active',
      payload: attrs.payload as Record<string, unknown> | null,
      createdAt: parseDate(attrs.created_at) ?? new Date(),
      updatedAt: parseDate(attrs.updated_at) ?? new Date(),
    };
  },
};

/**
 * Company key mapper
 */
export const companyKeyMapper: ResourceMapper<CompanyKey> = {
  type: 'CompanyKey',

  map(resource: JsonApiResource, _included: IncludedMap): CompanyKey {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      companyUniqueId: parseString(attrs.company_unique_id) ?? '',
      name: parseString(attrs.name) ?? '',
      keyId: parseString(attrs.key_id) ?? '',
      status: (attrs.status as CompanyKey['status']) ?? 'active',
      expiresAt: parseDate(attrs.expires_at),
      lastUsedAt: parseDate(attrs.last_used_at),
      createdAt: parseDate(attrs.created_at) ?? new Date(),
      updatedAt: parseDate(attrs.updated_at) ?? new Date(),
    };
  },
};

/**
 * Company mapper
 */
export const companyMapper: ResourceMapper<Company> = {
  type: 'Company',

  map(resource: JsonApiResource, included: IncludedMap): Company {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      name: parseString(attrs.name) ?? '',
      code: parseString(attrs.code) ?? '',
      preferredLanguage: parseString(attrs.preferred_language),
      preferredDomain: parseString(attrs.preferred_domain),
      apiUrl: parseString(attrs.api_url),
      apiAccessKey: parseString(attrs.api_access_key),
      payload: attrs.payload as Record<string, unknown> | null,
      status: (attrs.status as Company['status']) ?? 'active',
      publicStorageUrl: parseString(attrs.public_storage_url),
      storageUrl: parseString(attrs.storage_url),
      createdAt: parseDate(attrs.created_at) ?? new Date(),
      updatedAt: parseDate(attrs.updated_at) ?? new Date(),

      // Conditional admin-only attributes
      schemaName: parseString(attrs.schema_name) ?? undefined,
      urlId: parseString(attrs.url_id) ?? undefined,
      slackHook: parseString(attrs.slack_hook) ?? undefined,
      slackChannel: parseString(attrs.slack_channel) ?? undefined,
      slackUsername: parseString(attrs.slack_username) ?? undefined,
      openAccess: attrs.open_access != null ? parseBoolean(attrs.open_access) : undefined,

      // Resolve relationships
      companyDetail: resolveRelationship(resource, 'company_detail', included, companyDetailMapper),
      companyBlocks: resolveRelationshipMany(resource, 'company_blocks', included, companyBlockMapper),
      companyKeys: resolveRelationshipMany(resource, 'company_keys', included, companyKeyMapper),
    };
  },
};

/**
 * Tenant mapper
 */
export const tenantMapper: ResourceMapper<Tenant> = {
  type: 'Tenant',

  map(resource: JsonApiResource, _included: IncludedMap): Tenant {
    const attrs = resource.attributes ?? {};

    return {
      gatewayUrl: parseString(attrs.gateway_url) ?? '',
      tenantAccessKey: parseString(attrs.tenant_access_key) ?? '',
      tenantUrlId: parseString(attrs.tenant_url_id) ?? '',
      payload: attrs.payload as Record<string, unknown> | null,
    };
  },
};
