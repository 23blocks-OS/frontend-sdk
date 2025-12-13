import { useState, useCallback } from 'react';
import type {
  User,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
  PasswordResetRequest,
  PasswordUpdateRequest,
} from '@23blocks/block-authentication';
import { useAuthenticationBlock } from '../context.js';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface UseAuthState {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
}

export interface UseAuthActions {
  signIn: (request: SignInRequest) => Promise<SignInResponse>;
  signUp: (request: SignUpRequest) => Promise<SignUpResponse>;
  signOut: () => Promise<void>;
  requestPasswordReset: (request: PasswordResetRequest) => Promise<void>;
  updatePassword: (request: PasswordUpdateRequest) => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

export type UseAuthReturn = UseAuthState & UseAuthActions;

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hook for authentication operations with state management.
 *
 * @example
 * ```tsx
 * function LoginForm() {
 *   const { signIn, isLoading, error, user } = useAuth();
 *
 *   const handleSubmit = async (e: FormEvent) => {
 *     e.preventDefault();
 *     try {
 *       await signIn({ email, password });
 *       navigate('/dashboard');
 *     } catch (err) {
 *       // Error is automatically captured in `error` state
 *     }
 *   };
 *
 *   if (user) {
 *     return <p>Welcome, {user.email}!</p>;
 *   }
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       {error && <p className="error">{error.message}</p>}
 *       <button disabled={isLoading}>
 *         {isLoading ? 'Signing in...' : 'Sign In'}
 *       </button>
 *     </form>
 *   );
 * }
 * ```
 */
export function useAuth(): UseAuthReturn {
  const block = useAuthenticationBlock();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const signIn = useCallback(async (request: SignInRequest): Promise<SignInResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await block.auth.signIn(request);
      setUser(response.user);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.auth]);

  const signUp = useCallback(async (request: SignUpRequest): Promise<SignUpResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await block.auth.signUp(request);
      setUser(response.user);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.auth]);

  const signOut = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await block.auth.signOut();
      setUser(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.auth]);

  const requestPasswordReset = useCallback(async (request: PasswordResetRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await block.auth.requestPasswordReset(request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.auth]);

  const updatePassword = useCallback(async (request: PasswordUpdateRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await block.auth.updatePassword(request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.auth]);

  const refreshUser = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const currentUser = await block.auth.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.auth]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    user,
    isLoading,
    error,
    isAuthenticated: user !== null,

    // Actions
    signIn,
    signUp,
    signOut,
    requestPasswordReset,
    updatePassword,
    refreshUser,
    clearError,
  };
}
