import { useState, useCallback } from 'react';
import type { PageResult, ListParams } from '@23blocks/contracts';
import type {
  UserAvatarFull,
  CreateAvatarRequest,
  AvatarPresignResponse,
  MultipartPresignRequest,
  MultipartPresignResponse,
  MultipartCompleteRequest,
  MultipartCompleteResponse,
} from '@23blocks/block-authentication';
import { useAuthenticationBlock } from '../context.js';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface UseAvatarsState {
  avatars: UserAvatarFull[];
  currentAvatar: UserAvatarFull | null;
  isLoading: boolean;
  error: Error | null;
}

export interface UseAvatarsActions {
  list: (userUniqueId: string, params?: ListParams) => Promise<PageResult<UserAvatarFull>>;
  get: (userUniqueId: string) => Promise<UserAvatarFull>;
  create: (userUniqueId: string, request: CreateAvatarRequest) => Promise<UserAvatarFull>;
  update: (userUniqueId: string, request: Partial<CreateAvatarRequest>) => Promise<UserAvatarFull>;
  remove: (userUniqueId: string) => Promise<void>;
  presignUpload: (userUniqueId: string, filename: string) => Promise<AvatarPresignResponse>;
  multipartPresign: (userUniqueId: string, request: MultipartPresignRequest) => Promise<MultipartPresignResponse>;
  multipartComplete: (userUniqueId: string, request: MultipartCompleteRequest) => Promise<MultipartCompleteResponse>;
  clearError: () => void;
}

export type UseAvatarsReturn = UseAvatarsState & UseAvatarsActions;

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hook for user avatar management.
 *
 * @example
 * ```tsx
 * function AvatarUpload({ userUniqueId }: { userUniqueId: string }) {
 *   const { presignUpload, create, isLoading, error } = useAvatars();
 *
 *   const handleUpload = async (file: File) => {
 *     // Get presigned URL
 *     const { uploadUrl, publicUrl } = await presignUpload(userUniqueId, file.name);
 *
 *     // Upload directly to S3
 *     await fetch(uploadUrl, { method: 'PUT', body: file });
 *
 *     // Save avatar record
 *     await create(userUniqueId, {
 *       originalName: file.name,
 *       name: file.name,
 *       url: publicUrl,
 *       fileType: file.type,
 *       fileSize: file.size,
 *     });
 *   };
 *
 *   return (
 *     <input type="file" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
 *   );
 * }
 * ```
 */
export function useAvatars(): UseAvatarsReturn {
  const block = useAuthenticationBlock();

  const [avatars, setAvatars] = useState<UserAvatarFull[]>([]);
  const [currentAvatar, setCurrentAvatar] = useState<UserAvatarFull | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const list = useCallback(async (
    userUniqueId: string,
    params?: ListParams
  ): Promise<PageResult<UserAvatarFull>> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await block.avatars.list(userUniqueId, params);
      setAvatars(result.data);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.avatars]);

  const get = useCallback(async (userUniqueId: string): Promise<UserAvatarFull> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await block.avatars.get(userUniqueId);
      setCurrentAvatar(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.avatars]);

  const create = useCallback(async (
    userUniqueId: string,
    request: CreateAvatarRequest
  ): Promise<UserAvatarFull> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await block.avatars.create(userUniqueId, request);
      setCurrentAvatar(result);
      setAvatars(prev => [...prev, result]);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.avatars]);

  const update = useCallback(async (
    userUniqueId: string,
    request: Partial<CreateAvatarRequest>
  ): Promise<UserAvatarFull> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await block.avatars.update(userUniqueId, request);
      setCurrentAvatar(result);
      setAvatars(prev => prev.map(a => a.userUniqueId === userUniqueId ? result : a));
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.avatars]);

  const remove = useCallback(async (userUniqueId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await block.avatars.delete(userUniqueId);
      setCurrentAvatar(null);
      setAvatars(prev => prev.filter(a => a.userUniqueId !== userUniqueId));
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.avatars]);

  const presignUpload = useCallback(async (
    userUniqueId: string,
    filename: string
  ): Promise<AvatarPresignResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.avatars.presignUpload(userUniqueId, filename);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.avatars]);

  const multipartPresign = useCallback(async (
    userUniqueId: string,
    request: MultipartPresignRequest
  ): Promise<MultipartPresignResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.avatars.multipartPresign(userUniqueId, request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.avatars]);

  const multipartComplete = useCallback(async (
    userUniqueId: string,
    request: MultipartCompleteRequest
  ): Promise<MultipartCompleteResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.avatars.multipartComplete(userUniqueId, request);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.avatars]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    avatars,
    currentAvatar,
    isLoading,
    error,
    list,
    get,
    create,
    update,
    remove,
    presignUpload,
    multipartPresign,
    multipartComplete,
    clearError,
  };
}
