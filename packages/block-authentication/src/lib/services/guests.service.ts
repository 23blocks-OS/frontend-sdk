import type { Transport, PageResult, ListParams } from '@23blocks/contracts';
import type { JsonApiDocument } from '@23blocks/jsonapi-codec';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Guest,
  MagicLink,
  RefreshToken,
  UserDevice,
  TenantUser,
  MailTemplate,
  CreateMagicLinkRequest,
  RegisterDeviceRequest,
} from '../types/index.js';
import {
  guestMapper,
  magicLinkMapper,
  refreshTokenMapper,
  userDeviceMapper,
  tenantUserMapper,
  mailTemplateMapper,
} from '../mappers/index.js';
import type { AuthenticationBlockConfig } from '../authentication.block.js';

/**
 * Guests service interface
 */
export interface GuestsService {
  /**
   * List guests
   */
  list(params?: ListParams): Promise<PageResult<Guest>>;

  /**
   * Get a guest by ID
   */
  get(id: string): Promise<Guest>;

  /**
   * Track a guest visit
   */
  track(): Promise<Guest>;

  /**
   * Convert guest to user (registration)
   */
  convert(id: string): Promise<Guest>;
}

/**
 * Magic links service interface
 */
export interface MagicLinksService {
  /**
   * List magic links
   */
  list(params?: ListParams): Promise<PageResult<MagicLink>>;

  /**
   * Get a magic link by ID
   */
  get(id: string): Promise<MagicLink>;

  /**
   * Create a magic link
   */
  create(request: CreateMagicLinkRequest): Promise<MagicLink>;

  /**
   * Validate a magic link token
   */
  validate(token: string): Promise<MagicLink>;

  /**
   * Expire a magic link
   */
  expire(id: string): Promise<MagicLink>;
}

/**
 * Refresh tokens service interface
 */
export interface RefreshTokensService {
  /**
   * List refresh tokens for the current user
   */
  list(params?: ListParams): Promise<PageResult<RefreshToken>>;

  /**
   * Get a refresh token by ID
   */
  get(id: string): Promise<RefreshToken>;

  /**
   * Revoke a refresh token
   */
  revoke(id: string): Promise<RefreshToken>;

  /**
   * Revoke all refresh tokens for current user
   */
  revokeAll(): Promise<void>;

  /**
   * Revoke all refresh tokens except current
   */
  revokeOthers(): Promise<void>;
}

/**
 * User devices service interface
 */
export interface UserDevicesService {
  /**
   * List devices for current user
   */
  list(params?: ListParams): Promise<PageResult<UserDevice>>;

  /**
   * Get a device by ID
   */
  get(id: string): Promise<UserDevice>;

  /**
   * Register a new device
   */
  register(request: RegisterDeviceRequest): Promise<UserDevice>;

  /**
   * Update device settings
   */
  update(id: string, request: Partial<RegisterDeviceRequest>): Promise<UserDevice>;

  /**
   * Unregister a device
   */
  unregister(id: string): Promise<void>;

  /**
   * Set default device
   */
  setDefault(id: string): Promise<UserDevice>;
}

/**
 * Tenant users service interface
 */
export interface TenantUsersService {
  /**
   * Get current tenant user context
   */
  current(): Promise<TenantUser>;

  /**
   * Get tenant user by user ID
   */
  get(userUniqueId: string): Promise<TenantUser>;

  /**
   * List tenant users
   */
  list(params?: ListParams): Promise<TenantUser[]>;
}

/**
 * Mail templates service interface
 */
export interface MailTemplatesService {
  /**
   * List mail templates
   */
  list(params?: ListParams): Promise<PageResult<MailTemplate>>;

  /**
   * Get a mail template by ID
   */
  get(id: string): Promise<MailTemplate>;

  /**
   * Get a mail template by event name
   */
  getByEvent(eventName: string): Promise<MailTemplate>;

  /**
   * Update a mail template
   */
  update(id: string, template: Partial<MailTemplate>): Promise<MailTemplate>;
}

/**
 * Build filter params for list operations
 */
function buildListParams(params?: ListParams): Record<string, string | number | boolean | string[] | undefined> {
  if (!params) return {};

  const queryParams: Record<string, string | number | boolean | string[] | undefined> = {};

  if (params.page) {
    queryParams['page[number]'] = params.page;
  }
  if (params.perPage) {
    queryParams['page[size]'] = params.perPage;
  }

  if (params.sort) {
    const sorts = Array.isArray(params.sort) ? params.sort : [params.sort];
    queryParams['sort'] = sorts
      .map((s) => (s.direction === 'desc' ? `-${s.field}` : s.field))
      .join(',');
  }

  if (params.filter) {
    for (const [key, value] of Object.entries(params.filter)) {
      queryParams[`filter[${key}]`] = value;
    }
  }

  if (params.include) {
    queryParams['include'] = params.include.join(',');
  }

  return queryParams;
}

/**
 * Create the guests service
 */
export function createGuestsService(
  transport: Transport,
  _config: AuthenticationBlockConfig
): GuestsService {
  return {
    async list(params?: ListParams): Promise<PageResult<Guest>> {
      const response = await transport.get<JsonApiDocument>(
        '/guests',
        { params: buildListParams(params) }
      );
      return decodePageResult(response, guestMapper);
    },

    async get(id: string): Promise<Guest> {
      const response = await transport.get<JsonApiDocument>(`/guests/${id}`);
      return decodeOne(response, guestMapper);
    },

    async track(): Promise<Guest> {
      const response = await transport.post<JsonApiDocument>('/guests/track');
      return decodeOne(response, guestMapper);
    },

    async convert(id: string): Promise<Guest> {
      const response = await transport.post<JsonApiDocument>(
        `/guests/${id}/convert`
      );
      return decodeOne(response, guestMapper);
    },
  };
}

/**
 * Create the magic links service
 */
export function createMagicLinksService(
  transport: Transport,
  _config: AuthenticationBlockConfig
): MagicLinksService {
  return {
    async list(params?: ListParams): Promise<PageResult<MagicLink>> {
      const response = await transport.get<JsonApiDocument>(
        '/magic_links',
        { params: buildListParams(params) }
      );
      return decodePageResult(response, magicLinkMapper);
    },

    async get(id: string): Promise<MagicLink> {
      const response = await transport.get<JsonApiDocument>(
        `/magic_links/${id}`
      );
      return decodeOne(response, magicLinkMapper);
    },

    async create(request: CreateMagicLinkRequest): Promise<MagicLink> {
      const response = await transport.post<JsonApiDocument>('/magic_links', {
        magic_link: {
          user_unique_id: request.userUniqueId,
          user_email: request.email,
          target_url: request.targetUrl,
          expired_url: request.expiredUrl,
          expires_at: request.expiresInHours ? new Date(Date.now() + request.expiresInHours * 60 * 60 * 1000).toISOString() : undefined,
          description: request.description,
          payload: request.payload,
        },
      });
      return decodeOne(response, magicLinkMapper);
    },

    async validate(token: string): Promise<MagicLink> {
      const response = await transport.post<JsonApiDocument>(
        '/magic_links/validate',
        { token }
      );
      return decodeOne(response, magicLinkMapper);
    },

    async expire(id: string): Promise<MagicLink> {
      const response = await transport.post<JsonApiDocument>(
        `/magic_links/${id}/expire`
      );
      return decodeOne(response, magicLinkMapper);
    },
  };
}

/**
 * Create the refresh tokens service
 */
export function createRefreshTokensService(
  transport: Transport,
  _config: AuthenticationBlockConfig
): RefreshTokensService {
  return {
    async list(params?: ListParams): Promise<PageResult<RefreshToken>> {
      const response = await transport.get<JsonApiDocument>(
        '/refresh_tokens',
        { params: buildListParams(params) }
      );
      return decodePageResult(response, refreshTokenMapper);
    },

    async get(id: string): Promise<RefreshToken> {
      const response = await transport.get<JsonApiDocument>(
        `/refresh_tokens/${id}`
      );
      return decodeOne(response, refreshTokenMapper);
    },

    async revoke(id: string): Promise<RefreshToken> {
      const response = await transport.post<JsonApiDocument>(
        `/refresh_tokens/${id}/revoke`
      );
      return decodeOne(response, refreshTokenMapper);
    },

    async revokeAll(): Promise<void> {
      await transport.post('/refresh_tokens/revoke_all');
    },

    async revokeOthers(): Promise<void> {
      await transport.post('/refresh_tokens/revoke_others');
    },
  };
}

/**
 * Create the user devices service
 */
export function createUserDevicesService(
  transport: Transport,
  _config: AuthenticationBlockConfig
): UserDevicesService {
  return {
    async list(params?: ListParams): Promise<PageResult<UserDevice>> {
      const response = await transport.get<JsonApiDocument>(
        '/user_devices',
        { params: buildListParams(params) }
      );
      return decodePageResult(response, userDeviceMapper);
    },

    async get(id: string): Promise<UserDevice> {
      const response = await transport.get<JsonApiDocument>(
        `/user_devices/${id}`
      );
      return decodeOne(response, userDeviceMapper);
    },

    async register(request: RegisterDeviceRequest): Promise<UserDevice> {
      const response = await transport.post<JsonApiDocument>('/users/devices', {
        device: {
          device_type: request.deviceType,
          push_id: request.pushId,
          os_type: request.osType,
          default_device: request.defaultDevice,
          location_enabled: request.locationEnabled,
          notifications_enabled: request.notificationsEnabled,
        },
      });
      return decodeOne(response, userDeviceMapper);
    },

    async update(
      id: string,
      request: Partial<RegisterDeviceRequest>
    ): Promise<UserDevice> {
      const response = await transport.patch<JsonApiDocument>(
        `/users/devices/${id}`,
        {
          device: {
            device_type: request.deviceType,
            push_id: request.pushId,
            os_type: request.osType,
            default_device: request.defaultDevice,
            location_enabled: request.locationEnabled,
            notifications_enabled: request.notificationsEnabled,
          },
        }
      );
      return decodeOne(response, userDeviceMapper);
    },

    async unregister(id: string): Promise<void> {
      await transport.delete(`/user_devices/${id}`);
    },

    async setDefault(id: string): Promise<UserDevice> {
      const response = await transport.post<JsonApiDocument>(
        `/user_devices/${id}/set_default`
      );
      return decodeOne(response, userDeviceMapper);
    },
  };
}

/**
 * Create the tenant users service
 */
export function createTenantUsersService(
  transport: Transport,
  _config: AuthenticationBlockConfig
): TenantUsersService {
  return {
    async current(): Promise<TenantUser> {
      const response = await transport.get<JsonApiDocument>(
        '/tenant_users/current'
      );
      return decodeOne(response, tenantUserMapper);
    },

    async get(userUniqueId: string): Promise<TenantUser> {
      const response = await transport.get<JsonApiDocument>(
        `/tenant_users/${userUniqueId}`
      );
      return decodeOne(response, tenantUserMapper);
    },

    async list(params?: ListParams): Promise<TenantUser[]> {
      const response = await transport.get<JsonApiDocument>(
        '/tenant_users',
        { params: buildListParams(params) }
      );
      return decodeMany(response, tenantUserMapper);
    },
  };
}

/**
 * Create the mail templates service
 */
export function createMailTemplatesService(
  transport: Transport,
  _config: AuthenticationBlockConfig
): MailTemplatesService {
  return {
    async list(params?: ListParams): Promise<PageResult<MailTemplate>> {
      const response = await transport.get<JsonApiDocument>(
        '/mail_templates',
        { params: buildListParams(params) }
      );
      return decodePageResult(response, mailTemplateMapper);
    },

    async get(id: string): Promise<MailTemplate> {
      const response = await transport.get<JsonApiDocument>(
        `/mail_templates/${id}`
      );
      return decodeOne(response, mailTemplateMapper);
    },

    async getByEvent(eventName: string): Promise<MailTemplate> {
      const response = await transport.get<JsonApiDocument>(
        `/mail_templates/by_event/${eventName}`
      );
      return decodeOne(response, mailTemplateMapper);
    },

    async update(id: string, template: Partial<MailTemplate>): Promise<MailTemplate> {
      const response = await transport.put<JsonApiDocument>(
        `/mail_templates/${id}`,
        {
          template: {
            template_name: template.templateName,
            template_html: template.templateHtml,
            template_text: template.templateText,
            from_domain: template.fromDomain,
            from_address: template.fromAddress,
            from_name: template.fromName,
            from_subject: template.fromSubject,
            payload: template.payload,
            preferred_language: template.preferredLanguage,
            provider: template.provider,
          },
        }
      );
      return decodeOne(response, mailTemplateMapper);
    },
  };
}
