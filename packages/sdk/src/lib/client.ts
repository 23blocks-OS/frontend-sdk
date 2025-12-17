import { createHttpTransport } from '@23blocks/transport-http';
import {
  createAuthenticationBlock,
  type AuthenticationBlock,
  type SignInRequest,
  type SignInResponse,
  type SignUpRequest,
  type SignUpResponse,
  type MagicLinkVerifyRequest,
  type AcceptInvitationRequest,
} from '@23blocks/block-authentication';
import { createSearchBlock, type SearchBlock } from '@23blocks/block-search';
import { createProductsBlock, type ProductsBlock } from '@23blocks/block-products';
import { createCrmBlock, type CrmBlock } from '@23blocks/block-crm';
import { createContentBlock, type ContentBlock } from '@23blocks/block-content';
import { createGeolocationBlock, type GeolocationBlock } from '@23blocks/block-geolocation';
import { createConversationsBlock, type ConversationsBlock } from '@23blocks/block-conversations';
import { createFilesBlock, type FilesBlock } from '@23blocks/block-files';
import { createFormsBlock, type FormsBlock } from '@23blocks/block-forms';
import { createAssetsBlock, type AssetsBlock } from '@23blocks/block-assets';
import { createCampaignsBlock, type CampaignsBlock } from '@23blocks/block-campaigns';
import { createCompanyBlock, type CompanyBlock } from '@23blocks/block-company';
import { createRewardsBlock, type RewardsBlock } from '@23blocks/block-rewards';
import { createSalesBlock, type SalesBlock } from '@23blocks/block-sales';
import { createWalletBlock, type WalletBlock } from '@23blocks/block-wallet';
import { createJarvisBlock, type JarvisBlock } from '@23blocks/block-jarvis';
import { createOnboardingBlock, type OnboardingBlock } from '@23blocks/block-onboarding';
import { createUniversityBlock, type UniversityBlock } from '@23blocks/block-university';

import { createTokenManager, type StorageType, type TokenManager, type TokenManagerConfig } from './token-manager.js';

/**
 * Authentication mode
 * - 'token': Store tokens in browser storage, attach Authorization header
 * - 'cookie': Use httpOnly cookies set by backend (recommended for new projects)
 */
export type AuthMode = 'token' | 'cookie';

/**
 * Service URL configuration - each microservice has its own URL.
 * All URLs are optional - only configure the services you need.
 */
export interface ServiceUrls {
  /** Authentication service URL */
  authentication?: string;
  /** Search service URL */
  search?: string;
  /** Products service URL */
  products?: string;
  /** CRM service URL */
  crm?: string;
  /** Content service URL */
  content?: string;
  /** Geolocation service URL */
  geolocation?: string;
  /** Conversations service URL */
  conversations?: string;
  /** Files service URL */
  files?: string;
  /** Forms service URL */
  forms?: string;
  /** Assets service URL */
  assets?: string;
  /** Campaigns service URL */
  campaigns?: string;
  /** Company service URL */
  company?: string;
  /** Rewards service URL */
  rewards?: string;
  /** Sales service URL */
  sales?: string;
  /** Wallet service URL */
  wallet?: string;
  /** Jarvis (AI) service URL */
  jarvis?: string;
  /** Onboarding service URL */
  onboarding?: string;
  /** University (LMS) service URL */
  university?: string;
}

/**
 * Client configuration
 */
export interface ClientConfig {
  /**
   * Service URLs for each microservice.
   * Only configure the services you need - accessing a service without
   * a configured URL will throw an error.
   *
   * @example
   * ```typescript
   * urls: {
   *   authentication: 'https://gateway.23blocks.com',
   *   crm: 'https://crm.23blocks.com',
   *   products: 'https://products.23blocks.com',
   * }
   * ```
   */
  urls: ServiceUrls;

  /**
   * API Key for authenticating with 23blocks services
   */
  apiKey: string;

  /**
   * Tenant ID (optional, for multi-tenant setups)
   */
  tenantId?: string;

  /**
   * Authentication mode
   * - 'token' (default): SDK stores tokens in localStorage/sessionStorage/memory
   * - 'cookie': Backend manages auth via httpOnly cookies
   */
  authMode?: AuthMode;

  /**
   * Storage type for token mode
   * Only applicable when authMode is 'token'
   * @default 'localStorage' in browser, 'memory' in SSR
   */
  storage?: StorageType;

  /**
   * Additional headers to include with every request
   * Useful for SSR cookie forwarding
   */
  headers?: Record<string, string>;

  /**
   * Request timeout in milliseconds
   * @default 30000
   */
  timeout?: number;
}

/**
 * Auth service wrapper with automatic token management
 */
export interface ManagedAuthService extends Omit<AuthenticationBlock['auth'], 'signIn' | 'signUp' | 'signOut' | 'verifyMagicLink' | 'acceptInvitation'> {
  /**
   * Sign in and automatically store tokens (token mode) or let backend set cookies (cookie mode)
   */
  signIn(request: SignInRequest): Promise<SignInResponse>;

  /**
   * Sign up and optionally store tokens if returned
   */
  signUp(request: SignUpRequest): Promise<SignUpResponse>;

  /**
   * Sign out and clear stored tokens/session
   */
  signOut(): Promise<void>;

  /**
   * Verify magic link and store tokens
   */
  verifyMagicLink(request: MagicLinkVerifyRequest): Promise<SignInResponse>;

  /**
   * Accept invitation and store tokens
   */
  acceptInvitation(request: AcceptInvitationRequest): Promise<SignInResponse>;
}

/**
 * 23blocks client interface.
 *
 * Services are only available if their URL was configured.
 * Accessing a service without a configured URL will throw an error.
 */
export interface Blocks23Client {
  // ─────────────────────────────────────────────────────────────────────────────
  // Blocks (available only if URL configured)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Authentication operations with automatic token management.
   * Requires `urls.authentication` to be configured.
   */
  auth: ManagedAuthService;

  /**
   * User management operations.
   * Requires `urls.authentication` to be configured.
   */
  users: AuthenticationBlock['users'];

  /**
   * Role and permission management.
   * Requires `urls.authentication` to be configured.
   */
  roles: AuthenticationBlock['roles'];

  /**
   * API key management.
   * Requires `urls.authentication` to be configured.
   */
  apiKeys: AuthenticationBlock['apiKeys'];

  /**
   * Full authentication block (advanced access).
   * Requires `urls.authentication` to be configured.
   */
  authentication: AuthenticationBlock;

  /**
   * Search and favorites.
   * Requires `urls.search` to be configured.
   */
  search: SearchBlock;

  /**
   * Products, cart, and catalog.
   * Requires `urls.products` to be configured.
   */
  products: ProductsBlock;

  /**
   * CRM - contacts, organizations, deals.
   * Requires `urls.crm` to be configured.
   */
  crm: CrmBlock;

  /**
   * Content management.
   * Requires `urls.content` to be configured.
   */
  content: ContentBlock;

  /**
   * Geolocation - addresses, places.
   * Requires `urls.geolocation` to be configured.
   */
  geolocation: GeolocationBlock;

  /**
   * Messaging and conversations.
   * Requires `urls.conversations` to be configured.
   */
  conversations: ConversationsBlock;

  /**
   * File uploads and storage.
   * Requires `urls.files` to be configured.
   */
  files: FilesBlock;

  /**
   * Form builder and submissions.
   * Requires `urls.forms` to be configured.
   */
  forms: FormsBlock;

  /**
   * Asset management.
   * Requires `urls.assets` to be configured.
   */
  assets: AssetsBlock;

  /**
   * Marketing campaigns.
   * Requires `urls.campaigns` to be configured.
   */
  campaigns: CampaignsBlock;

  /**
   * Company settings.
   * Requires `urls.company` to be configured.
   */
  company: CompanyBlock;

  /**
   * Rewards and loyalty.
   * Requires `urls.rewards` to be configured.
   */
  rewards: RewardsBlock;

  /**
   * Sales, orders, invoices.
   * Requires `urls.sales` to be configured.
   */
  sales: SalesBlock;

  /**
   * Digital wallet.
   * Requires `urls.wallet` to be configured.
   */
  wallet: WalletBlock;

  /**
   * AI assistant.
   * Requires `urls.jarvis` to be configured.
   */
  jarvis: JarvisBlock;

  /**
   * User onboarding.
   * Requires `urls.onboarding` to be configured.
   */
  onboarding: OnboardingBlock;

  /**
   * Learning management.
   * Requires `urls.university` to be configured.
   */
  university: UniversityBlock;

  // ─────────────────────────────────────────────────────────────────────────────
  // Utilities
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get the current access token (token mode only)
   * Returns null if in cookie mode or no token stored
   */
  getAccessToken(): string | null;

  /**
   * Get the current refresh token (token mode only)
   * Returns null if in cookie mode or no token stored
   */
  getRefreshToken(): string | null;

  /**
   * Manually set tokens (token mode only)
   * Useful for SSR hydration
   */
  setTokens(accessToken: string, refreshToken?: string): void;

  /**
   * Clear the current session (tokens or signal backend to clear cookie)
   */
  clearSession(): void;

  /**
   * Check if user is likely authenticated
   * In token mode: checks if token exists
   * In cookie mode: always returns null (check with validateToken instead)
   */
  isAuthenticated(): boolean | null;
}

/**
 * Detect browser environment
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/**
 * Create a 23blocks client instance
 *
 * @param config - Client configuration
 * @returns A configured client with all blocks and automatic auth management
 *
 * @example Basic usage with multiple services
 * ```typescript
 * const client = create23BlocksClient({
 *   apiKey: 'your-api-key',
 *   urls: {
 *     authentication: 'https://gateway.23blocks.com',
 *     crm: 'https://crm.23blocks.com',
 *     products: 'https://products.23blocks.com',
 *   },
 * });
 *
 * // Sign in - tokens are stored automatically
 * await client.auth.signIn({ email: 'user@example.com', password: 'password' });
 *
 * // Each service uses its own URL
 * const products = await client.products.products.list();
 * const contacts = await client.crm.contacts.list();
 *
 * // Sign out - tokens are cleared automatically
 * await client.auth.signOut();
 * ```
 *
 * @example Cookie mode (recommended for security)
 * ```typescript
 * const client = create23BlocksClient({
 *   apiKey: 'your-api-key',
 *   authMode: 'cookie',
 *   urls: {
 *     authentication: 'https://gateway.23blocks.com',
 *     crm: 'https://crm.23blocks.com',
 *   },
 * });
 * ```
 *
 * @example SSR with token forwarding
 * ```typescript
 * const client = create23BlocksClient({
 *   apiKey: 'your-api-key',
 *   storage: 'memory',
 *   headers: { Authorization: `Bearer ${tokenFromRequest}` },
 *   urls: {
 *     authentication: 'https://gateway.23blocks.com',
 *     crm: 'https://crm.23blocks.com',
 *   },
 * });
 * ```
 */
export function create23BlocksClient(config: ClientConfig): Blocks23Client {
  const {
    urls,
    apiKey,
    tenantId,
    authMode = 'token',
    storage = isBrowser() ? 'localStorage' : 'memory',
    headers: staticHeaders = {},
    timeout,
  } = config;

  // Create token manager for token mode
  let tokenManager: TokenManager | null = null;
  if (authMode === 'token') {
    tokenManager = createTokenManager({
      apiKey,
      tenantId,
      storage,
    });
  }

  // Factory to create transport for a specific service URL
  function createServiceTransport(baseUrl: string) {
    return createHttpTransport({
      baseUrl,
      timeout,
      credentials: authMode === 'cookie' ? 'include' : undefined,
      headers: () => {
        const headers: Record<string, string> = {
          ...staticHeaders,
          'api-key': apiKey,
        };

        if (tenantId) {
          headers['tenant-id'] = tenantId;
        }

        // In token mode, add Authorization header if we have a token
        if (authMode === 'token' && tokenManager) {
          const token = tokenManager.getAccessToken();
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }
        }

        return headers;
      },
    });
  }

  // Helper to create a proxy that throws when accessing unconfigured service
  function createUnconfiguredServiceProxy<T>(serviceName: string, urlKey: string): T {
    return new Proxy({} as T, {
      get(_target, prop) {
        throw new Error(
          `[23blocks] Cannot access '${serviceName}.${String(prop)}': ` +
          `The ${serviceName} service URL is not configured. ` +
          `Add 'urls.${urlKey}' to your client configuration.`
        );
      },
    });
  }

  // Create block config
  const blockConfig = { apiKey, tenantId };

  // Create blocks only if their URL is provided
  const authenticationBlock = urls.authentication
    ? createAuthenticationBlock(createServiceTransport(urls.authentication), blockConfig)
    : null;

  const searchBlock = urls.search
    ? createSearchBlock(createServiceTransport(urls.search), blockConfig)
    : null;

  const productsBlock = urls.products
    ? createProductsBlock(createServiceTransport(urls.products), blockConfig)
    : null;

  const crmBlock = urls.crm
    ? createCrmBlock(createServiceTransport(urls.crm), blockConfig)
    : null;

  const contentBlock = urls.content
    ? createContentBlock(createServiceTransport(urls.content), blockConfig)
    : null;

  const geolocationBlock = urls.geolocation
    ? createGeolocationBlock(createServiceTransport(urls.geolocation), blockConfig)
    : null;

  const conversationsBlock = urls.conversations
    ? createConversationsBlock(createServiceTransport(urls.conversations), blockConfig)
    : null;

  const filesBlock = urls.files
    ? createFilesBlock(createServiceTransport(urls.files), blockConfig)
    : null;

  const formsBlock = urls.forms
    ? createFormsBlock(createServiceTransport(urls.forms), blockConfig)
    : null;

  const assetsBlock = urls.assets
    ? createAssetsBlock(createServiceTransport(urls.assets), blockConfig)
    : null;

  const campaignsBlock = urls.campaigns
    ? createCampaignsBlock(createServiceTransport(urls.campaigns), blockConfig)
    : null;

  const companyBlock = urls.company
    ? createCompanyBlock(createServiceTransport(urls.company), blockConfig)
    : null;

  const rewardsBlock = urls.rewards
    ? createRewardsBlock(createServiceTransport(urls.rewards), blockConfig)
    : null;

  const salesBlock = urls.sales
    ? createSalesBlock(createServiceTransport(urls.sales), blockConfig)
    : null;

  const walletBlock = urls.wallet
    ? createWalletBlock(createServiceTransport(urls.wallet), blockConfig)
    : null;

  const jarvisBlock = urls.jarvis
    ? createJarvisBlock(createServiceTransport(urls.jarvis), blockConfig)
    : null;

  const onboardingBlock = urls.onboarding
    ? createOnboardingBlock(createServiceTransport(urls.onboarding), blockConfig)
    : null;

  const universityBlock = urls.university
    ? createUniversityBlock(createServiceTransport(urls.university), blockConfig)
    : null;

  // Create managed auth service with automatic token handling (only if auth URL configured)
  const managedAuth: ManagedAuthService = authenticationBlock
    ? {
        async signIn(request: SignInRequest): Promise<SignInResponse> {
          const response = await authenticationBlock.auth.signIn(request);
          if (authMode === 'token' && tokenManager && response.accessToken) {
            tokenManager.setTokens(response.accessToken, response.refreshToken);
          }
          return response;
        },

        async signUp(request: SignUpRequest): Promise<SignUpResponse> {
          const response = await authenticationBlock.auth.signUp(request);
          if (authMode === 'token' && tokenManager && response.accessToken) {
            tokenManager.setTokens(response.accessToken);
          }
          return response;
        },

        async signOut(): Promise<void> {
          await authenticationBlock.auth.signOut();
          if (authMode === 'token' && tokenManager) {
            tokenManager.clearTokens();
          }
        },

        async verifyMagicLink(request: MagicLinkVerifyRequest): Promise<SignInResponse> {
          const response = await authenticationBlock.auth.verifyMagicLink(request);
          if (authMode === 'token' && tokenManager && response.accessToken) {
            tokenManager.setTokens(response.accessToken, response.refreshToken);
          }
          return response;
        },

        async acceptInvitation(request: AcceptInvitationRequest): Promise<SignInResponse> {
          const response = await authenticationBlock.auth.acceptInvitation(request);
          if (authMode === 'token' && tokenManager && response.accessToken) {
            tokenManager.setTokens(response.accessToken, response.refreshToken);
          }
          return response;
        },

        validateToken: authenticationBlock.auth.validateToken.bind(authenticationBlock.auth),
        getCurrentUser: authenticationBlock.auth.getCurrentUser.bind(authenticationBlock.auth),
        requestPasswordReset: authenticationBlock.auth.requestPasswordReset.bind(authenticationBlock.auth),
        updatePassword: authenticationBlock.auth.updatePassword.bind(authenticationBlock.auth),
        refreshToken: authenticationBlock.auth.refreshToken.bind(authenticationBlock.auth),
        requestMagicLink: authenticationBlock.auth.requestMagicLink.bind(authenticationBlock.auth),
        sendInvitation: authenticationBlock.auth.sendInvitation.bind(authenticationBlock.auth),
        confirmEmail: authenticationBlock.auth.confirmEmail.bind(authenticationBlock.auth),
        resendConfirmation: authenticationBlock.auth.resendConfirmation.bind(authenticationBlock.auth),
      }
    : createUnconfiguredServiceProxy<ManagedAuthService>('auth', 'authentication');

  return {
    // Authentication with managed tokens
    auth: managedAuth,
    users: authenticationBlock?.users ?? createUnconfiguredServiceProxy('users', 'authentication'),
    roles: authenticationBlock?.roles ?? createUnconfiguredServiceProxy('roles', 'authentication'),
    apiKeys: authenticationBlock?.apiKeys ?? createUnconfiguredServiceProxy('apiKeys', 'authentication'),
    authentication: authenticationBlock ?? createUnconfiguredServiceProxy('authentication', 'authentication'),

    // All blocks - use proxy if not configured
    search: searchBlock ?? createUnconfiguredServiceProxy('search', 'search'),
    products: productsBlock ?? createUnconfiguredServiceProxy('products', 'products'),
    crm: crmBlock ?? createUnconfiguredServiceProxy('crm', 'crm'),
    content: contentBlock ?? createUnconfiguredServiceProxy('content', 'content'),
    geolocation: geolocationBlock ?? createUnconfiguredServiceProxy('geolocation', 'geolocation'),
    conversations: conversationsBlock ?? createUnconfiguredServiceProxy('conversations', 'conversations'),
    files: filesBlock ?? createUnconfiguredServiceProxy('files', 'files'),
    forms: formsBlock ?? createUnconfiguredServiceProxy('forms', 'forms'),
    assets: assetsBlock ?? createUnconfiguredServiceProxy('assets', 'assets'),
    campaigns: campaignsBlock ?? createUnconfiguredServiceProxy('campaigns', 'campaigns'),
    company: companyBlock ?? createUnconfiguredServiceProxy('company', 'company'),
    rewards: rewardsBlock ?? createUnconfiguredServiceProxy('rewards', 'rewards'),
    sales: salesBlock ?? createUnconfiguredServiceProxy('sales', 'sales'),
    wallet: walletBlock ?? createUnconfiguredServiceProxy('wallet', 'wallet'),
    jarvis: jarvisBlock ?? createUnconfiguredServiceProxy('jarvis', 'jarvis'),
    onboarding: onboardingBlock ?? createUnconfiguredServiceProxy('onboarding', 'onboarding'),
    university: universityBlock ?? createUnconfiguredServiceProxy('university', 'university'),

    // Utilities
    getAccessToken(): string | null {
      if (authMode !== 'token' || !tokenManager) return null;
      return tokenManager.getAccessToken();
    },

    getRefreshToken(): string | null {
      if (authMode !== 'token' || !tokenManager) return null;
      return tokenManager.getRefreshToken();
    },

    setTokens(accessToken: string, refreshToken?: string): void {
      if (authMode === 'token' && tokenManager) {
        tokenManager.setTokens(accessToken, refreshToken);
      }
    },

    clearSession(): void {
      if (authMode === 'token' && tokenManager) {
        tokenManager.clearTokens();
      }
    },

    isAuthenticated(): boolean | null {
      if (authMode === 'cookie') {
        // Can't know without calling validateToken
        return null;
      }
      return tokenManager ? !!tokenManager.getAccessToken() : false;
    },
  };
}

// Re-export types
export type { StorageType, TokenManager } from './token-manager.js';
