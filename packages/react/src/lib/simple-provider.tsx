import { createContext, useContext, useMemo, useCallback, type ReactNode } from 'react';
import { createHttpTransport } from '@23blocks/transport-http';
import type { Transport } from '@23blocks/contracts';
import { createAuthenticationBlock, type AuthenticationBlock, type SignInRequest, type SignInResponse, type SignUpRequest, type SignUpResponse } from '@23blocks/block-authentication';
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

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Authentication mode
 */
export type AuthMode = 'token' | 'cookie';

/**
 * Storage type for token mode
 */
export type StorageType = 'localStorage' | 'sessionStorage' | 'memory';

/**
 * Token manager interface
 */
export interface TokenManager {
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  setTokens(accessToken: string, refreshToken?: string): void;
  clearTokens(): void;
  /**
   * Subscribe to storage changes from other tabs/windows.
   * Returns an unsubscribe function.
   */
  onStorageChange(callback: () => void): () => void;
}

/**
 * Simplified provider props
 */
export interface SimpleBlocks23ProviderProps {
  children: ReactNode;

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
   * @default 'localStorage'
   */
  storage?: StorageType;

  /**
   * Additional headers to include with every request
   */
  headers?: Record<string, string>;

  /**
   * Request timeout in milliseconds
   * @default 30000
   */
  timeout?: number;
}

/**
 * Context value for simplified provider
 */
export interface SimpleBlocks23Context {
  // Blocks
  authentication: AuthenticationBlock;
  search: SearchBlock;
  products: ProductsBlock;
  crm: CrmBlock;
  content: ContentBlock;
  geolocation: GeolocationBlock;
  conversations: ConversationsBlock;
  files: FilesBlock;
  forms: FormsBlock;
  assets: AssetsBlock;
  campaigns: CampaignsBlock;
  company: CompanyBlock;
  rewards: RewardsBlock;
  sales: SalesBlock;
  wallet: WalletBlock;
  jarvis: JarvisBlock;
  onboarding: OnboardingBlock;
  university: UniversityBlock;

  // Auth with automatic token management
  signIn: (request: SignInRequest) => Promise<SignInResponse>;
  signUp: (request: SignUpRequest) => Promise<SignUpResponse>;
  signOut: () => Promise<void>;

  // Token utilities
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setTokens: (accessToken: string, refreshToken?: string) => void;
  clearTokens: () => void;
  isAuthenticated: () => boolean | null;
  /**
   * Subscribe to token changes from other tabs/windows.
   * Returns an unsubscribe function.
   */
  onStorageChange: (callback: () => void) => () => void;

  // Config info
  authMode: AuthMode;
}

// ─────────────────────────────────────────────────────────────────────────────
// Token Manager Implementation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate storage key scoped to app and tenant
 */
function getStorageKey(type: 'access' | 'refresh', appId: string, tenantId?: string): string {
  const scope = tenantId ? `${appId}_${tenantId}` : appId;
  return `23blocks_${scope}_${type}_token`;
}

class MemoryStorage {
  private data = new Map<string, string>();
  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
  removeItem(key: string): void {
    this.data.delete(key);
  }
}

function createTokenManager(appId: string, storageType: StorageType, tenantId?: string): TokenManager {
  const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

  const accessTokenKey = getStorageKey('access', appId, tenantId);
  const refreshTokenKey = getStorageKey('refresh', appId, tenantId);

  let storage: Storage | MemoryStorage;
  if (!isBrowser) {
    storage = new MemoryStorage();
  } else {
    switch (storageType) {
      case 'sessionStorage':
        storage = window.sessionStorage;
        break;
      case 'memory':
        storage = new MemoryStorage();
        break;
      default:
        storage = window.localStorage;
    }
  }

  return {
    getAccessToken(): string | null {
      try {
        return storage.getItem(accessTokenKey);
      } catch {
        return null;
      }
    },
    getRefreshToken(): string | null {
      try {
        return storage.getItem(refreshTokenKey);
      } catch {
        return null;
      }
    },
    setTokens(accessToken: string, refreshToken?: string): void {
      try {
        storage.setItem(accessTokenKey, accessToken);
        if (refreshToken) {
          storage.setItem(refreshTokenKey, refreshToken);
        }
      } catch {
        console.warn('[23blocks] Unable to store tokens');
      }
    },
    clearTokens(): void {
      try {
        storage.removeItem(accessTokenKey);
        storage.removeItem(refreshTokenKey);
      } catch {
        // Silently fail
      }
    },
    onStorageChange(callback: () => void): () => void {
      // Only works in browser with localStorage/sessionStorage
      if (!isBrowser || storageType === 'memory') {
        // Return no-op unsubscribe for SSR/memory storage
        return () => {};
      }

      const handler = (event: StorageEvent) => {
        // Only trigger if our keys changed
        if (event.key === accessTokenKey || event.key === refreshTokenKey) {
          callback();
        }
      };

      window.addEventListener('storage', handler);

      // Return unsubscribe function
      return () => {
        window.removeEventListener('storage', handler);
      };
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const SimpleBlocks23ContextInternal = createContext<SimpleBlocks23Context | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// Provider Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Simplified provider component for 23blocks services.
 *
 * This is the recommended way to set up 23blocks in new React applications.
 * It automatically handles token storage and authentication headers.
 *
 * @example Token mode (default)
 * ```tsx
 * import { SimpleBlocks23Provider } from '@23blocks/react';
 *
 * function App() {
 *   return (
 *     <SimpleBlocks23Provider
 *       baseUrl="https://api.yourapp.com"
 *       appId="your-app-id"
 *     >
 *       <MyApp />
 *     </SimpleBlocks23Provider>
 *   );
 * }
 * ```
 *
 * @example Cookie mode (recommended for security)
 * ```tsx
 * <SimpleBlocks23Provider
 *   baseUrl="https://api.yourapp.com"
 *   appId="your-app-id"
 *   authMode="cookie"
 * >
 *   <MyApp />
 * </SimpleBlocks23Provider>
 * ```
 */
export function SimpleBlocks23Provider({
  children,
  baseUrl,
  appId,
  tenantId,
  authMode = 'token',
  storage = 'localStorage',
  headers: staticHeaders = {},
  timeout,
}: SimpleBlocks23ProviderProps) {
  // Create token manager (memoized) with scoped storage keys
  const tokenManager = useMemo(
    () => (authMode === 'token' ? createTokenManager(appId, storage, tenantId) : null),
    [authMode, appId, storage, tenantId]
  );

  // Create transport (memoized)
  const transport = useMemo(() => {
    return createHttpTransport({
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

        if (authMode === 'token' && tokenManager) {
          const token = tokenManager.getAccessToken();
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }
        }

        return headers;
      },
    });
  }, [baseUrl, appId, tenantId, authMode, storage, staticHeaders, timeout, tokenManager]);

  // Create blocks (memoized)
  const blockConfig = useMemo(() => ({ appId, tenantId }), [appId, tenantId]);

  const authentication = useMemo(() => createAuthenticationBlock(transport, blockConfig), [transport, blockConfig]);
  const search = useMemo(() => createSearchBlock(transport, blockConfig), [transport, blockConfig]);
  const products = useMemo(() => createProductsBlock(transport, blockConfig), [transport, blockConfig]);
  const crm = useMemo(() => createCrmBlock(transport, blockConfig), [transport, blockConfig]);
  const content = useMemo(() => createContentBlock(transport, blockConfig), [transport, blockConfig]);
  const geolocation = useMemo(() => createGeolocationBlock(transport, blockConfig), [transport, blockConfig]);
  const conversations = useMemo(() => createConversationsBlock(transport, blockConfig), [transport, blockConfig]);
  const files = useMemo(() => createFilesBlock(transport, blockConfig), [transport, blockConfig]);
  const forms = useMemo(() => createFormsBlock(transport, blockConfig), [transport, blockConfig]);
  const assets = useMemo(() => createAssetsBlock(transport, blockConfig), [transport, blockConfig]);
  const campaigns = useMemo(() => createCampaignsBlock(transport, blockConfig), [transport, blockConfig]);
  const company = useMemo(() => createCompanyBlock(transport, blockConfig), [transport, blockConfig]);
  const rewards = useMemo(() => createRewardsBlock(transport, blockConfig), [transport, blockConfig]);
  const sales = useMemo(() => createSalesBlock(transport, blockConfig), [transport, blockConfig]);
  const wallet = useMemo(() => createWalletBlock(transport, blockConfig), [transport, blockConfig]);
  const jarvis = useMemo(() => createJarvisBlock(transport, blockConfig), [transport, blockConfig]);
  const onboarding = useMemo(() => createOnboardingBlock(transport, blockConfig), [transport, blockConfig]);
  const university = useMemo(() => createUniversityBlock(transport, blockConfig), [transport, blockConfig]);

  // Auth methods with automatic token management
  const signIn = useCallback(async (request: SignInRequest): Promise<SignInResponse> => {
    const response = await authentication.auth.signIn(request);
    if (authMode === 'token' && tokenManager && response.accessToken) {
      tokenManager.setTokens(response.accessToken, response.refreshToken);
    }
    return response;
  }, [authentication, authMode, tokenManager]);

  const signUp = useCallback(async (request: SignUpRequest): Promise<SignUpResponse> => {
    const response = await authentication.auth.signUp(request);
    if (authMode === 'token' && tokenManager && response.accessToken) {
      tokenManager.setTokens(response.accessToken);
    }
    return response;
  }, [authentication, authMode, tokenManager]);

  const signOut = useCallback(async (): Promise<void> => {
    await authentication.auth.signOut();
    if (authMode === 'token' && tokenManager) {
      tokenManager.clearTokens();
    }
  }, [authentication, authMode, tokenManager]);

  // Token utilities
  const getAccessToken = useCallback(() => tokenManager?.getAccessToken() ?? null, [tokenManager]);
  const getRefreshToken = useCallback(() => tokenManager?.getRefreshToken() ?? null, [tokenManager]);
  const setTokens = useCallback((accessToken: string, refreshToken?: string) => {
    tokenManager?.setTokens(accessToken, refreshToken);
  }, [tokenManager]);
  const clearTokens = useCallback(() => tokenManager?.clearTokens(), [tokenManager]);
  const isAuthenticated = useCallback((): boolean | null => {
    if (authMode === 'cookie') return null;
    return tokenManager ? !!tokenManager.getAccessToken() : false;
  }, [authMode, tokenManager]);
  const onStorageChange = useCallback((callback: () => void): (() => void) => {
    return tokenManager?.onStorageChange(callback) ?? (() => {});
  }, [tokenManager]);

  const value = useMemo<SimpleBlocks23Context>(() => ({
    // Blocks
    authentication,
    search,
    products,
    crm,
    content,
    geolocation,
    conversations,
    files,
    forms,
    assets,
    campaigns,
    company,
    rewards,
    sales,
    wallet,
    jarvis,
    onboarding,
    university,

    // Auth with token management
    signIn,
    signUp,
    signOut,

    // Token utilities
    getAccessToken,
    getRefreshToken,
    setTokens,
    clearTokens,
    isAuthenticated,
    onStorageChange,

    // Config
    authMode,
  }), [
    authentication, search, products, crm, content, geolocation, conversations,
    files, forms, assets, campaigns, company, rewards, sales, wallet, jarvis,
    onboarding, university, signIn, signUp, signOut, getAccessToken, getRefreshToken,
    setTokens, clearTokens, isAuthenticated, onStorageChange, authMode,
  ]);

  return (
    <SimpleBlocks23ContextInternal.Provider value={value}>
      {children}
    </SimpleBlocks23ContextInternal.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hooks
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hook to access the 23blocks context with simplified API.
 *
 * @example
 * ```tsx
 * function LoginButton() {
 *   const { signIn, isAuthenticated, authentication } = useSimpleBlocks23();
 *
 *   const handleLogin = async () => {
 *     const result = await signIn({ email: 'user@example.com', password: 'password' });
 *     console.log('Logged in:', result.user);
 *   };
 *
 *   return (
 *     <button onClick={handleLogin}>
 *       {isAuthenticated() ? 'Logged In' : 'Log In'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useSimpleBlocks23(): SimpleBlocks23Context {
  const context = useContext(SimpleBlocks23ContextInternal);
  if (!context) {
    throw new Error('useSimpleBlocks23 must be used within a SimpleBlocks23Provider');
  }
  return context;
}

/**
 * Hook for authentication operations with automatic token management.
 *
 * @example
 * ```tsx
 * function AuthComponent() {
 *   const { signIn, signOut, isAuthenticated, authentication } = useSimpleAuth();
 *
 *   const handleLogin = async () => {
 *     await signIn({ email: 'user@example.com', password: 'password' });
 *   };
 *
 *   return (
 *     <div>
 *       {isAuthenticated() ? (
 *         <button onClick={signOut}>Sign Out</button>
 *       ) : (
 *         <button onClick={handleLogin}>Sign In</button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useSimpleAuth() {
  const context = useSimpleBlocks23();
  return {
    signIn: context.signIn,
    signUp: context.signUp,
    signOut: context.signOut,
    getAccessToken: context.getAccessToken,
    getRefreshToken: context.getRefreshToken,
    setTokens: context.setTokens,
    clearTokens: context.clearTokens,
    isAuthenticated: context.isAuthenticated,
    onStorageChange: context.onStorageChange,
    authentication: context.authentication,
  };
}
