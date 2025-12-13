import type { ResourceMapper, IncludedMap, JsonApiResource } from '@23blocks/jsonapi-codec';
import type { EntityStatus } from '@23blocks/contracts';
import type {
  Guest,
  MagicLink,
  RefreshToken,
  UserDevice,
  TenantUser,
  MailTemplate,
} from '../types/index.js';
import {
  parseString,
  parseDate,
  parseNumber,
  parseBoolean,
  parseStringArray,
} from './utils.js';

/**
 * Mapper for Guest resources
 */
export const guestMapper: ResourceMapper<Guest> = {
  type: 'guests',

  map(resource: JsonApiResource, _included: IncludedMap): Guest {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      createdAt: parseDate(attrs.created_at) ?? new Date(),
      updatedAt: parseDate(attrs.updated_at) ?? new Date(),
      email: parseString(attrs.email),
      username: parseString(attrs.username),
      name: parseString(attrs.name),
      currentVisitingAt: parseDate(attrs.current_visiting_at),
      currentVisitingIp: parseString(attrs.current_visiting_ip),
      lastVisitingAt: parseDate(attrs.last_visiting_at),
      lastVisitingIp: parseString(attrs.last_visiting_ip),
      status: (parseString(attrs.status) ?? 'active') as EntityStatus,
      registeredAt: parseDate(attrs.registered_at),
      userUniqueId: parseString(attrs.user_unique_id),
      accessToken: parseString(attrs.access_token),
    };
  },
};

/**
 * Mapper for MagicLink resources
 */
export const magicLinkMapper: ResourceMapper<MagicLink> = {
  type: 'magic_links',

  map(resource: JsonApiResource, _included: IncludedMap): MagicLink {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      createdAt: parseDate(attrs.created_at) ?? new Date(),
      updatedAt: parseDate(attrs.updated_at) ?? new Date(),
      userUniqueId: String(attrs.user_unique_id ?? ''),
      userName: parseString(attrs.user_name),
      userEmail: parseString(attrs.user_email),
      token: String(attrs.token ?? ''),
      expiresAt: parseDate(attrs.expires_at) ?? new Date(),
      targetUrl: parseString(attrs.target_url),
      expiredUrl: parseString(attrs.expired_url),
      status: (parseString(attrs.status) ?? 'active') as EntityStatus,
      validationUrl: parseString(attrs.validation_url),
      description: parseString(attrs.description),
      thumbnailUrl: parseString(attrs.thumbnail_url),
      contentUrl: parseString(attrs.content_url),
      mediaUrl: parseString(attrs.media_url),
      imageUrl: parseString(attrs.image_url),
      payload: attrs.payload as Record<string, unknown> | null,
    };
  },
};

/**
 * Mapper for RefreshToken resources
 */
export const refreshTokenMapper: ResourceMapper<RefreshToken> = {
  type: 'refresh_tokens',

  map(resource: JsonApiResource, _included: IncludedMap): RefreshToken {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      createdAt: parseDate(attrs.created_at) ?? new Date(),
      updatedAt: parseDate(attrs.updated_at) ?? new Date(),
      token: String(attrs.token ?? ''),
      expiresAt: parseDate(attrs.expires_at) ?? new Date(),
      status: (parseString(attrs.status) ?? 'active') as EntityStatus,
      revoked: parseBoolean(attrs.revoked),
      scopes: parseStringArray(attrs.scopes),
      deviceId: parseString(attrs.device_id),
      userAgent: parseString(attrs.user_agent),
      ipAddress: parseString(attrs.ip_address),
      lastUsedAt: parseDate(attrs.last_used_at),
      expired: parseBoolean(attrs.expired),
      active: parseBoolean(attrs.active),
      expiresInSeconds: parseNumber(attrs.expires_in_seconds) ?? 0,
      daysUntilExpiry: parseNumber(attrs.days_until_expiry) ?? 0,
    };
  },
};

/**
 * Mapper for UserDevice resources
 */
export const userDeviceMapper: ResourceMapper<UserDevice> = {
  type: 'user_devices',

  map(resource: JsonApiResource, _included: IncludedMap): UserDevice {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      createdAt: parseDate(attrs.created_at) ?? new Date(),
      updatedAt: parseDate(attrs.updated_at) ?? new Date(),
      userUniqueId: String(attrs.user_unique_id ?? ''),
      status: (parseString(attrs.status) ?? 'active') as EntityStatus,
      deviceType: parseString(attrs.device_type),
      pushId: parseString(attrs.push_id),
      osType: parseString(attrs.os_type),
      defaultDevice: parseBoolean(attrs.default_device),
      locationEnabled: parseBoolean(attrs.location_enabled),
      notificationsEnabled: parseBoolean(attrs.notifications_enabled),
    };
  },
};

/**
 * Mapper for TenantUser resources (not a standard REST resource)
 */
export const tenantUserMapper: ResourceMapper<TenantUser> = {
  type: 'tenant_users',

  map(resource: JsonApiResource, _included: IncludedMap): TenantUser {
    const attrs = resource.attributes ?? {};

    return {
      gatewayUrl: String(attrs.gateway_url ?? ''),
      userId: String(attrs.user_id ?? ''),
      userUniqueId: String(attrs.user_unique_id ?? ''),
      userEmail: parseString(attrs.user_email),
      userName: parseString(attrs.user_name),
      roleUniqueId: parseString(attrs.role_unique_id),
      roleName: parseString(attrs.role_name),
      roleId: parseString(attrs.role_id),
      tenantId: String(attrs.tenant_id ?? ''),
      tenantUniqueId: String(attrs.tenant_unique_id ?? ''),
      tenantAccessKey: String(attrs.tenant_access_key ?? ''),
      tenantUrlId: String(attrs.tenant_url_id ?? ''),
      payload: attrs.payload as Record<string, unknown> | null,
      onboardingCompleted: parseBoolean(attrs.onboarding_completed),
      purchaseCompleted: parseBoolean(attrs.purchase_completed),
      parentOnboardingCompleted: parseBoolean(attrs.parent_onboarding_completed),
      parentPurchaseCompleted: parseBoolean(attrs.parent_purchase_completed),
    };
  },
};

/**
 * Mapper for MailTemplate resources
 */
export const mailTemplateMapper: ResourceMapper<MailTemplate> = {
  type: 'mail_templates',

  map(resource: JsonApiResource, _included: IncludedMap): MailTemplate {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      createdAt: parseDate(attrs.created_at) ?? new Date(),
      updatedAt: parseDate(attrs.updated_at) ?? new Date(),
      eventName: String(attrs.event_name ?? ''),
      name: String(attrs.name ?? ''),
      source: parseString(attrs.source),
      sourceAlias: parseString(attrs.source_alias),
      sourceId: parseString(attrs.source_id),
      sourceType: parseString(attrs.source_type),
      templateName: parseString(attrs.template_name),
      templateHtml: parseString(attrs.template_html),
      templateText: parseString(attrs.template_text),
      fromDomain: parseString(attrs.from_domain),
      fromAddress: parseString(attrs.from_address),
      fromName: parseString(attrs.from_name),
      fromSubject: parseString(attrs.from_subject),
      payload: attrs.payload as Record<string, unknown> | null,
      preferredLanguage: parseString(attrs.preferred_language),
      status: (parseString(attrs.status) ?? 'active') as EntityStatus,
      provider: parseString(attrs.provider),
    };
  },
};
