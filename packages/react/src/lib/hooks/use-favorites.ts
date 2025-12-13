import { useState, useCallback } from 'react';
import type {
  FavoriteEntity,
  AddFavoriteRequest,
} from '@23blocks/block-search';
import { useSearchBlock } from '../context.js';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface UseFavoritesState {
  favorites: FavoriteEntity[];
  isLoading: boolean;
  error: Error | null;
}

export interface UseFavoritesActions {
  listFavorites: () => Promise<FavoriteEntity[]>;
  addFavorite: (request: AddFavoriteRequest) => Promise<FavoriteEntity>;
  removeFavorite: (id: string) => Promise<void>;
  isFavorite: (entityUniqueId: string) => Promise<boolean>;
  clearError: () => void;
}

export type UseFavoritesReturn = UseFavoritesState & UseFavoritesActions;

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hook for managing favorites.
 *
 * @example
 * ```tsx
 * function FavoritesList() {
 *   const { favorites, listFavorites, removeFavorite, isLoading } = useFavorites();
 *
 *   useEffect(() => {
 *     listFavorites();
 *   }, [listFavorites]);
 *
 *   return (
 *     <ul>
 *       {favorites.map(fav => (
 *         <li key={fav.id}>
 *           {fav.entityDescription}
 *           <button onClick={() => removeFavorite(fav.id)}>Remove</button>
 *         </li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export function useFavorites(): UseFavoritesReturn {
  const block = useSearchBlock();

  const [favorites, setFavorites] = useState<FavoriteEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const listFavorites = useCallback(async (): Promise<FavoriteEntity[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await block.favorites.list();
      setFavorites(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.favorites]);

  const addFavorite = useCallback(async (
    request: AddFavoriteRequest
  ): Promise<FavoriteEntity> => {
    setIsLoading(true);
    setError(null);
    try {
      const favorite = await block.favorites.add(request);
      setFavorites(prev => [...prev, favorite]);
      return favorite;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.favorites]);

  const removeFavorite = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await block.favorites.remove(id);
      setFavorites(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.favorites]);

  const isFavorite = useCallback(async (entityUniqueId: string): Promise<boolean> => {
    try {
      return await block.favorites.isFavorite(entityUniqueId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    }
  }, [block.favorites]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    favorites,
    isLoading,
    error,
    listFavorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearError,
  };
}
