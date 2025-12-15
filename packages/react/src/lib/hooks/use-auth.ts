import { useState, useCallback } from 'react';
import type {
  User,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
  PasswordResetRequest,
  PasswordUpdateRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  MagicLinkRequest,
  MagicLinkVerifyRequest,
  InvitationRequest,
  AcceptInvitationRequest,
  ResendConfirmationRequest,
  ValidateEmailRequest,
  ValidateEmailResponse,
  ValidateDocumentRequest,
  ValidateDocumentResponse,
  ResendInvitationRequest,
  AccountRecoveryRequest,
  AccountRecoveryResponse,
  CompleteRecoveryRequest,
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
  refreshToken: (request: RefreshTokenRequest) => Promise<RefreshTokenResponse>;
  requestMagicLink: (request: MagicLinkRequest) => Promise<void>;
  verifyMagicLink: (request: MagicLinkVerifyRequest) => Promise<SignInResponse>;
  sendInvitation: (request: InvitationRequest) => Promise<void>;
  acceptInvitation: (request: AcceptInvitationRequest) => Promise<SignInResponse>;
  confirmEmail: (token: string) => Promise<User>;
  resendConfirmation: (request: ResendConfirmationRequest) => Promise<void>;
  validateEmail: (request: ValidateEmailRequest) => Promise<ValidateEmailResponse>;
  validateDocument: (request: ValidateDocumentRequest) => Promise<ValidateDocumentResponse>;
  resendInvitation: (request: ResendInvitationRequest) => Promise<User>;
  requestAccountRecovery: (request: AccountRecoveryRequest) => Promise<AccountRecoveryResponse>;
  completeAccountRecovery: (request: CompleteRecoveryRequest) => Promise<User>;
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

  const refreshToken = useCallback(async (request: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.auth.refreshToken(request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.auth]);

  const requestMagicLink = useCallback(async (request: MagicLinkRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await block.auth.requestMagicLink(request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.auth]);

  const verifyMagicLink = useCallback(async (request: MagicLinkVerifyRequest): Promise<SignInResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await block.auth.verifyMagicLink(request);
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

  const sendInvitation = useCallback(async (request: InvitationRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await block.auth.sendInvitation(request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.auth]);

  const acceptInvitation = useCallback(async (request: AcceptInvitationRequest): Promise<SignInResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await block.auth.acceptInvitation(request);
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

  const confirmEmail = useCallback(async (token: string): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      const confirmedUser = await block.auth.confirmEmail(token);
      setUser(confirmedUser);
      return confirmedUser;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.auth]);

  const resendConfirmation = useCallback(async (request: ResendConfirmationRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await block.auth.resendConfirmation(request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.auth]);

  const validateEmail = useCallback(async (request: ValidateEmailRequest): Promise<ValidateEmailResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.auth.validateEmail(request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.auth]);

  const validateDocument = useCallback(async (request: ValidateDocumentRequest): Promise<ValidateDocumentResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.auth.validateDocument(request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.auth]);

  const resendInvitation = useCallback(async (request: ResendInvitationRequest): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.auth.resendInvitation(request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.auth]);

  const requestAccountRecovery = useCallback(async (request: AccountRecoveryRequest): Promise<AccountRecoveryResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.auth.requestAccountRecovery(request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.auth]);

  const completeAccountRecovery = useCallback(async (request: CompleteRecoveryRequest): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      const recoveredUser = await block.auth.completeAccountRecovery(request);
      setUser(recoveredUser);
      return recoveredUser;
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
    refreshToken,
    requestMagicLink,
    verifyMagicLink,
    sendInvitation,
    acceptInvitation,
    confirmEmail,
    resendConfirmation,
    validateEmail,
    validateDocument,
    resendInvitation,
    requestAccountRecovery,
    completeAccountRecovery,
    clearError,
  };
}
