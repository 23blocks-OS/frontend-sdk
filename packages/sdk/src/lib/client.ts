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
 * Client configuration
 */
export interface ClientConfig {
  /**
   * Base URL for the 23blocks API
   * @example 'https://api.yourapp.com'
   */
  baseUrl: string;

  /**
   * Application ID
   */
  appId: string;

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
 * 23blocks client interface
 */
export interface Blocks23Client {
  // ─────────────────────────────────────────────────────────────────────────────
  // Blocks
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Authentication operations with automatic token management
   */
  auth: ManagedAuthService;

  /**
   * User management operations
   */
  users: AuthenticationBlock['users'];

  /**
   * Role and permission management
   */
  roles: AuthenticationBlock['roles'];

  /**
   * API key management
   */
  apiKeys: AuthenticationBlock['apiKeys'];

  /**
   * Full authentication block (advanced access)
   */
  authentication: AuthenticationBlock;

  /**
   * Search and favorites
   */
  search: SearchBlock;

  /**
   * Products, cart, and catalog
   */
  products: ProductsBlock;

  /**
   * CRM - contacts, organizations, deals
   */
  crm: CrmBlock;

  /**
   * Content management
   */
  content: ContentBlock;

  /**
   * Geolocation - addresses, places
   */
  geolocation: GeolocationBlock;

  /**
   * Messaging and conversations
   */
  conversations: ConversationsBlock;

  /**
   * File uploads and storage
   */
  files: FilesBlock;

  /**
   * Form builder and submissions
   */
  forms: FormsBlock;

  /**
   * Asset management
   */
  assets: AssetsBlock;

  /**
   * Marketing campaigns
   */
  campaigns: CampaignsBlock;

  /**
   * Company settings
   */
  company: CompanyBlock;

  /**
   * Rewards and loyalty
   */
  rewards: RewardsBlock;

  /**
   * Sales, orders, invoices
   */
  sales: SalesBlock;

  /**
   * Digital wallet
   */
  wallet: WalletBlock;

  /**
   * AI assistant
   */
  jarvis: JarvisBlock;

  /**
   * User onboarding
   */
  onboarding: OnboardingBlock;

  /**
   * Learning management
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
 * @example Token mode (default)
 * ```typescript
 * const client = create23BlocksClient({
 *   baseUrl: 'https://api.yourapp.com',
 *   appId: 'your-app-id',
 * });
 *
 * // Sign in - tokens are stored automatically
 * await client.auth.signIn({ email: 'user@example.com', password: 'password' });
 *
 * // All subsequent requests include the token automatically
 * const products = await client.products.products.list();
 * const user = await client.auth.getCurrentUser();
 *
 * // Sign out - tokens are cleared automatically
 * await client.auth.signOut();
 * ```
 *
 * @example Cookie mode (recommended for new projects)
 * ```typescript
 * const client = create23BlocksClient({
 *   baseUrl: 'https://api.yourapp.com',
 *   appId: 'your-app-id',
 *   authMode: 'cookie',
 * });
 *
 * // Sign in - backend sets httpOnly cookie
 * await client.auth.signIn({ email: 'user@example.com', password: 'password' });
 *
 * // Requests automatically include cookies
 * const products = await client.products.products.list();
 * ```
 *
 * @example SSR with token forwarding
 * ```typescript
 * // On the server
 * const client = create23BlocksClient({
 *   baseUrl: 'https://api.yourapp.com',
 *   appId: 'your-app-id',
 *   storage: 'memory',
 *   headers: {
 *     Authorization: `Bearer ${tokenFromRequest}`,
 *   },
 * });
 * ```
 */
export function create23BlocksClient(config: ClientConfig): Blocks23Client {
  const {
    baseUrl,
    appId,
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
      appId,
      tenantId,
      storage,
    });
  }

  // Create transport with appropriate auth strategy
  const transport = createHttpTransport({
    baseUrl,
    timeout,
    credentials: authMode === 'cookie' ? 'include' : undefined,
    headers: () => {
      const headers: Record<string, string> = {
        ...staticHeaders,
        appid: appId,
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

  // Create all blocks
  const blockConfig = { appId, tenantId };

  const authenticationBlock = createAuthenticationBlock(transport, blockConfig);
  const searchBlock = createSearchBlock(transport, blockConfig);
  const productsBlock = createProductsBlock(transport, blockConfig);
  const crmBlock = createCrmBlock(transport, blockConfig);
  const contentBlock = createContentBlock(transport, blockConfig);
  const geolocationBlock = createGeolocationBlock(transport, blockConfig);
  const conversationsBlock = createConversationsBlock(transport, blockConfig);
  const filesBlock = createFilesBlock(transport, blockConfig);
  const formsBlock = createFormsBlock(transport, blockConfig);
  const assetsBlock = createAssetsBlock(transport, blockConfig);
  const campaignsBlock = createCampaignsBlock(transport, blockConfig);
  const companyBlock = createCompanyBlock(transport, blockConfig);
  const rewardsBlock = createRewardsBlock(transport, blockConfig);
  const salesBlock = createSalesBlock(transport, blockConfig);
  const walletBlock = createWalletBlock(transport, blockConfig);
  const jarvisBlock = createJarvisBlock(transport, blockConfig);
  const onboardingBlock = createOnboardingBlock(transport, blockConfig);
  const universityBlock = createUniversityBlock(transport, blockConfig);

  // Create managed auth service with automatic token handling
  const managedAuth: ManagedAuthService = {
    // Wrapped methods that handle tokens
    async signIn(request: SignInRequest): Promise<SignInResponse> {
      const response = await authenticationBlock.auth.signIn(request);

      // In token mode, store the tokens
      if (authMode === 'token' && tokenManager && response.accessToken) {
        tokenManager.setTokens(response.accessToken, response.refreshToken);
      }

      return response;
    },

    async signUp(request: SignUpRequest): Promise<SignUpResponse> {
      const response = await authenticationBlock.auth.signUp(request);

      // Store token if returned (some flows auto-confirm)
      if (authMode === 'token' && tokenManager && response.accessToken) {
        tokenManager.setTokens(response.accessToken);
      }

      return response;
    },

    async signOut(): Promise<void> {
      await authenticationBlock.auth.signOut();

      // Clear tokens in token mode
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

    // Pass-through methods
    validateToken: authenticationBlock.auth.validateToken.bind(authenticationBlock.auth),
    getCurrentUser: authenticationBlock.auth.getCurrentUser.bind(authenticationBlock.auth),
    requestPasswordReset: authenticationBlock.auth.requestPasswordReset.bind(authenticationBlock.auth),
    updatePassword: authenticationBlock.auth.updatePassword.bind(authenticationBlock.auth),
    refreshToken: authenticationBlock.auth.refreshToken.bind(authenticationBlock.auth),
    requestMagicLink: authenticationBlock.auth.requestMagicLink.bind(authenticationBlock.auth),
    sendInvitation: authenticationBlock.auth.sendInvitation.bind(authenticationBlock.auth),
    confirmEmail: authenticationBlock.auth.confirmEmail.bind(authenticationBlock.auth),
    resendConfirmation: authenticationBlock.auth.resendConfirmation.bind(authenticationBlock.auth),
  };

  return {
    // Authentication with managed tokens
    auth: managedAuth,
    users: authenticationBlock.users,
    roles: authenticationBlock.roles,
    apiKeys: authenticationBlock.apiKeys,
    authentication: authenticationBlock,

    // All other blocks
    search: searchBlock,
    products: productsBlock,
    crm: crmBlock,
    content: contentBlock,
    geolocation: geolocationBlock,
    conversations: conversationsBlock,
    files: filesBlock,
    forms: formsBlock,
    assets: assetsBlock,
    campaigns: campaignsBlock,
    company: companyBlock,
    rewards: rewardsBlock,
    sales: salesBlock,
    wallet: walletBlock,
    jarvis: jarvisBlock,
    onboarding: onboardingBlock,
    university: universityBlock,

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
