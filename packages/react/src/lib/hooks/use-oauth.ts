import { useState, useCallback } from 'react';
import type {
  SignInResponse,
  OAuthSocialLoginRequest,
  TenantLoginRequest,
  TokenIntrospectionResponse,
  TokenRevokeRequest,
  TokenRevokeAllRequest,
  TokenRevokeResponse,
  TenantContextCreateRequest,
  TenantContextResponse,
  TenantContextAuditEntry,
} from '@23blocks/block-authentication';
import { useAuthenticationBlock } from '../context.js';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface UseOAuthState {
  isLoading: boolean;
  error: Error | null;
  tenantContext: TenantContextResponse | null;
}

export interface UseOAuthActions {
  loginWithFacebook: (request: OAuthSocialLoginRequest) => Promise<SignInResponse>;
  loginWithGoogle: (request: OAuthSocialLoginRequest) => Promise<SignInResponse>;
  loginWithTenant: (request: TenantLoginRequest) => Promise<SignInResponse>;
  introspectToken: (token: string) => Promise<TokenIntrospectionResponse>;
  revokeToken: (request: TokenRevokeRequest) => Promise<TokenRevokeResponse>;
  revokeAllTokens: (request?: TokenRevokeAllRequest) => Promise<TokenRevokeResponse>;
  createTenantContext: (request: TenantContextCreateRequest) => Promise<TenantContextResponse>;
  revokeTenantContext: () => Promise<void>;
  auditTenantContext: () => Promise<TenantContextAuditEntry[]>;
  clearError: () => void;
}

export type UseOAuthReturn = UseOAuthState & UseOAuthActions;

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hook for OAuth and token management operations.
 *
 * @example
 * ```tsx
 * function SocialLogin() {
 *   const { loginWithGoogle, loginWithFacebook, isLoading, error } = useOAuth();
 *
 *   const handleGoogleLogin = async (googleToken: string) => {
 *     try {
 *       const response = await loginWithGoogle({ token: googleToken });
 *       // User is now logged in
 *     } catch (err) {
 *       // Handle error
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={() => handleGoogleLogin('...')} disabled={isLoading}>
 *         Login with Google
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useOAuth(): UseOAuthReturn {
  const block = useAuthenticationBlock();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [tenantContext, setTenantContext] = useState<TenantContextResponse | null>(null);

  const loginWithFacebook = useCallback(async (request: OAuthSocialLoginRequest): Promise<SignInResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.oauth.loginWithFacebook(request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.oauth]);

  const loginWithGoogle = useCallback(async (request: OAuthSocialLoginRequest): Promise<SignInResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.oauth.loginWithGoogle(request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.oauth]);

  const loginWithTenant = useCallback(async (request: TenantLoginRequest): Promise<SignInResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.oauth.loginWithTenant(request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.oauth]);

  const introspectToken = useCallback(async (token: string): Promise<TokenIntrospectionResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.oauth.introspectToken(token);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.oauth]);

  const revokeToken = useCallback(async (request: TokenRevokeRequest): Promise<TokenRevokeResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.oauth.revokeToken(request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.oauth]);

  const revokeAllTokens = useCallback(async (request?: TokenRevokeAllRequest): Promise<TokenRevokeResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.oauth.revokeAllTokens(request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.oauth]);

  const createTenantContext = useCallback(async (request: TenantContextCreateRequest): Promise<TenantContextResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await block.oauth.createTenantContext(request);
      setTenantContext(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.oauth]);

  const revokeTenantContext = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await block.oauth.revokeTenantContext();
      setTenantContext(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.oauth]);

  const auditTenantContext = useCallback(async (): Promise<TenantContextAuditEntry[]> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.oauth.auditTenantContext();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.oauth]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    tenantContext,
    loginWithFacebook,
    loginWithGoogle,
    loginWithTenant,
    introspectToken,
    revokeToken,
    revokeAllTokens,
    createTenantContext,
    revokeTenantContext,
    auditTenantContext,
    clearError,
  };
}
