import type { Provider, EnvironmentProviders } from '@angular/core';
import { InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { createHttpTransport } from '@23blocks/transport-http';
import type { Transport } from '@23blocks/contracts';
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
} from './tokens.js';

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
}

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
        'api-key': config.apiKey,
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

  // Helper to create transport provider for a service URL
  const createTransportProvider = (
    token: InjectionToken<Transport | null>,
    url: string | undefined
  ): Provider => ({
    provide: token,
    useFactory: (tokenManager: TokenManagerService) => {
      if (!url) return null;
      return createTransportWithAuth(url, config, tokenManager);
    },
    deps: [TOKEN_MANAGER],
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

    // Per-service transport factories (null if URL not configured)
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

  // Helper to create transport provider for a service URL
  const createTransportProvider = (
    token: InjectionToken<Transport | null>,
    url: string | undefined
  ): Provider => ({
    provide: token,
    useFactory: (tokenManager: TokenManagerService) => {
      if (!url) return null;
      return createTransportWithAuth(url, config, tokenManager);
    },
    deps: [TOKEN_MANAGER],
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

    // Per-service transport factories (null if URL not configured)
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
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// Backward Compatibility Aliases (deprecated)
// ─────────────────────────────────────────────────────────────────────────────

/** @deprecated Use `ProviderConfig` instead */
export type Simple23BlocksConfig = ProviderConfig;
