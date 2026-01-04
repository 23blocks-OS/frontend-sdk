import type { Transport, BlockConfig } from '@23blocks/contracts';
import { createAuthService, type AuthService } from './services/auth.service.js';
import { createUsersService, type UsersService } from './services/users.service.js';
import { createRolesService, type RolesService } from './services/roles.service.js';
import { createPermissionsService, type PermissionsService } from './services/permissions.service.js';
import { createApiKeysService, type ApiKeysService } from './services/api-keys.service.js';
import {
  createAppsService,
  createBlocksService,
  createServicesRegistryService,
  type AppsService,
  type BlocksService,
  type ServicesRegistryService,
} from './services/apps.service.js';
import {
  createSubscriptionModelsService,
  createUserSubscriptionsService,
  createCompanySubscriptionsService,
  type SubscriptionModelsService,
  type UserSubscriptionsService,
  type CompanySubscriptionsService,
} from './services/subscriptions.service.js';
import {
  createCountriesService,
  createStatesService,
  createCountiesService,
  createCitiesService,
  createCurrenciesService,
  type CountriesService,
  type StatesService,
  type CountiesService,
  type CitiesService,
  type CurrenciesService,
} from './services/geography.service.js';
import {
  createGuestsService,
  createMagicLinksService,
  createRefreshTokensService,
  createUserDevicesService,
  createTenantUsersService,
  createMailTemplatesService,
  type GuestsService,
  type MagicLinksService,
  type RefreshTokensService,
  type UserDevicesService,
  type TenantUsersService,
  type MailTemplatesService,
} from './services/guests.service.js';
import { createMfaService, type MfaService } from './services/mfa.service.js';
import { createOAuthService, type OAuthService } from './services/oauth.service.js';
import { createAvatarsService, type AvatarsService } from './services/avatars.service.js';
import { createTenantsService, type TenantsService } from './services/tenants.service.js';
import {
  createJwksService,
  createAdminRsaKeysService,
  type JwksService,
  type AdminRsaKeysService,
} from './services/jwks.service.js';
import { createOidcService, type OidcService } from './services/oidc.service.js';

/**
 * Configuration for the Authentication block
 */
export interface AuthenticationBlockConfig extends BlockConfig {
  /** API Key for authenticating with 23blocks services */
  apiKey: string;
  /** Tenant ID (optional, for multi-tenant setups) */
  tenantId?: string;
}

/**
 * Authentication block interface
 */
export interface AuthenticationBlock {
  /**
   * Authentication operations (signIn, signUp, signOut, etc.)
   */
  auth: AuthService;

  /**
   * User management operations
   */
  users: UsersService;

  /**
   * Role management
   */
  roles: RolesService;

  /**
   * Permission management
   */
  permissions: PermissionsService;

  /**
   * API key management
   */
  apiKeys: ApiKeysService;

  /**
   * Multi-factor authentication
   */
  mfa: MfaService;

  /**
   * OAuth and social login
   */
  oauth: OAuthService;

  /**
   * User avatar management
   */
  avatars: AvatarsService;

  /**
   * Tenant management
   */
  tenants: TenantsService;

  /**
   * Application management
   */
  apps: AppsService;

  /**
   * Block (feature) management for companies
   */
  blocks: BlocksService;

  /**
   * Service registry
   */
  services: ServicesRegistryService;

  /**
   * Subscription model definitions
   */
  subscriptionModels: SubscriptionModelsService;

  /**
   * User subscription management
   */
  userSubscriptions: UserSubscriptionsService;

  /**
   * Company subscription management
   */
  companySubscriptions: CompanySubscriptionsService;

  /**
   * Countries lookup
   */
  countries: CountriesService;

  /**
   * States/provinces lookup
   */
  states: StatesService;

  /**
   * Counties lookup
   */
  counties: CountiesService;

  /**
   * Cities lookup
   */
  cities: CitiesService;

  /**
   * Currencies lookup
   */
  currencies: CurrenciesService;

  /**
   * Guest (anonymous user) tracking
   */
  guests: GuestsService;

  /**
   * Magic link management
   */
  magicLinks: MagicLinksService;

  /**
   * Refresh token management
   */
  refreshTokens: RefreshTokensService;

  /**
   * User device management
   */
  userDevices: UserDevicesService;

  /**
   * Tenant user context
   */
  tenantUsers: TenantUsersService;

  /**
   * Mail template management
   */
  mailTemplates: MailTemplatesService;

  /**
   * JWKS (JSON Web Key Set) operations
   */
  jwks: JwksService;

  /**
   * Admin RSA key management
   */
  adminRsaKeys: AdminRsaKeysService;

  /**
   * OpenID Connect operations
   */
  oidc: OidcService;
}

/**
 * Create the Authentication block
 *
 * @example
 * ```typescript
 * import { createAuthenticationBlock } from '@23blocks/block-authentication';
 * import { createHttpTransport } from '@23blocks/transport-http';
 *
 * const transport = createHttpTransport({
 *   baseUrl: 'https://api.example.com',
 *   headers: () => ({
 *     'Authorization': `Bearer ${getToken()}`,
 *     'x-api-key': 'your-api-key',
 *   }),
 * });
 *
 * const auth = createAuthenticationBlock(transport, { apiKey: 'your-api-key' });
 *
 * // Sign in
 * const { user, accessToken } = await auth.auth.signIn({
 *   email: 'user@example.com',
 *   password: 'password',
 * });
 *
 * // List users
 * const users = await auth.users.list({ page: 1, perPage: 20 });
 *
 * // Get roles
 * const roles = await auth.roles.list();
 * ```
 */
export function createAuthenticationBlock(
  transport: Transport,
  config: AuthenticationBlockConfig
): AuthenticationBlock {
  return {
    auth: createAuthService(transport, config),
    users: createUsersService(transport, config),
    roles: createRolesService(transport, config),
    permissions: createPermissionsService(transport, config),
    apiKeys: createApiKeysService(transport, config),
    mfa: createMfaService(transport, config),
    oauth: createOAuthService(transport, config),
    avatars: createAvatarsService(transport, config),
    tenants: createTenantsService(transport, config),
    apps: createAppsService(transport, config),
    blocks: createBlocksService(transport, config),
    services: createServicesRegistryService(transport, config),
    subscriptionModels: createSubscriptionModelsService(transport, config),
    userSubscriptions: createUserSubscriptionsService(transport, config),
    companySubscriptions: createCompanySubscriptionsService(transport, config),
    countries: createCountriesService(transport, config),
    states: createStatesService(transport, config),
    counties: createCountiesService(transport, config),
    cities: createCitiesService(transport, config),
    currencies: createCurrenciesService(transport, config),
    guests: createGuestsService(transport, config),
    magicLinks: createMagicLinksService(transport, config),
    refreshTokens: createRefreshTokensService(transport, config),
    userDevices: createUserDevicesService(transport, config),
    tenantUsers: createTenantUsersService(transport, config),
    mailTemplates: createMailTemplatesService(transport, config),
    jwks: createJwksService(transport),
    adminRsaKeys: createAdminRsaKeysService(transport),
    oidc: createOidcService(transport),
  };
}

/**
 * Block metadata
 */
export const authenticationBlockMetadata = {
  name: 'authentication',
  version: '0.0.1',
  description: 'Authentication, users, roles, API keys, subscriptions, geography, and device management',
  resourceTypes: [
    'User', 'Role', 'Permission', 'UserAvatar', 'UserProfile',
    'Company', 'CompanyDetail', 'CompanyBlock', 'CompanyKey', 'Tenant',
    'ApiKey', 'App', 'Block', 'Service',
    'SubscriptionModel', 'UserSubscription', 'CompanySubscription',
    'Country', 'State', 'County', 'City', 'Currency',
    'Guest', 'MagicLink', 'RefreshToken', 'UserDevice', 'TenantUser', 'MailTemplate',
    'RsaKey', 'JsonWebKey',
  ],
};
