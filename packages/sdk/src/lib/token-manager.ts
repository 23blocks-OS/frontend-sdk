/**
 * Token storage types
 */
export type StorageType = 'localStorage' | 'sessionStorage' | 'memory';

/**
 * Token manager configuration
 */
export interface TokenManagerConfig {
  /**
   * Application ID - used to scope token storage
   * This ensures multiple apps on the same domain don't conflict
   */
  appId: string;

  /**
   * Tenant ID (optional) - further scopes token storage for multi-tenant apps
   */
  tenantId?: string;

  /**
   * Storage type
   * @default 'localStorage'
   */
  storage?: StorageType;
}

/**
 * Token manager interface for storing and retrieving auth tokens
 */
export interface TokenManager {
  /**
   * Get the current access token
   */
  getAccessToken(): string | null;

  /**
   * Get the current refresh token
   */
  getRefreshToken(): string | null;

  /**
   * Store tokens
   */
  setTokens(accessToken: string, refreshToken?: string): void;

  /**
   * Clear all stored tokens
   */
  clearTokens(): void;

  /**
   * Subscribe to storage changes (for cross-tab sync)
   * Returns an unsubscribe function
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
 * In-memory token storage (for SSR or when localStorage is unavailable)
 */
class MemoryStorage {
  private data: Map<string, string> = new Map();

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
 * Detect if we're running in a browser environment
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/**
 * Get the appropriate storage backend
 */
function getStorage(type: StorageType): Storage | MemoryStorage {
  if (!isBrowser()) {
    // In SSR/Node, always use memory storage
    return new MemoryStorage();
  }

  switch (type) {
    case 'localStorage':
      return window.localStorage;
    case 'sessionStorage':
      return window.sessionStorage;
    case 'memory':
      return new MemoryStorage();
    default:
      return window.localStorage;
  }
}

/**
 * Create a token manager instance
 *
 * @param config - Token manager configuration including appId for scoped storage
 * @returns A TokenManager instance
 *
 * @example
 * ```typescript
 * const tokenManager = createTokenManager({
 *   appId: 'my-app',
 *   storage: 'localStorage',
 * });
 *
 * // Store tokens after sign in
 * tokenManager.setTokens('access_token_value', 'refresh_token_value');
 *
 * // Get token for API requests
 * const token = tokenManager.getAccessToken();
 *
 * // Clear on sign out
 * tokenManager.clearTokens();
 *
 * // Listen for cross-tab changes
 * const unsubscribe = tokenManager.onStorageChange(() => {
 *   console.log('Tokens changed in another tab');
 * });
 * ```
 */
export function createTokenManager(config: TokenManagerConfig): TokenManager {
  const { appId, tenantId, storage: storageType = 'localStorage' } = config;
  const storage = getStorage(storageType);

  const accessTokenKey = getStorageKey('access', appId, tenantId);
  const refreshTokenKey = getStorageKey('refresh', appId, tenantId);

  // Track storage event listeners for cleanup
  const listeners: Set<() => void> = new Set();

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
        // Storage might be full or disabled, silently fail
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
      if (!isBrowser() || storageType === 'memory') {
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
      listeners.add(callback);

      // Return unsubscribe function
      return () => {
        window.removeEventListener('storage', handler);
        listeners.delete(callback);
      };
    },
  };
}
