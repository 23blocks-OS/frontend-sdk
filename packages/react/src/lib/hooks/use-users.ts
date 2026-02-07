import { useState, useCallback } from 'react';
import type { PageResult, ListParams } from '@23blocks/contracts';
import type {
  User,
  UpdateUserRequest,
  UpdateProfileRequest,
  UserProfileFull,
  ProfileRequest,
  UpdateEmailRequest,
  UserDeviceFull,
  AddDeviceRequest,
  UserSearchRequest,
  AddUserSubscriptionRequest,
  Company,
  UserSubscription,
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
  listUsers: (params?: ListParams) => Promise<PageResult<User>>;
  getUser: (uniqueId: string) => Promise<User>;
  getUserByUniqueId: (uniqueId: string) => Promise<User>;
  updateUser: (uniqueId: string, request: UpdateUserRequest) => Promise<User>;
  updateUserProfile: (userUniqueId: string, request: UpdateProfileRequest) => Promise<User>;
  deleteUser: (uniqueId: string) => Promise<void>;
  activateUser: (uniqueId: string) => Promise<User>;
  deactivateUser: (uniqueId: string) => Promise<User>;
  changeUserRole: (uniqueId: string, roleUniqueId: string, reason: string, forceReauth?: boolean) => Promise<User>;
  searchUsers: (query: string, params?: ListParams) => Promise<PageResult<User>>;
  searchUsersAdvanced: (request: UserSearchRequest, params?: ListParams) => Promise<PageResult<User>>;
  getUserProfile: (userUniqueId: string) => Promise<UserProfileFull>;
  createUserProfile: (request: ProfileRequest) => Promise<UserProfileFull>;
  updateUserEmail: (userUniqueId: string, request: UpdateEmailRequest) => Promise<User>;
  getUserDevices: (userUniqueId: string, params?: ListParams) => Promise<PageResult<UserDeviceFull>>;
  addUserDevice: (request: AddDeviceRequest) => Promise<UserDeviceFull>;
  getUserCompanies: (userUniqueId: string) => Promise<Company[]>;
  addUserSubscription: (userUniqueId: string, request: AddUserSubscriptionRequest) => Promise<UserSubscription>;
  updateUserSubscription: (userUniqueId: string, request: AddUserSubscriptionRequest) => Promise<UserSubscription>;
  resendConfirmationByUniqueId: (userUniqueId: string) => Promise<void>;
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

  const listUsers = useCallback(async (params?: ListParams): Promise<PageResult<User>> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await block.users.list(params);
      setUsers(result.data);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.users]);

  const getUser = useCallback(async (uniqueId: string): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.users.get(uniqueId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.users]);

  const getUserByUniqueId = useCallback(async (uniqueId: string): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.users.getByUniqueId(uniqueId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.users]);

  const updateUser = useCallback(async (uniqueId: string, request: UpdateUserRequest): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await block.users.update(uniqueId, request);
      setUsers(prev => prev.map(u => u.uniqueId === uniqueId ? updated : u));
      return updated;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.users]);

  const updateUserProfile = useCallback(async (userUniqueId: string, request: UpdateProfileRequest): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.users.updateProfile(userUniqueId, request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.users]);

  const deleteUser = useCallback(async (uniqueId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await block.users.delete(uniqueId);
      setUsers(prev => prev.filter(u => u.uniqueId !== uniqueId));
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.users]);

  const activateUser = useCallback(async (uniqueId: string): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      const activated = await block.users.activate(uniqueId);
      setUsers(prev => prev.map(u => u.uniqueId === uniqueId ? activated : u));
      return activated;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.users]);

  const deactivateUser = useCallback(async (uniqueId: string): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      const deactivated = await block.users.deactivate(uniqueId);
      setUsers(prev => prev.map(u => u.uniqueId === uniqueId ? deactivated : u));
      return deactivated;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.users]);

  const changeUserRole = useCallback(async (
    uniqueId: string,
    roleUniqueId: string,
    reason: string,
    forceReauth?: boolean
  ): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await block.users.changeRole(uniqueId, roleUniqueId, reason, forceReauth);
      setUsers(prev => prev.map(u => u.uniqueId === uniqueId ? updated : u));
      return updated;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.users]);

  const searchUsers = useCallback(async (query: string, params?: ListParams): Promise<PageResult<User>> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await block.users.search(query, params);
      setUsers(result.data);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.users]);

  const searchUsersAdvanced = useCallback(async (
    request: UserSearchRequest,
    params?: ListParams
  ): Promise<PageResult<User>> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await block.users.searchAdvanced(request, params);
      setUsers(result.data);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.users]);

  const getUserProfile = useCallback(async (userUniqueId: string): Promise<UserProfileFull> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.users.getProfile(userUniqueId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.users]);

  const createUserProfile = useCallback(async (request: ProfileRequest): Promise<UserProfileFull> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.users.createProfile(request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.users]);

  const updateUserEmail = useCallback(async (
    userUniqueId: string,
    request: UpdateEmailRequest
  ): Promise<User> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.users.updateEmail(userUniqueId, request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.users]);

  const getUserDevices = useCallback(async (
    userUniqueId: string,
    params?: ListParams
  ): Promise<PageResult<UserDeviceFull>> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.users.getDevices(userUniqueId, params);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.users]);

  const addUserDevice = useCallback(async (request: AddDeviceRequest): Promise<UserDeviceFull> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.users.addDevice(request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.users]);

  const getUserCompanies = useCallback(async (userUniqueId: string): Promise<Company[]> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.users.getCompanies(userUniqueId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.users]);

  const addUserSubscription = useCallback(async (
    userUniqueId: string,
    request: AddUserSubscriptionRequest
  ): Promise<UserSubscription> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.users.addSubscription(userUniqueId, request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.users]);

  const updateUserSubscription = useCallback(async (
    userUniqueId: string,
    request: AddUserSubscriptionRequest
  ): Promise<UserSubscription> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.users.updateSubscription(userUniqueId, request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.users]);

  const resendConfirmationByUniqueId = useCallback(async (userUniqueId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await block.users.resendConfirmationByUniqueId(userUniqueId);
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
    getUserByUniqueId,
    updateUser,
    updateUserProfile,
    deleteUser,
    activateUser,
    deactivateUser,
    changeUserRole,
    searchUsers,
    searchUsersAdvanced,
    getUserProfile,
    createUserProfile,
    updateUserEmail,
    getUserDevices,
    addUserDevice,
    getUserCompanies,
    addUserSubscription,
    updateUserSubscription,
    resendConfirmationByUniqueId,
    clearError,
  };
}
