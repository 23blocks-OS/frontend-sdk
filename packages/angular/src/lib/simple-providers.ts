import type { Provider, EnvironmentProviders } from '@angular/core';
import { InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { createHttpTransport } from '@23blocks/transport-http';
import type { Transport, RequestOptions } from '@23blocks/contracts';
import { BlockErrorException } from '@23blocks/contracts';
import { createAuthenticationBlock } from '@23blocks/block-authentication';
import {
  TRANSPORT,
  // Per-service transport tokens
  AUTHENTICATION_TRANSPORT,
  SEARCH_TRANSPORT,
  PRODUCTS_TRANSPORT,
  CRM_TRANSPORT,
  CONTENT_TRANSPORT,
  GEOLOCATION_TRANSPORT,
  CONVERSATIONS_TRANSPORT,
  FILES_TRANSPORT,
  FORMS_TRANSPORT,
  ASSETS_TRANSPORT,
  CAMPAIGNS_TRANSPORT,
  COMPANY_TRANSPORT,
  REWARDS_TRANSPORT,
  SALES_TRANSPORT,
  WALLET_TRANSPORT,
  JARVIS_TRANSPORT,
  ONBOARDING_TRANSPORT,
  UNIVERSITY_TRANSPORT,
  RAG_TRANSPORT,
  // Config tokens
  AUTHENTICATION_CONFIG,
  SEARCH_CONFIG,
  PRODUCTS_CONFIG,
  CRM_CONFIG,
  CONTENT_CONFIG,
  GEOLOCATION_CONFIG,
  CONVERSATIONS_CONFIG,
  FILES_CONFIG,
  FORMS_CONFIG,
  ASSETS_CONFIG,
  CAMPAIGNS_CONFIG,
  COMPANY_CONFIG,
  REWARDS_CONFIG,
  SALES_CONFIG,
  WALLET_CONFIG,
  JARVIS_CONFIG,
  ONBOARDING_CONFIG,
  UNIVERSITY_CONFIG,
  RAG_CONFIG,
} from './tokens';

/**
 * Authentication mode
 */
export type AuthMode = 'token' | 'cookie';

/**
 * Storage type for token mode
 */
export type StorageType = 'localStorage' | 'sessionStorage' | 'memory';

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
  /** RAG (Retrieval-Augmented Generation) service URL */
  rag?: string;
}

/**
 * Auth state change events
 */
export type AuthStateEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'SESSION_EXPIRED';

/**
 * Callback invoked when auth state changes
 */
export type AuthStateListener = (event: AuthStateEvent) => void;

/**
 * Configuration for automatic token lifecycle management
 */
export interface TokenLifecycleConfig {
  /** Seconds before token expiry to trigger a proactive refresh. @default 120 */
  refreshBufferSeconds?: number;
  /** Refresh token when tab becomes visible. @default true */
  enableVisibilityRefresh?: boolean;
  /** Schedule proactive refresh based on JWT `exp` claim. @default true */
  enableProactiveRefresh?: boolean;
}

/**
 * Token lifecycle manager interface
 */
export interface TokenLifecycleManagerService {
  start(): void;
  stop(): void;
  onAuthStateChanged(listener: AuthStateListener): () => void;
  refreshNow(): Promise<string>;
  destroy(): void;
}

/**
 * Injection token for the token lifecycle manager
 */
export const TOKEN_LIFECYCLE = new InjectionToken<TokenLifecycleManagerService | null>('23blocks.token-lifecycle');

/**
 * Configuration for providing 23blocks services
 */
export interface ProviderConfig {
  /**
   * Service URLs for each microservice.
   * Only configure the services you need - accessing a service without
   * a configured URL will throw an error.
   *
   * @example
   * ```typescript
   * provideBlocks23({
   *   apiKey: 'your-api-key',
   *   urls: {
   *     authentication: 'https://gateway.23blocks.com',
   *     crm: 'https://crm.23blocks.com',
   *     products: 'https://products.23blocks.com',
   *   },
   * })
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

  /**
   * Token lifecycle configuration for automatic refresh and 401 retry.
   * - Pass an object to customize (e.g., `{ refreshBufferSeconds: 60 }`)
   * - Pass `false` to disable entirely
   * - Omit or pass `{}` to use defaults (enabled with 120s buffer)
   *
   * Only applies in token mode. Ignored in cookie mode.
   * @default {} (enabled with defaults)
   */
  tokenLifecycle?: TokenLifecycleConfig | false;
}

/**
 * Injection token for the token manager (internal use)
 */
export const TOKEN_MANAGER = new InjectionToken<TokenManagerService>('23blocks.token-manager');

/**
 * Injection token for provider config
 */
export const PROVIDER_CONFIG = new InjectionToken<ProviderConfig>('23blocks.provider-config');

/** @deprecated Use PROVIDER_CONFIG instead */
export const SIMPLE_CONFIG = PROVIDER_CONFIG;

/**
 * Token manager interface
 */
export interface TokenManagerService {
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
 * Generate storage key scoped to API key and tenant
 */
function getStorageKey(type: 'access' | 'refresh', apiKey: string, tenantId?: string): string {
  const scope = tenantId ? `${apiKey}_${tenantId}` : apiKey;
  return `23blocks_${scope}_${type}_token`;
}

/**
 * In-memory storage for SSR
 */
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
 * Create a token manager with scoped storage keys and cross-tab sync
 */
function createTokenManager(
  apiKey: string,
  storageType: StorageType,
  tenantId?: string
): TokenManagerService {
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
 * Create transport with automatic token handling for a specific URL
 */
function createTransportWithAuth(
  baseUrl: string,
  config: ProviderConfig,
  tokenManager: TokenManagerService
): Transport {
  return createHttpTransport({
    baseUrl,
    timeout: config.timeout,
    credentials: config.authMode === 'cookie' ? 'include' : undefined,
    headers: () => {
      const headers: Record<string, string> = {
        ...config.headers,
        'x-api-key': config.apiKey,
      };

      if (config.tenantId) {
        headers['tenant-id'] = config.tenantId;
      }

      // In token mode, add Authorization header if we have a token
      if (config.authMode !== 'cookie') {
        const token = tokenManager.getAccessToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      return headers;
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Token Lifecycle Helpers
// ─────────────────────────────────────────────────────────────────────────────

function decodeJwtExp(token: string): number | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    let payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const pad = payload.length % 4;
    if (pad) payload += '='.repeat(4 - pad);
    let decoded: string;
    if (typeof atob === 'function') {
      decoded = atob(payload);
    } else if (typeof Buffer !== 'undefined') {
      decoded = Buffer.from(payload, 'base64').toString('utf-8');
    } else {
      return null;
    }
    const parsed = JSON.parse(decoded);
    return typeof parsed.exp === 'number' ? parsed.exp : null;
  } catch {
    return null;
  }
}

function isBrowserEnv(): boolean {
  try {
    return typeof window !== 'undefined'
      && typeof window.localStorage !== 'undefined'
      && typeof window.localStorage.getItem === 'function';
  } catch {
    return false;
  }
}

type RefreshTokenFn = (refreshToken: string) => Promise<{
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}>;

function createLifecycleManager(
  tokenManager: TokenManagerService,
  refreshFn: RefreshTokenFn,
  config: TokenLifecycleConfig = {}
): TokenLifecycleManagerService {
  const {
    refreshBufferSeconds = 120,
    enableVisibilityRefresh = true,
    enableProactiveRefresh = true,
  } = config;

  const listeners = new Set<AuthStateListener>();
  let refreshTimer: ReturnType<typeof setTimeout> | null = null;
  let refreshPromise: Promise<string> | null = null;
  let visibilityHandler: (() => void) | null = null;
  let destroyed = false;
  let running = false;

  function notify(event: AuthStateEvent): void {
    listeners.forEach((l) => { try { l(event); } catch {} });
  }

  function clearTimer(): void {
    if (refreshTimer !== null) { clearTimeout(refreshTimer); refreshTimer = null; }
  }

  function scheduleRefresh(): void {
    if (!enableProactiveRefresh || destroyed || !running) return;
    clearTimer();
    const accessToken = tokenManager.getAccessToken();
    if (!accessToken) return;
    const exp = decodeJwtExp(accessToken);
    if (!exp) return;
    const refreshInSeconds = (exp - Math.floor(Date.now() / 1000)) - refreshBufferSeconds;
    if (refreshInSeconds <= 0) {
      refreshNow().catch(() => {});
      return;
    }
    refreshTimer = setTimeout(() => {
      if (!destroyed && running) refreshNow().catch(() => {});
    }, refreshInSeconds * 1000);
  }

  function handleVisibilityChange(): void {
    if (destroyed || !running || typeof document === 'undefined') return;
    if (document.visibilityState === 'visible') {
      const accessToken = tokenManager.getAccessToken();
      if (!accessToken) return;
      const exp = decodeJwtExp(accessToken);
      if (!exp) { refreshNow().catch(() => {}); return; }
      const secondsUntilExpiry = exp - Math.floor(Date.now() / 1000);
      if (secondsUntilExpiry <= refreshBufferSeconds) {
        refreshNow().catch(() => {});
      } else {
        scheduleRefresh();
      }
    }
  }

  async function refreshNow(): Promise<string> {
    if (destroyed) throw new Error('[23blocks] Lifecycle destroyed');
    if (refreshPromise) return refreshPromise;
    refreshPromise = (async () => {
      try {
        const rt = tokenManager.getRefreshToken();
        if (!rt) throw new Error('No refresh token');
        const result = await refreshFn(rt);
        tokenManager.setTokens(result.accessToken, result.refreshToken);
        scheduleRefresh();
        notify('TOKEN_REFRESHED');
        return result.accessToken;
      } catch (error) {
        clearTimer();
        tokenManager.clearTokens();
        running = false;
        notify('SESSION_EXPIRED');
        throw error;
      } finally {
        refreshPromise = null;
      }
    })();
    return refreshPromise;
  }

  return {
    start() {
      if (destroyed) return;
      running = true;
      scheduleRefresh();
      if (enableVisibilityRefresh && isBrowserEnv() && !visibilityHandler && typeof document !== 'undefined') {
        visibilityHandler = handleVisibilityChange;
        document.addEventListener('visibilitychange', visibilityHandler);
      }
    },
    stop() {
      running = false;
      clearTimer();
      refreshPromise = null;
    },
    onAuthStateChanged(listener: AuthStateListener): () => void {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    refreshNow,
    destroy() {
      destroyed = true;
      running = false;
      clearTimer();
      refreshPromise = null;
      if (visibilityHandler && typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', visibilityHandler);
        visibilityHandler = null;
      }
      listeners.clear();
    },
  };
}

function createRetryTransport(
  baseTransport: Transport,
  getLifecycle: () => TokenLifecycleManagerService | null
): Transport {
  async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof BlockErrorException && error.status === 401) {
        const lc = getLifecycle();
        if (lc) {
          try { await lc.refreshNow(); return await fn(); } catch { throw error; }
        }
      }
      throw error;
    }
  }
  return {
    get<T>(path: string, options?: RequestOptions): Promise<T> {
      return withRetry(() => baseTransport.get<T>(path, options));
    },
    post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
      return withRetry(() => baseTransport.post<T>(path, body, options));
    },
    patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
      return withRetry(() => baseTransport.patch<T>(path, body, options));
    },
    put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
      return withRetry(() => baseTransport.put<T>(path, body, options));
    },
    delete<T>(path: string, options?: RequestOptions): Promise<T> {
      return withRetry(() => baseTransport.delete<T>(path, options));
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Providers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Provide 23blocks services with simplified configuration.
 *
 * This is the recommended way to set up 23blocks in new Angular applications.
 * It automatically handles token storage and authentication headers.
 *
 * Services are only available if their URL is configured. Accessing a service
 * without a configured URL will throw an error.
 *
 * @example Basic usage with multiple services
 * ```typescript
 * // app.config.ts
 * import { ApplicationConfig } from '@angular/core';
 * import { provideBlocks23 } from '@23blocks/angular';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideBlocks23({
 *       apiKey: 'your-api-key',
 *       urls: {
 *         authentication: 'https://gateway.23blocks.com',
 *         crm: 'https://crm.23blocks.com',
 *         products: 'https://products.23blocks.com',
 *       },
 *     }),
 *   ],
 * };
 * ```
 *
 * @example Cookie mode (recommended for security)
 * ```typescript
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideBlocks23({
 *       apiKey: 'your-api-key',
 *       authMode: 'cookie',
 *       urls: {
 *         authentication: 'https://gateway.23blocks.com',
 *         crm: 'https://crm.23blocks.com',
 *       },
 *     }),
 *   ],
 * };
 * ```
 */
export function provideBlocks23(config: ProviderConfig): EnvironmentProviders {
  // Block config for all services
  const blockConfig = { apiKey: config.apiKey, tenantId: config.tenantId };
  const lifecycleEnabled = config.authMode !== 'cookie' && config.tokenLifecycle !== false;

  // Helper to create transport provider for a service URL
  const createTransportProvider = (
    token: InjectionToken<Transport | null>,
    url: string | undefined
  ): Provider => ({
    provide: token,
    useFactory: (tokenManager: TokenManagerService, lifecycle: TokenLifecycleManagerService | null) => {
      if (!url) return null;
      const base = createTransportWithAuth(url, config, tokenManager);
      if (lifecycleEnabled && lifecycle) {
        return createRetryTransport(base, () => lifecycle);
      }
      return base;
    },
    deps: [TOKEN_MANAGER, TOKEN_LIFECYCLE],
  });

  const providers: Provider[] = [
    // Store config for injection
    { provide: PROVIDER_CONFIG, useValue: config },

    // Token manager factory - creates singleton within the injector
    {
      provide: TOKEN_MANAGER,
      useFactory: () => {
        const storage = config.storage ?? 'localStorage';
        return createTokenManager(config.apiKey, storage, config.tenantId);
      },
    },

    // Token lifecycle manager - uses a dedicated refresh transport (avoids circular retry)
    {
      provide: TOKEN_LIFECYCLE,
      useFactory: (tokenManager: TokenManagerService) => {
        if (!lifecycleEnabled || !config.urls.authentication) return null;

        // Dedicated transport for refresh calls — NOT wrapped with retry
        const refreshTransport = createTransportWithAuth(config.urls.authentication, config, tokenManager);

        const authBlock = createAuthenticationBlock(refreshTransport, blockConfig);

        const refreshFn: RefreshTokenFn = async (refreshToken: string) => {
          const response = await authBlock.auth.refreshToken({ refreshToken });
          return {
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            expiresIn: response.expiresIn,
          };
        };

        const lcConfig = typeof config.tokenLifecycle === 'object' ? config.tokenLifecycle : {};
        const lc = createLifecycleManager(tokenManager, refreshFn, lcConfig);

        // Auto-start if tokens exist (page reload)
        if (tokenManager.getAccessToken() && tokenManager.getRefreshToken()) {
          lc.start();
        }

        return lc;
      },
      deps: [TOKEN_MANAGER],
    },

    // Per-service transport factories (null if URL not configured, wrapped with retry if lifecycle enabled)
    createTransportProvider(AUTHENTICATION_TRANSPORT, config.urls.authentication),
    createTransportProvider(SEARCH_TRANSPORT, config.urls.search),
    createTransportProvider(PRODUCTS_TRANSPORT, config.urls.products),
    createTransportProvider(CRM_TRANSPORT, config.urls.crm),
    createTransportProvider(CONTENT_TRANSPORT, config.urls.content),
    createTransportProvider(GEOLOCATION_TRANSPORT, config.urls.geolocation),
    createTransportProvider(CONVERSATIONS_TRANSPORT, config.urls.conversations),
    createTransportProvider(FILES_TRANSPORT, config.urls.files),
    createTransportProvider(FORMS_TRANSPORT, config.urls.forms),
    createTransportProvider(ASSETS_TRANSPORT, config.urls.assets),
    createTransportProvider(CAMPAIGNS_TRANSPORT, config.urls.campaigns),
    createTransportProvider(COMPANY_TRANSPORT, config.urls.company),
    createTransportProvider(REWARDS_TRANSPORT, config.urls.rewards),
    createTransportProvider(SALES_TRANSPORT, config.urls.sales),
    createTransportProvider(WALLET_TRANSPORT, config.urls.wallet),
    createTransportProvider(JARVIS_TRANSPORT, config.urls.jarvis),
    createTransportProvider(ONBOARDING_TRANSPORT, config.urls.onboarding),
    createTransportProvider(UNIVERSITY_TRANSPORT, config.urls.university),
    createTransportProvider(RAG_TRANSPORT, config.urls.rag),

    // Backward compatibility: provide TRANSPORT token using auth URL if available
    // (for advanced API users who still inject TRANSPORT directly)
    {
      provide: TRANSPORT,
      useFactory: (tokenManager: TokenManagerService) => {
        // Use auth URL if available, otherwise create a dummy transport that throws
        const url = config.urls.authentication;
        if (url) {
          return createTransportWithAuth(url, config, tokenManager);
        }
        // Return a transport that throws helpful errors
        return {
          request: () => {
            throw new Error(
              '[23blocks] TRANSPORT is not configured. ' +
              'Use per-service transport tokens or configure urls.authentication.'
            );
          },
        };
      },
      deps: [TOKEN_MANAGER],
    },

    // Block configs
    { provide: AUTHENTICATION_CONFIG, useValue: blockConfig },
    { provide: SEARCH_CONFIG, useValue: blockConfig },
    { provide: PRODUCTS_CONFIG, useValue: blockConfig },
    { provide: CRM_CONFIG, useValue: blockConfig },
    { provide: CONTENT_CONFIG, useValue: blockConfig },
    { provide: GEOLOCATION_CONFIG, useValue: blockConfig },
    { provide: CONVERSATIONS_CONFIG, useValue: blockConfig },
    { provide: FILES_CONFIG, useValue: blockConfig },
    { provide: FORMS_CONFIG, useValue: blockConfig },
    { provide: ASSETS_CONFIG, useValue: blockConfig },
    { provide: CAMPAIGNS_CONFIG, useValue: blockConfig },
    { provide: COMPANY_CONFIG, useValue: blockConfig },
    { provide: REWARDS_CONFIG, useValue: blockConfig },
    { provide: SALES_CONFIG, useValue: blockConfig },
    { provide: WALLET_CONFIG, useValue: blockConfig },
    { provide: JARVIS_CONFIG, useValue: blockConfig },
    { provide: ONBOARDING_CONFIG, useValue: blockConfig },
    { provide: UNIVERSITY_CONFIG, useValue: blockConfig },
    { provide: RAG_CONFIG, useValue: blockConfig },
  ];

  return makeEnvironmentProviders(providers);
}

/**
 * Get providers array for NgModule-based applications with simplified config.
 *
 * Services are only available if their URL is configured. Accessing a service
 * without a configured URL will throw an error.
 *
 * @example
 * ```typescript
 * // app.module.ts
 * import { NgModule } from '@angular/core';
 * import { getBlocks23Providers } from '@23blocks/angular';
 *
 * @NgModule({
 *   providers: [
 *     ...getBlocks23Providers({
 *       apiKey: 'your-api-key',
 *       urls: {
 *         authentication: 'https://gateway.23blocks.com',
 *         crm: 'https://crm.23blocks.com',
 *       },
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 */
export function getBlocks23Providers(config: ProviderConfig): Provider[] {
  // Block config for all services
  const blockConfig = { apiKey: config.apiKey, tenantId: config.tenantId };
  const lifecycleEnabled = config.authMode !== 'cookie' && config.tokenLifecycle !== false;

  // Helper to create transport provider for a service URL
  const createTransportProvider = (
    token: InjectionToken<Transport | null>,
    url: string | undefined
  ): Provider => ({
    provide: token,
    useFactory: (tokenManager: TokenManagerService, lifecycle: TokenLifecycleManagerService | null) => {
      if (!url) return null;
      const base = createTransportWithAuth(url, config, tokenManager);
      if (lifecycleEnabled && lifecycle) {
        return createRetryTransport(base, () => lifecycle);
      }
      return base;
    },
    deps: [TOKEN_MANAGER, TOKEN_LIFECYCLE],
  });

  return [
    // Store config for injection
    { provide: PROVIDER_CONFIG, useValue: config },

    // Token manager factory - creates singleton within the injector
    {
      provide: TOKEN_MANAGER,
      useFactory: () => {
        const storage = config.storage ?? 'localStorage';
        return createTokenManager(config.apiKey, storage, config.tenantId);
      },
    },

    // Token lifecycle manager
    {
      provide: TOKEN_LIFECYCLE,
      useFactory: (tokenManager: TokenManagerService) => {
        if (!lifecycleEnabled || !config.urls.authentication) return null;
        const refreshTransport = createTransportWithAuth(config.urls.authentication, config, tokenManager);
        const authBlock = createAuthenticationBlock(refreshTransport, blockConfig);
        const refreshFn: RefreshTokenFn = async (refreshToken: string) => {
          const response = await authBlock.auth.refreshToken({ refreshToken });
          return { accessToken: response.accessToken, refreshToken: response.refreshToken, expiresIn: response.expiresIn };
        };
        const lcConfig = typeof config.tokenLifecycle === 'object' ? config.tokenLifecycle : {};
        const lc = createLifecycleManager(tokenManager, refreshFn, lcConfig);
        if (tokenManager.getAccessToken() && tokenManager.getRefreshToken()) {
          lc.start();
        }
        return lc;
      },
      deps: [TOKEN_MANAGER],
    },

    // Per-service transport factories (null if URL not configured, wrapped with retry if lifecycle enabled)
    createTransportProvider(AUTHENTICATION_TRANSPORT, config.urls.authentication),
    createTransportProvider(SEARCH_TRANSPORT, config.urls.search),
    createTransportProvider(PRODUCTS_TRANSPORT, config.urls.products),
    createTransportProvider(CRM_TRANSPORT, config.urls.crm),
    createTransportProvider(CONTENT_TRANSPORT, config.urls.content),
    createTransportProvider(GEOLOCATION_TRANSPORT, config.urls.geolocation),
    createTransportProvider(CONVERSATIONS_TRANSPORT, config.urls.conversations),
    createTransportProvider(FILES_TRANSPORT, config.urls.files),
    createTransportProvider(FORMS_TRANSPORT, config.urls.forms),
    createTransportProvider(ASSETS_TRANSPORT, config.urls.assets),
    createTransportProvider(CAMPAIGNS_TRANSPORT, config.urls.campaigns),
    createTransportProvider(COMPANY_TRANSPORT, config.urls.company),
    createTransportProvider(REWARDS_TRANSPORT, config.urls.rewards),
    createTransportProvider(SALES_TRANSPORT, config.urls.sales),
    createTransportProvider(WALLET_TRANSPORT, config.urls.wallet),
    createTransportProvider(JARVIS_TRANSPORT, config.urls.jarvis),
    createTransportProvider(ONBOARDING_TRANSPORT, config.urls.onboarding),
    createTransportProvider(UNIVERSITY_TRANSPORT, config.urls.university),
    createTransportProvider(RAG_TRANSPORT, config.urls.rag),

    // Backward compatibility: provide TRANSPORT token using auth URL if available
    {
      provide: TRANSPORT,
      useFactory: (tokenManager: TokenManagerService) => {
        const url = config.urls.authentication;
        if (url) {
          return createTransportWithAuth(url, config, tokenManager);
        }
        return {
          request: () => {
            throw new Error(
              '[23blocks] TRANSPORT is not configured. ' +
              'Use per-service transport tokens or configure urls.authentication.'
            );
          },
        };
      },
      deps: [TOKEN_MANAGER],
    },

    // Block configs
    { provide: AUTHENTICATION_CONFIG, useValue: blockConfig },
    { provide: SEARCH_CONFIG, useValue: blockConfig },
    { provide: PRODUCTS_CONFIG, useValue: blockConfig },
    { provide: CRM_CONFIG, useValue: blockConfig },
    { provide: CONTENT_CONFIG, useValue: blockConfig },
    { provide: GEOLOCATION_CONFIG, useValue: blockConfig },
    { provide: CONVERSATIONS_CONFIG, useValue: blockConfig },
    { provide: FILES_CONFIG, useValue: blockConfig },
    { provide: FORMS_CONFIG, useValue: blockConfig },
    { provide: ASSETS_CONFIG, useValue: blockConfig },
    { provide: CAMPAIGNS_CONFIG, useValue: blockConfig },
    { provide: COMPANY_CONFIG, useValue: blockConfig },
    { provide: REWARDS_CONFIG, useValue: blockConfig },
    { provide: SALES_CONFIG, useValue: blockConfig },
    { provide: WALLET_CONFIG, useValue: blockConfig },
    { provide: JARVIS_CONFIG, useValue: blockConfig },
    { provide: ONBOARDING_CONFIG, useValue: blockConfig },
    { provide: UNIVERSITY_CONFIG, useValue: blockConfig },
    { provide: RAG_CONFIG, useValue: blockConfig },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// Backward Compatibility Aliases (deprecated)
// ─────────────────────────────────────────────────────────────────────────────

/** @deprecated Use `ProviderConfig` instead */
export type Simple23BlocksConfig = ProviderConfig;
