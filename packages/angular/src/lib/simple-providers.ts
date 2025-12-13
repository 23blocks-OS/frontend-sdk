import type { Provider, EnvironmentProviders } from '@angular/core';
import { InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { createHttpTransport } from '@23blocks/transport-http';
import type { Transport } from '@23blocks/contracts';
import {
  TRANSPORT,
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
 * Authentication mode for the simplified API
 */
export type AuthMode = 'token' | 'cookie';

/**
 * Storage type for token mode
 */
export type StorageType = 'localStorage' | 'sessionStorage' | 'memory';

/**
 * Simplified configuration for providing 23blocks services
 */
export interface Simple23BlocksConfig {
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
 * Injection token for the token manager (internal use)
 */
export const TOKEN_MANAGER = new InjectionToken<TokenManagerService>('23blocks.token-manager');

/**
 * Injection token for simple config
 */
export const SIMPLE_CONFIG = new InjectionToken<Simple23BlocksConfig>('23blocks.simple-config');

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
 * Generate storage key scoped to app and tenant
 */
function getStorageKey(type: 'access' | 'refresh', appId: string, tenantId?: string): string {
  const scope = tenantId ? `${appId}_${tenantId}` : appId;
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
  appId: string,
  storageType: StorageType,
  tenantId?: string
): TokenManagerService {
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

/**
 * Create transport with automatic token handling
 */
function createTransportWithAuth(config: Simple23BlocksConfig, tokenManager: TokenManagerService): Transport {
  return createHttpTransport({
    baseUrl: config.baseUrl,
    timeout: config.timeout,
    credentials: config.authMode === 'cookie' ? 'include' : undefined,
    headers: () => {
      const headers: Record<string, string> = {
        ...config.headers,
        appid: config.appId,
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
 * @example Token mode (default)
 * ```typescript
 * // app.config.ts
 * import { ApplicationConfig } from '@angular/core';
 * import { provideBlocks23 } from '@23blocks/angular';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideBlocks23({
 *       baseUrl: 'https://api.yourapp.com',
 *       appId: 'your-app-id',
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
 *       baseUrl: 'https://api.yourapp.com',
 *       appId: 'your-app-id',
 *       authMode: 'cookie',
 *     }),
 *   ],
 * };
 * ```
 */
export function provideBlocks23(config: Simple23BlocksConfig): EnvironmentProviders {
  // Block config for all services
  const blockConfig = { appId: config.appId, tenantId: config.tenantId };

  const providers: Provider[] = [
    // Store config for injection
    { provide: SIMPLE_CONFIG, useValue: config },

    // Token manager factory - creates singleton within the injector
    {
      provide: TOKEN_MANAGER,
      useFactory: () => {
        const storage = config.storage ?? 'localStorage';
        return createTokenManager(config.appId, storage, config.tenantId);
      },
    },

    // Transport factory - depends on token manager
    {
      provide: TRANSPORT,
      useFactory: (tokenManager: TokenManagerService) => {
        return createTransportWithAuth(config, tokenManager);
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
 * @example
 * ```typescript
 * // app.module.ts
 * import { NgModule } from '@angular/core';
 * import { getBlocks23Providers } from '@23blocks/angular';
 *
 * @NgModule({
 *   providers: [
 *     ...getBlocks23Providers({
 *       baseUrl: 'https://api.yourapp.com',
 *       appId: 'your-app-id',
 *     }),
 *   ],
 * })
 * export class AppModule {}
 * ```
 */
export function getBlocks23Providers(config: Simple23BlocksConfig): Provider[] {
  // Block config for all services
  const blockConfig = { appId: config.appId, tenantId: config.tenantId };

  return [
    // Store config for injection
    { provide: SIMPLE_CONFIG, useValue: config },

    // Token manager factory - creates singleton within the injector
    {
      provide: TOKEN_MANAGER,
      useFactory: () => {
        const storage = config.storage ?? 'localStorage';
        return createTokenManager(config.appId, storage, config.tenantId);
      },
    },

    // Transport factory - depends on token manager
    {
      provide: TRANSPORT,
      useFactory: (tokenManager: TokenManagerService) => {
        return createTransportWithAuth(config, tokenManager);
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
