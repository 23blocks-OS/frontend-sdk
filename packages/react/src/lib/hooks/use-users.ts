import { useState, useCallback } from 'react';
import type {
  User,
  UpdateUserRequest,
} from '@23blocks/block-authentication';
import { useAuthenticationBlock } from '../context.js';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface UseUsersState {
  users: User[];
  isLoading: boolean;
  error: Error | null;
}

export interface UseUsersActions {
  listUsers: (params?: { page?: number; perPage?: number }) => Promise<User[]>;
  getUser: (id: string) => Promise<User>;
  updateUser: (id: string, request: UpdateUserRequest) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  clearError: () => void;
}

export type UseUsersReturn = UseUsersState & UseUsersActions;

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hook for user management operations.
 *
 * @example
 * ```tsx
 * function UserList() {
 *   const { users, listUsers, isLoading, error } = useUsers();
 *
 *   useEffect(() => {
 *     listUsers({ page: 1, perPage: 20 });
 *   }, [listUsers]);
 *
 *   if (isLoading) return <Spinner />;
 *   if (error) return <Error message={error.message} />;
 *
 *   return (
 *     <ul>
 *       {users.map(user => (
 *         <li key={user.id}>{user.email}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export function useUsers(): UseUsersReturn {
  const block = useAuthenticationBlock();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const listUsers = useCallback(async (
    params?: { page?: number; perPage?: number }
  ): Promise<User[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await block.users.list(params);
      setUsers(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.users]);

  const getUser = useCallback(async (id: string): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.users.get(id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.users]);

  const updateUser = useCallback(async (
    id: string,
    request: UpdateUserRequest
  ): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await block.users.update(id, request);
      setUsers(prev => prev.map(u => u.id === id ? updated : u));
      return updated;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.users]);

  const deleteUser = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await block.users.delete(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.users]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    users,
    isLoading,
    error,
    listUsers,
    getUser,
    updateUser,
    deleteUser,
    clearError,
  };
}
