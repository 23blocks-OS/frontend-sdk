import { useState, useCallback } from 'react';
import type { PageResult, ListParams } from '@23blocks/contracts';
import type {
  Company,
  TenantUserFull,
  CreateTenantUserRequest,
  ValidateTenantCodeRequest,
  ValidateTenantCodeResponse,
  SearchTenantRequest,
  UpdateTenantUserOnboardingRequest,
  UpdateTenantUserSalesRequest,
} from '@23blocks/block-authentication';
import { useAuthenticationBlock } from '../context.js';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface UseTenantsState {
  tenants: Company[];
  isLoading: boolean;
  error: Error | null;
}

export interface UseTenantsActions {
  listChildren: (params?: ListParams) => Promise<PageResult<Company>>;
  validateCode: (request: ValidateTenantCodeRequest) => Promise<ValidateTenantCodeResponse>;
  searchByName: (request: SearchTenantRequest) => Promise<Company>;
  searchByCode: (request: SearchTenantRequest) => Promise<Company>;
  createTenantUser: (userUniqueId: string, request: CreateTenantUserRequest) => Promise<TenantUserFull>;
  updateOnboarding: (
    userUniqueId: string,
    urlId: string,
    request: UpdateTenantUserOnboardingRequest
  ) => Promise<TenantUserFull>;
  updateSales: (
    userUniqueId: string,
    urlId: string,
    request: UpdateTenantUserSalesRequest
  ) => Promise<TenantUserFull>;
  clearError: () => void;
}

export type UseTenantsReturn = UseTenantsState & UseTenantsActions;

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hook for tenant management operations.
 *
 * @example
 * ```tsx
 * function TenantList() {
 *   const { tenants, listChildren, isLoading, error } = useTenants();
 *
 *   useEffect(() => {
 *     listChildren();
 *   }, [listChildren]);
 *
 *   if (isLoading) return <Spinner />;
 *   if (error) return <Error message={error.message} />;
 *
 *   return (
 *     <ul>
 *       {tenants.map(tenant => (
 *         <li key={tenant.id}>{tenant.name}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export function useTenants(): UseTenantsReturn {
  const block = useAuthenticationBlock();

  const [tenants, setTenants] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const listChildren = useCallback(async (params?: ListParams): Promise<PageResult<Company>> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await block.tenants.listChildren(params);
      setTenants(result.data);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.tenants]);

  const validateCode = useCallback(async (
    request: ValidateTenantCodeRequest
  ): Promise<ValidateTenantCodeResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.tenants.validateCode(request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.tenants]);

  const searchByName = useCallback(async (request: SearchTenantRequest): Promise<Company> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.tenants.searchByName(request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.tenants]);

  const searchByCode = useCallback(async (request: SearchTenantRequest): Promise<Company> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.tenants.searchByCode(request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.tenants]);

  const createTenantUser = useCallback(async (
    userUniqueId: string,
    request: CreateTenantUserRequest
  ): Promise<TenantUserFull> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.tenants.createTenantUser(userUniqueId, request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.tenants]);

  const updateOnboarding = useCallback(async (
    userUniqueId: string,
    urlId: string,
    request: UpdateTenantUserOnboardingRequest
  ): Promise<TenantUserFull> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.tenants.updateOnboarding(userUniqueId, urlId, request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.tenants]);

  const updateSales = useCallback(async (
    userUniqueId: string,
    urlId: string,
    request: UpdateTenantUserSalesRequest
  ): Promise<TenantUserFull> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.tenants.updateSales(userUniqueId, urlId, request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.tenants]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    tenants,
    isLoading,
    error,
    listChildren,
    validateCode,
    searchByName,
    searchByCode,
    createTenantUser,
    updateOnboarding,
    updateSales,
    clearError,
  };
}
