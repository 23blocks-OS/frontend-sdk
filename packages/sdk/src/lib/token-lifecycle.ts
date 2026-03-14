import type { Transport, RequestOptions } from '@23blocks/contracts';
import { BlockErrorException } from '@23blocks/contracts';
import type { TokenManager } from './token-manager.js';
import { isBrowser } from './token-manager.js';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Auth state change events emitted by the lifecycle manager.
 *
 * - `SIGNED_IN` — User signed in and lifecycle started
 * - `SIGNED_OUT` — User signed out and lifecycle stopped
 * - `TOKEN_REFRESHED` — Access token was silently refreshed
 * - `SESSION_EXPIRED` — Refresh failed, tokens cleared, user must re-authenticate
 */
export type AuthStateEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'SESSION_EXPIRED';

/**
 * Callback invoked when auth state changes
 */
export type AuthStateListener = (event: AuthStateEvent) => void;

/**
 * Function that performs the actual token refresh against the backend.
 * Accepts the current refresh token and returns new credentials.
 */
export type RefreshTokenFn = (refreshToken: string) => Promise<{
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}>;

/**
 * Configuration for automatic token lifecycle management
 */
export interface TokenLifecycleConfig {
  /**
   * Seconds before token expiry to trigger a proactive refresh.
   * @default 120
   */
  refreshBufferSeconds?: number;

  /**
   * Refresh token when tab becomes visible (handles laptop sleep/wake).
   * @default true
   */
  enableVisibilityRefresh?: boolean;

  /**
   * Schedule proactive refresh based on JWT `exp` claim.
   * @default true
   */
  enableProactiveRefresh?: boolean;
}

/**
 * Token lifecycle manager interface.
 * Manages automatic token refresh, tab visibility sync, and auth state notifications.
 */
export interface TokenLifecycleManager {
  /**
   * Start the lifecycle — schedule proactive refresh and register visibility listener.
   * Call after successful sign-in.
   */
  start(): void;

  /**
   * Stop the lifecycle — clear timers and listeners but keep the manager reusable.
   * Call on sign-out.
   */
  stop(): void;

  /**
   * Subscribe to auth state changes.
   * Returns an unsubscribe function.
   */
  onAuthStateChanged(listener: AuthStateListener): () => void;

  /**
   * Force an immediate token refresh.
   * Multiple concurrent calls share the same in-flight promise (concurrency lock).
   * Returns the new access token on success.
   */
  refreshNow(): Promise<string>;

  /**
   * Permanently destroy the manager — clears everything and prevents reuse.
   */
  destroy(): void;
}

// ─────────────────────────────────────────────────────────────────────────────
// JWT Decode Utility
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Decode the `exp` claim from a JWT without external dependencies.
 * Returns the expiry as a Unix timestamp (seconds), or null if unavailable.
 */
function decodeJwtExp(token: string): number | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Base64url → Base64
    let payload = parts[1];
    payload = payload.replace(/-/g, '+').replace(/_/g, '/');

    // Pad to multiple of 4
    const pad = payload.length % 4;
    if (pad) {
      payload += '='.repeat(4 - pad);
    }

    // Decode — works in browser (atob) and Node 16+ (Buffer)
    let decoded: string;
    if (typeof atob === 'function') {
      decoded = atob(payload);
    } else if (typeof Buffer !== 'undefined') {
      decoded = Buffer.from(payload, 'base64').toString('utf-8');
    } else {
      return null;
    }

    const parsed = JSON.parse(decoded);
    if (typeof parsed.exp === 'number') {
      return parsed.exp;
    }
    return null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Lifecycle Manager Factory
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Create a token lifecycle manager that automatically refreshes tokens,
 * handles tab visibility, and notifies listeners of auth state changes.
 *
 * @param tokenManager - Token storage (read/write tokens)
 * @param refreshFn - Function to call the backend refresh endpoint
 * @param config - Lifecycle configuration
 */
export function createTokenLifecycleManager(
  tokenManager: TokenManager,
  refreshFn: RefreshTokenFn,
  config: TokenLifecycleConfig = {}
): TokenLifecycleManager {
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
    listeners.forEach((listener) => {
      try {
        listener(event);
      } catch {
        // Listener errors should not break the lifecycle
      }
    });
  }

  function clearTimer(): void {
    if (refreshTimer !== null) {
      clearTimeout(refreshTimer);
      refreshTimer = null;
    }
  }

  function scheduleRefresh(): void {
    if (!enableProactiveRefresh || destroyed || !running) return;

    clearTimer();

    const accessToken = tokenManager.getAccessToken();
    if (!accessToken) return;

    const exp = decodeJwtExp(accessToken);
    if (!exp) return;

    const nowSeconds = Math.floor(Date.now() / 1000);
    const secondsUntilExpiry = exp - nowSeconds;
    const refreshInSeconds = secondsUntilExpiry - refreshBufferSeconds;

    if (refreshInSeconds <= 0) {
      // Token is already expired or within buffer — refresh immediately
      refreshNow().catch(() => {
        // Error handled inside refreshNow
      });
      return;
    }

    refreshTimer = setTimeout(() => {
      if (!destroyed && running) {
        refreshNow().catch(() => {
          // Error handled inside refreshNow
        });
      }
    }, refreshInSeconds * 1000);
  }

  function handleVisibilityChange(): void {
    if (destroyed || !running) return;
    if (typeof document === 'undefined') return;

    if (document.visibilityState === 'visible') {
      const accessToken = tokenManager.getAccessToken();
      if (!accessToken) return;

      const exp = decodeJwtExp(accessToken);
      if (!exp) {
        // No exp claim — refresh to be safe
        refreshNow().catch(() => {});
        return;
      }

      const nowSeconds = Math.floor(Date.now() / 1000);
      const secondsUntilExpiry = exp - nowSeconds;

      // Refresh if expired or within buffer
      if (secondsUntilExpiry <= refreshBufferSeconds) {
        refreshNow().catch(() => {});
      } else {
        // Reschedule proactive refresh (timer may have drifted during sleep)
        scheduleRefresh();
      }
    }
  }

  function registerVisibilityListener(): void {
    if (!enableVisibilityRefresh || !isBrowser() || visibilityHandler) return;

    if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
      visibilityHandler = handleVisibilityChange;
      document.addEventListener('visibilitychange', visibilityHandler);
    }
  }

  function removeVisibilityListener(): void {
    if (visibilityHandler && typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', visibilityHandler);
      visibilityHandler = null;
    }
  }

  async function refreshNow(): Promise<string> {
    if (destroyed) {
      throw new Error('[23blocks] Token lifecycle manager has been destroyed');
    }

    // Concurrency lock — all callers share the same in-flight promise
    if (refreshPromise) {
      return refreshPromise;
    }

    refreshPromise = (async () => {
      try {
        const refreshToken = tokenManager.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const result = await refreshFn(refreshToken);

        // Guard: don't store tokens if lifecycle was stopped/destroyed during the async call
        if (!running || destroyed) {
          return result.accessToken;
        }

        // Store new tokens
        tokenManager.setTokens(result.accessToken, result.refreshToken);

        // Reschedule proactive refresh
        scheduleRefresh();

        notify('TOKEN_REFRESHED');
        return result.accessToken;
      } catch (error) {
        // Refresh failed — session is dead
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

  function start(): void {
    if (destroyed) return;
    running = true;
    scheduleRefresh();
    registerVisibilityListener();
    notify('SIGNED_IN');
  }

  function stop(): void {
    running = false;
    clearTimer();
    refreshPromise = null;
    notify('SIGNED_OUT');
  }

  function destroy(): void {
    destroyed = true;
    stop();
    removeVisibilityListener();
    listeners.clear();
  }

  function onAuthStateChanged(listener: AuthStateListener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }

  return {
    start,
    stop,
    onAuthStateChanged,
    refreshNow,
    destroy,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Retrying Transport Wrapper
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Wrap a transport with automatic 401 retry via token refresh.
 *
 * On a 401 BlockErrorException, the wrapper calls `getLifecycle().refreshNow()`
 * to obtain a fresh token, then retries the request once.
 *
 * @param baseTransport - The underlying HTTP transport
 * @param getLifecycle - Lazy getter for the lifecycle manager (supports React refs and late init)
 */
export function createRetryingTransport(
  baseTransport: Transport,
  getLifecycle: () => TokenLifecycleManager | null
): Transport {
  async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof BlockErrorException && error.status === 401) {
        const lifecycle = getLifecycle();
        if (lifecycle) {
          try {
            await lifecycle.refreshNow();
            // Retry once — transport reads fresh token from tokenManager on next call
            return await fn();
          } catch {
            // Refresh failed — throw original 401
            throw error;
          }
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
