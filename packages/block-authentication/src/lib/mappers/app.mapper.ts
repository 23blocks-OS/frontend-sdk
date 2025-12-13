import type { ResourceMapper, IncludedMap, JsonApiResource } from '@23blocks/jsonapi-codec';
import type { EntityStatus } from '@23blocks/contracts';
import type { App, Block, Service } from '../types/index.js';
import {
  parseString,
  parseDate,
  parseNumber,
  parseBoolean,
  parseStringArray,
} from './utils.js';

/**
 * Mapper for App resources
 */
export const appMapper: ResourceMapper<App> = {
  type: 'apps',

  map(resource: JsonApiResource, _included: IncludedMap): App {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      createdAt: parseDate(attrs.created_at) ?? new Date(),
      updatedAt: parseDate(attrs.updated_at) ?? new Date(),
      name: String(attrs.name ?? ''),
      description: parseString(attrs.description),
      appType: String(attrs.app_type ?? 'web'),
      status: (parseString(attrs.status) ?? 'active') as EntityStatus,
      appIcon: parseString(attrs.app_icon),
      oauthEnabled: parseBoolean(attrs.oauth_enabled),
      oauthAccessTokenLifetimeHours: parseNumber(attrs.oauth_access_token_lifetime_hours) ?? 24,
      oauthRefreshTokenLifetimeDays: parseNumber(attrs.oauth_refresh_token_lifetime_days) ?? 30,
      oauthRefreshTokenRotation: parseBoolean(attrs.oauth_refresh_token_rotation),
      oauthMaxRefreshTokensPerDevice: parseNumber(attrs.oauth_max_refresh_tokens_per_device) ?? 5,
      oauthDeviceManagement: parseBoolean(attrs.oauth_device_management),
      rateLimitPerMinute: parseNumber(attrs.rate_limit_per_minute),
      rateLimitPerHour: parseNumber(attrs.rate_limit_per_hour),
      webhookUrl: parseString(attrs.webhook_url),
      webhookSecret: parseString(attrs.webhook_secret),
      allowedOrigins: parseStringArray(attrs.allowed_origins),
      metadata: attrs.metadata as Record<string, unknown> | null,
      payload: attrs.payload as Record<string, unknown> | null,
      apiKeyCount: parseNumber(attrs.api_key_count) ?? 0,
      activeApiKeyCount: parseNumber(attrs.active_api_key_count) ?? 0,
    };
  },
};

/**
 * Mapper for Block resources
 */
export const blockMapper: ResourceMapper<Block> = {
  type: 'blocks',

  map(resource: JsonApiResource, _included: IncludedMap): Block {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      createdAt: parseDate(attrs.created_at) ?? new Date(),
      updatedAt: parseDate(attrs.updated_at) ?? new Date(),
      companyUniqueId: String(attrs.company_unique_id ?? ''),
      blockUniqueId: String(attrs.block_unique_id ?? ''),
      blockCode: String(attrs.block_code ?? ''),
      blockName: String(attrs.block_name ?? ''),
      addedAt: parseDate(attrs.added_at),
      status: (parseString(attrs.status) ?? 'active') as EntityStatus,
      subscriptionModel: parseString(attrs.subscription_model),
      subscriptionPlan: parseString(attrs.subscription_plan),
      subscriptionFee: parseNumber(attrs.subscription_fee),
      subscriptionTaxes: parseNumber(attrs.subscription_taxes),
      subscriptionTotal: parseNumber(attrs.subscription_total),
      lastPaymentAt: parseDate(attrs.last_payment_at),
      nextPaymentAt: parseDate(attrs.next_payment_at),
      payload: attrs.payload as Record<string, unknown> | null,
    };
  },
};

/**
 * Mapper for Service resources
 */
export const serviceMapper: ResourceMapper<Service> = {
  type: 'services',

  map(resource: JsonApiResource, _included: IncludedMap): Service {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      createdAt: parseDate(attrs.created_at) ?? new Date(),
      updatedAt: parseDate(attrs.updated_at) ?? new Date(),
      name: String(attrs.name ?? ''),
      code: String(attrs.code ?? ''),
      description: parseString(attrs.description),
      homePageUrl: parseString(attrs.home_page_url),
      healthCheckUrl: parseString(attrs.health_check_url),
      statusPageUrl: parseString(attrs.status_page_url),
      status: (parseString(attrs.status) ?? 'active') as EntityStatus,
      registeredAt: parseDate(attrs.registered_at),
      host: parseString(attrs.host),
      port: parseNumber(attrs.port),
      uri: parseString(attrs.uri),
      groupName: parseString(attrs.group_name),
      ipaddress: parseString(attrs.ipaddress),
    };
  },
};
