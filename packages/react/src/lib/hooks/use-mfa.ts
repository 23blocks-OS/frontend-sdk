import { useState, useCallback } from 'react';
import type {
  MfaSetupResponseFull,
  MfaEnableRequest,
  MfaDisableRequest,
  MfaVerifyRequestFull,
  MfaStatusResponse,
  MfaVerificationResponse,
  MfaOperationResponse,
} from '@23blocks/block-authentication';
import { useAuthenticationBlock } from '../context.js';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface UseMfaState {
  isLoading: boolean;
  error: Error | null;
  status: MfaStatusResponse | null;
  setupData: MfaSetupResponseFull | null;
}

export interface UseMfaActions {
  setup: () => Promise<MfaSetupResponseFull>;
  enable: (request: MfaEnableRequest) => Promise<MfaOperationResponse>;
  disable: (request: MfaDisableRequest) => Promise<MfaOperationResponse>;
  verify: (request: MfaVerifyRequestFull) => Promise<MfaVerificationResponse>;
  getStatus: () => Promise<MfaStatusResponse>;
  clearError: () => void;
}

export type UseMfaReturn = UseMfaState & UseMfaActions;

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hook for Multi-Factor Authentication operations.
 *
 * @example
 * ```tsx
 * function MfaSettings() {
 *   const { setup, enable, disable, getStatus, status, isLoading, error } = useMfa();
 *
 *   useEffect(() => {
 *     getStatus();
 *   }, [getStatus]);
 *
 *   const handleSetup = async () => {
 *     const data = await setup();
 *     // Show QR code from data.qrCodeUri
 *   };
 *
 *   const handleEnable = async (code: string) => {
 *     await enable({ totpCode: code });
 *   };
 *
 *   return (
 *     <div>
 *       {status?.enabled ? (
 *         <button onClick={() => disable({ password: 'xxx' })}>Disable MFA</button>
 *       ) : (
 *         <button onClick={handleSetup}>Setup MFA</button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useMfa(): UseMfaReturn {
  const block = useAuthenticationBlock();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<MfaStatusResponse | null>(null);
  const [setupData, setSetupData] = useState<MfaSetupResponseFull | null>(null);

  const setup = useCallback(async (): Promise<MfaSetupResponseFull> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await block.mfa.setup();
      setSetupData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.mfa]);

  const enable = useCallback(async (request: MfaEnableRequest): Promise<MfaOperationResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await block.mfa.enable(request);
      setSetupData(null);
      // Refresh status after enabling
      const newStatus = await block.mfa.status();
      setStatus(newStatus);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.mfa]);

  const disable = useCallback(async (request: MfaDisableRequest): Promise<MfaOperationResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await block.mfa.disable(request);
      // Refresh status after disabling
      const newStatus = await block.mfa.status();
      setStatus(newStatus);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.mfa]);

  const verify = useCallback(async (request: MfaVerifyRequestFull): Promise<MfaVerificationResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.mfa.verify(request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.mfa]);

  const getStatus = useCallback(async (): Promise<MfaStatusResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await block.mfa.status();
      setStatus(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.mfa]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    status,
    setupData,
    setup,
    enable,
    disable,
    verify,
    getStatus,
    clearError,
  };
}
