import { createContext, useContext, useMemo, useCallback, useEffect, useState, useRef, type ReactNode } from 'react';
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
 * Async storage interface for React Native compatibility.
 * Compatible with @react-native-async-storage/async-storage and expo-secure-store.
 */
export interface AsyncStorageInterface {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

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
 * Provider props
 */
export interface ProviderProps {
  children: ReactNode;

  /**
   * Service URLs for each microservice.
   * Only configure the services you need - accessing a service without
   * a configured URL will throw an error.
   *
   * @example
   * ```tsx
   * <Provider
   *   apiKey="your-api-key"
   *   urls={{
   *     authentication: 'https://gateway.23blocks.com',
   *     crm: 'https://crm.23blocks.com',
   *     products: 'https://products.23blocks.com',
   *   }}
   * >
   *   <App />
   * </Provider>
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
   * Storage type for token mode (ignored if customStorage is provided)
   * @default 'localStorage'
   */
  storage?: StorageType;

  /**
   * Custom async storage for React Native.
   * When provided, this takes precedence over the `storage` prop.
   * Compatible with @react-native-async-storage/async-storage and expo-secure-store.
   *
   * @example React Native with AsyncStorage
   * ```tsx
   * import AsyncStorage from '@react-native-async-storage/async-storage';
   *
   * <Provider
   *   apiKey="your-api-key"
   *   customStorage={AsyncStorage}
   *   urls={{ authentication: 'https://api.example.com' }}
   * >
   *   <App />
   * </Provider>
   * ```
   *
   * @example React Native with Expo SecureStore
   * ```tsx
   * import * as SecureStore from 'expo-secure-store';
   *
   * const secureStorage = {
   *   getItem: SecureStore.getItemAsync,
   *   setItem: SecureStore.setItemAsync,
   *   removeItem: SecureStore.deleteItemAsync,
   * };
   *
   * <Provider
   *   apiKey="your-api-key"
   *   customStorage={secureStorage}
   *   urls={{ authentication: 'https://api.example.com' }}
   * >
   *   <App />
   * </Provider>
   * ```
   */
  customStorage?: AsyncStorageInterface;

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
 * Context value providing access to all 23blocks services
 */
export interface ClientContext {
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

  /**
   * Whether the provider has finished loading tokens from async storage.
   * Always true for sync storage (localStorage, sessionStorage, memory).
   * For React Native with customStorage, this is false until tokens are loaded.
   */
  isReady: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Token Manager Implementation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate storage key scoped to API key and tenant
 */
function getStorageKey(type: 'access' | 'refresh', apiKey: string, tenantId?: string): string {
  const scope = tenantId ? `${apiKey}_${tenantId}` : apiKey;
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

/**
 * Create a sync token manager for web (localStorage, sessionStorage, memory)
 */
function createSyncTokenManager(apiKey: string, storageType: StorageType, tenantId?: string): TokenManager {
  const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

  const accessTokenKey = getStorageKey('access', apiKey, tenantId);
  const refreshTokenKey = getStorageKey('refresh', apiKey, tenantId);

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

/**
 * Create an async token manager for React Native with a sync cache.
 * Uses a sync in-memory cache for immediate access while persisting to async storage.
 */
function createAsyncTokenManager(
  apiKey: string,
  asyncStorage: AsyncStorageInterface,
  tenantId?: string,
  onReady?: () => void
): TokenManager {
  const accessTokenKey = getStorageKey('access', apiKey, tenantId);
  const refreshTokenKey = getStorageKey('refresh', apiKey, tenantId);

  // In-memory cache for sync access
  let accessTokenCache: string | null = null;
  let refreshTokenCache: string | null = null;

  // Load tokens from async storage on initialization
  Promise.all([
    asyncStorage.getItem(accessTokenKey),
    asyncStorage.getItem(refreshTokenKey),
  ]).then(([accessToken, refreshToken]) => {
    accessTokenCache = accessToken;
    refreshTokenCache = refreshToken;
    onReady?.();
  }).catch((error) => {
    console.warn('[23blocks] Failed to load tokens from storage:', error);
    onReady?.();
  });

  return {
    getAccessToken(): string | null {
      return accessTokenCache;
    },
    getRefreshToken(): string | null {
      return refreshTokenCache;
    },
    setTokens(accessToken: string, refreshToken?: string): void {
      // Update cache immediately for sync access
      accessTokenCache = accessToken;
      if (refreshToken !== undefined) {
        refreshTokenCache = refreshToken;
      }

      // Persist to async storage (fire and forget with error logging)
      asyncStorage.setItem(accessTokenKey, accessToken).catch((error) => {
        console.warn('[23blocks] Failed to persist access token:', error);
      });

      if (refreshToken) {
        asyncStorage.setItem(refreshTokenKey, refreshToken).catch((error) => {
          console.warn('[23blocks] Failed to persist refresh token:', error);
        });
      }
    },
    clearTokens(): void {
      // Clear cache immediately
      accessTokenCache = null;
      refreshTokenCache = null;

      // Clear from async storage (fire and forget)
      asyncStorage.removeItem(accessTokenKey).catch(() => {});
      asyncStorage.removeItem(refreshTokenKey).catch(() => {});
    },
    onStorageChange(_callback: () => void): () => void {
      // Async storage doesn't support cross-tab events
      // For React Native, this is typically not needed anyway
      return () => {};
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const Blocks23Context = createContext<ClientContext | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// Provider Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Helper to create a proxy that throws when accessing unconfigured service
 */
function createUnconfiguredServiceProxy<T>(serviceName: string, urlKey: string): T {
  return new Proxy({} as T, {
    get(_target, prop) {
      throw new Error(
        `[23blocks] Cannot access '${serviceName}.${String(prop)}': ` +
        `The ${serviceName} service URL is not configured. ` +
        `Add 'urls.${urlKey}' to your Provider configuration.`
      );
    },
  });
}

/**
 * Provider component for 23blocks services.
 *
 * Wrap your app with this provider to access all 23blocks services
 * with automatic token management.
 *
 * Services are only available if their URL is configured. Accessing
 * a service without a configured URL will throw an error.
 *
 * @example Basic usage with multiple services
 * ```tsx
 * import { Provider } from '@23blocks/react';
 *
 * function App() {
 *   return (
 *     <Provider
 *       apiKey="your-api-key"
 *       urls={{
 *         authentication: 'https://gateway.23blocks.com',
 *         crm: 'https://crm.23blocks.com',
 *         products: 'https://products.23blocks.com',
 *       }}
 *     >
 *       <MyApp />
 *     </Provider>
 *   );
 * }
 * ```
 *
 * @example Cookie mode (recommended for security)
 * ```tsx
 * <Provider
 *   apiKey="your-api-key"
 *   authMode="cookie"
 *   urls={{
 *     authentication: 'https://gateway.23blocks.com',
 *     crm: 'https://crm.23blocks.com',
 *   }}
 * >
 *   <MyApp />
 * </Provider>
 * ```
 *
 * @example React Native with AsyncStorage
 * ```tsx
 * import AsyncStorage from '@react-native-async-storage/async-storage';
 *
 * <Provider
 *   apiKey="your-api-key"
 *   customStorage={AsyncStorage}
 *   urls={{
 *     authentication: 'https://gateway.23blocks.com',
 *   }}
 * >
 *   <App />
 * </Provider>
 * ```
 *
 * @example React Native with Expo SecureStore (recommended for sensitive data)
 * ```tsx
 * import * as SecureStore from 'expo-secure-store';
 *
 * const secureStorage = {
 *   getItem: SecureStore.getItemAsync,
 *   setItem: SecureStore.setItemAsync,
 *   removeItem: SecureStore.deleteItemAsync,
 * };
 *
 * <Provider
 *   apiKey="your-api-key"
 *   customStorage={secureStorage}
 *   urls={{
 *     authentication: 'https://gateway.23blocks.com',
 *   }}
 * >
 *   <App />
 * </Provider>
 * ```
 */
export function Provider({
  children,
  urls,
  apiKey,
  tenantId,
  authMode = 'token',
  storage = 'localStorage',
  customStorage,
  headers: staticHeaders = {},
  timeout,
}: ProviderProps) {
  // Track if async storage has loaded tokens
  const [isReady, setIsReady] = useState(!customStorage);
  const tokenManagerRef = useRef<TokenManager | null>(null);

  // Create token manager (memoized) with scoped storage keys
  const tokenManager = useMemo(() => {
    if (authMode !== 'token') {
      return null;
    }

    if (customStorage) {
      // Use async storage for React Native
      const manager = createAsyncTokenManager(apiKey, customStorage, tenantId, () => {
        setIsReady(true);
      });
      tokenManagerRef.current = manager;
      return manager;
    } else {
      // Use sync storage for web
      const manager = createSyncTokenManager(apiKey, storage, tenantId);
      tokenManagerRef.current = manager;
      return manager;
    }
  }, [authMode, apiKey, storage, tenantId, customStorage]);

  // Factory to create transport for a specific service URL
  const createServiceTransport = useCallback((baseUrl: string) => {
    return createHttpTransport({
      baseUrl,
      timeout,
      credentials: authMode === 'cookie' ? 'include' : undefined,
      headers: () => {
        const headers: Record<string, string> = {
          ...staticHeaders,
          'x-api-key': apiKey,
        };

        if (tenantId) {
          headers['tenant-id'] = tenantId;
        }

        if (authMode === 'token' && tokenManagerRef.current) {
          const token = tokenManagerRef.current.getAccessToken();
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }
        }

        return headers;
      },
    });
  }, [apiKey, tenantId, authMode, staticHeaders, timeout]);

  // Create blocks (memoized) - each with its own transport (no fallback)
  const blockConfig = useMemo(() => ({ apiKey, tenantId }), [apiKey, tenantId]);

  // Create blocks only if URL is configured, otherwise use proxy that throws helpful error
  const authentication = useMemo(() => {
    if (!urls.authentication) {
      return createUnconfiguredServiceProxy<AuthenticationBlock>('authentication', 'authentication');
    }
    return createAuthenticationBlock(createServiceTransport(urls.authentication), blockConfig);
  }, [createServiceTransport, urls.authentication, blockConfig]);

  const search = useMemo(() => {
    if (!urls.search) {
      return createUnconfiguredServiceProxy<SearchBlock>('search', 'search');
    }
    return createSearchBlock(createServiceTransport(urls.search), blockConfig);
  }, [createServiceTransport, urls.search, blockConfig]);

  const products = useMemo(() => {
    if (!urls.products) {
      return createUnconfiguredServiceProxy<ProductsBlock>('products', 'products');
    }
    return createProductsBlock(createServiceTransport(urls.products), blockConfig);
  }, [createServiceTransport, urls.products, blockConfig]);

  const crm = useMemo(() => {
    if (!urls.crm) {
      return createUnconfiguredServiceProxy<CrmBlock>('crm', 'crm');
    }
    return createCrmBlock(createServiceTransport(urls.crm), blockConfig);
  }, [createServiceTransport, urls.crm, blockConfig]);

  const content = useMemo(() => {
    if (!urls.content) {
      return createUnconfiguredServiceProxy<ContentBlock>('content', 'content');
    }
    return createContentBlock(createServiceTransport(urls.content), blockConfig);
  }, [createServiceTransport, urls.content, blockConfig]);

  const geolocation = useMemo(() => {
    if (!urls.geolocation) {
      return createUnconfiguredServiceProxy<GeolocationBlock>('geolocation', 'geolocation');
    }
    return createGeolocationBlock(createServiceTransport(urls.geolocation), blockConfig);
  }, [createServiceTransport, urls.geolocation, blockConfig]);

  const conversations = useMemo(() => {
    if (!urls.conversations) {
      return createUnconfiguredServiceProxy<ConversationsBlock>('conversations', 'conversations');
    }
    return createConversationsBlock(createServiceTransport(urls.conversations), blockConfig);
  }, [createServiceTransport, urls.conversations, blockConfig]);

  const files = useMemo(() => {
    if (!urls.files) {
      return createUnconfiguredServiceProxy<FilesBlock>('files', 'files');
    }
    return createFilesBlock(createServiceTransport(urls.files), blockConfig);
  }, [createServiceTransport, urls.files, blockConfig]);

  const forms = useMemo(() => {
    if (!urls.forms) {
      return createUnconfiguredServiceProxy<FormsBlock>('forms', 'forms');
    }
    return createFormsBlock(createServiceTransport(urls.forms), blockConfig);
  }, [createServiceTransport, urls.forms, blockConfig]);

  const assets = useMemo(() => {
    if (!urls.assets) {
      return createUnconfiguredServiceProxy<AssetsBlock>('assets', 'assets');
    }
    return createAssetsBlock(createServiceTransport(urls.assets), blockConfig);
  }, [createServiceTransport, urls.assets, blockConfig]);

  const campaigns = useMemo(() => {
    if (!urls.campaigns) {
      return createUnconfiguredServiceProxy<CampaignsBlock>('campaigns', 'campaigns');
    }
    return createCampaignsBlock(createServiceTransport(urls.campaigns), blockConfig);
  }, [createServiceTransport, urls.campaigns, blockConfig]);

  const company = useMemo(() => {
    if (!urls.company) {
      return createUnconfiguredServiceProxy<CompanyBlock>('company', 'company');
    }
    return createCompanyBlock(createServiceTransport(urls.company), blockConfig);
  }, [createServiceTransport, urls.company, blockConfig]);

  const rewards = useMemo(() => {
    if (!urls.rewards) {
      return createUnconfiguredServiceProxy<RewardsBlock>('rewards', 'rewards');
    }
    return createRewardsBlock(createServiceTransport(urls.rewards), blockConfig);
  }, [createServiceTransport, urls.rewards, blockConfig]);

  const sales = useMemo(() => {
    if (!urls.sales) {
      return createUnconfiguredServiceProxy<SalesBlock>('sales', 'sales');
    }
    return createSalesBlock(createServiceTransport(urls.sales), blockConfig);
  }, [createServiceTransport, urls.sales, blockConfig]);

  const wallet = useMemo(() => {
    if (!urls.wallet) {
      return createUnconfiguredServiceProxy<WalletBlock>('wallet', 'wallet');
    }
    return createWalletBlock(createServiceTransport(urls.wallet), blockConfig);
  }, [createServiceTransport, urls.wallet, blockConfig]);

  const jarvis = useMemo(() => {
    if (!urls.jarvis) {
      return createUnconfiguredServiceProxy<JarvisBlock>('jarvis', 'jarvis');
    }
    return createJarvisBlock(createServiceTransport(urls.jarvis), blockConfig);
  }, [createServiceTransport, urls.jarvis, blockConfig]);

  const onboarding = useMemo(() => {
    if (!urls.onboarding) {
      return createUnconfiguredServiceProxy<OnboardingBlock>('onboarding', 'onboarding');
    }
    return createOnboardingBlock(createServiceTransport(urls.onboarding), blockConfig);
  }, [createServiceTransport, urls.onboarding, blockConfig]);

  const university = useMemo(() => {
    if (!urls.university) {
      return createUnconfiguredServiceProxy<UniversityBlock>('university', 'university');
    }
    return createUniversityBlock(createServiceTransport(urls.university), blockConfig);
  }, [createServiceTransport, urls.university, blockConfig]);

  // Check if authentication is configured for auth methods
  const isAuthConfigured = !!urls.authentication;

  // Auth methods with automatic token management
  const signIn = useCallback(async (request: SignInRequest): Promise<SignInResponse> => {
    if (!isAuthConfigured) {
      throw new Error(
        '[23blocks] Cannot call signIn: The authentication service URL is not configured. ' +
        "Add 'urls.authentication' to your Provider configuration."
      );
    }
    const response = await (authentication as AuthenticationBlock).auth.signIn(request);
    if (authMode === 'token' && tokenManager && response.accessToken) {
      tokenManager.setTokens(response.accessToken, response.refreshToken);
    }
    return response;
  }, [authentication, authMode, tokenManager, isAuthConfigured]);

  const signUp = useCallback(async (request: SignUpRequest): Promise<SignUpResponse> => {
    if (!isAuthConfigured) {
      throw new Error(
        '[23blocks] Cannot call signUp: The authentication service URL is not configured. ' +
        "Add 'urls.authentication' to your Provider configuration."
      );
    }
    const response = await (authentication as AuthenticationBlock).auth.signUp(request);
    if (authMode === 'token' && tokenManager && response.accessToken) {
      tokenManager.setTokens(response.accessToken);
    }
    return response;
  }, [authentication, authMode, tokenManager, isAuthConfigured]);

  const signOut = useCallback(async (): Promise<void> => {
    if (!isAuthConfigured) {
      throw new Error(
        '[23blocks] Cannot call signOut: The authentication service URL is not configured. ' +
        "Add 'urls.authentication' to your Provider configuration."
      );
    }
    await (authentication as AuthenticationBlock).auth.signOut();
    if (authMode === 'token' && tokenManager) {
      tokenManager.clearTokens();
    }
  }, [authentication, authMode, tokenManager, isAuthConfigured]);

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

  const value = useMemo<ClientContext>(() => ({
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
    isReady,
  }), [
    authentication, search, products, crm, content, geolocation, conversations,
    files, forms, assets, campaigns, company, rewards, sales, wallet, jarvis,
    onboarding, university, signIn, signUp, signOut, getAccessToken, getRefreshToken,
    setTokens, clearTokens, isAuthenticated, onStorageChange, authMode, isReady,
  ]);

  return (
    <Blocks23Context.Provider value={value}>
      {children}
    </Blocks23Context.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hooks
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hook to access all 23blocks services.
 *
 * @example
 * ```tsx
 * function Dashboard() {
 *   const { products, crm, files } = useClient();
 *
 *   // Access any service
 *   const loadProducts = async () => {
 *     const { data } = await products.products.list({ limit: 10 });
 *   };
 * }
 * ```
 */
export function useClient(): ClientContext {
  const context = useContext(Blocks23Context);
  if (!context) {
    throw new Error('useClient must be used within a Provider');
  }
  return context;
}

/**
 * Hook for authentication operations with automatic token management.
 *
 * @example Basic login/logout
 * ```tsx
 * function LoginPage() {
 *   const { signIn, signOut, isAuthenticated } = useAuth();
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
 *
 * @example Validate email before registration
 * ```tsx
 * function SignUpForm() {
 *   const { validateEmail, signUp } = useAuth();
 *
 *   const checkEmail = async (email: string) => {
 *     const result = await validateEmail({ email });
 *     if (result.exists) {
 *       alert('Email already registered');
 *     } else if (!result.wellFormed) {
 *       alert('Invalid email format');
 *     }
 *   };
 * }
 * ```
 *
 * @example React Native - wait for tokens to load
 * ```tsx
 * function App() {
 *   const { isReady, isAuthenticated } = useAuth();
 *
 *   if (!isReady) {
 *     return <LoadingScreen />;
 *   }
 *
 *   return isAuthenticated() ? <HomeScreen /> : <LoginScreen />;
 * }
 * ```
 */
export function useAuth() {
  const context = useClient();
  const auth = context.authentication.auth;

  return {
    // Core auth with automatic token management
    signIn: context.signIn,
    signUp: context.signUp,
    signOut: context.signOut,

    // Token utilities
    getAccessToken: context.getAccessToken,
    getRefreshToken: context.getRefreshToken,
    setTokens: context.setTokens,
    clearTokens: context.clearTokens,
    isAuthenticated: context.isAuthenticated,
    onStorageChange: context.onStorageChange,
    isReady: context.isReady,

    // Password management
    requestPasswordReset: auth.requestPasswordReset.bind(auth),
    updatePassword: auth.updatePassword.bind(auth),

    // Token refresh
    refreshToken: auth.refreshToken.bind(auth),

    // Magic link (passwordless)
    requestMagicLink: auth.requestMagicLink.bind(auth),
    verifyMagicLink: auth.verifyMagicLink.bind(auth),

    // Invitations
    sendInvitation: auth.sendInvitation.bind(auth),
    acceptInvitation: auth.acceptInvitation.bind(auth),
    resendInvitation: auth.resendInvitation.bind(auth),

    // Email confirmation
    confirmEmail: auth.confirmEmail.bind(auth),
    resendConfirmation: auth.resendConfirmation.bind(auth),

    // Validation (pre-registration checks)
    validateEmail: auth.validateEmail.bind(auth),
    validateDocument: auth.validateDocument.bind(auth),

    // Account recovery
    requestAccountRecovery: auth.requestAccountRecovery.bind(auth),
    completeAccountRecovery: auth.completeAccountRecovery.bind(auth),

    // Token validation
    validateToken: auth.validateToken.bind(auth),
    getCurrentUser: auth.getCurrentUser.bind(auth),

    // Full block access for advanced usage
    authentication: context.authentication,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Backward Compatibility Aliases (deprecated)
// ─────────────────────────────────────────────────────────────────────────────

/** @deprecated Use `Provider` instead */
export const SimpleBlocks23Provider = Provider;

/** @deprecated Use `ProviderProps` instead */
export type SimpleBlocks23ProviderProps = ProviderProps;

/** @deprecated Use `ClientContext` instead */
export type SimpleBlocks23Context = ClientContext;

/** @deprecated Use `useClient` instead */
export const useSimpleBlocks23 = useClient;

/** @deprecated Use `useAuth` instead */
export const useSimpleAuth = useAuth;
