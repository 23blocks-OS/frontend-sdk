import { useState, useCallback } from 'react';
import type { PageResult } from '@23blocks/contracts';
import type {
  Series,
  CreateSeriesRequest,
  UpdateSeriesRequest,
  ListSeriesParams,
  QuerySeriesParams,
  ReorderPostsRequest,
  Post,
} from '@23blocks/block-content';
import { useContentBlock } from '../context.js';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface UseContentSeriesState {
  series: Series[];
  currentSeries: Series | null;
  posts: Post[];
  totalRecords: number;
  isLoading: boolean;
  error: Error | null;
}

export interface UseContentSeriesActions {
  // CRUD Operations
  listSeries: (params?: ListSeriesParams) => Promise<PageResult<Series>>;
  querySeries: (params: QuerySeriesParams) => Promise<PageResult<Series>>;
  getSeries: (uniqueId: string) => Promise<Series>;
  createSeries: (data: CreateSeriesRequest) => Promise<Series>;
  updateSeries: (uniqueId: string, data: UpdateSeriesRequest) => Promise<Series>;
  deleteSeries: (uniqueId: string) => Promise<void>;

  // Social Actions
  likeSeries: (uniqueId: string) => Promise<Series>;
  dislikeSeries: (uniqueId: string) => Promise<Series>;
  followSeries: (uniqueId: string) => Promise<Series>;
  unfollowSeries: (uniqueId: string) => Promise<void>;
  saveSeries: (uniqueId: string) => Promise<Series>;
  unsaveSeries: (uniqueId: string) => Promise<void>;

  // Post Management
  getSeriesPosts: (uniqueId: string) => Promise<Post[]>;
  addSeriesPost: (seriesUniqueId: string, postUniqueId: string, sequence?: number) => Promise<void>;
  removeSeriesPost: (seriesUniqueId: string, postUniqueId: string) => Promise<void>;
  reorderSeriesPosts: (uniqueId: string, data: ReorderPostsRequest) => Promise<Series>;

  // State Management
  clearSeries: () => void;
  clearError: () => void;
}

export type UseContentSeriesReturn = UseContentSeriesState & UseContentSeriesActions;

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hook for content series operations with state management.
 *
 * @example
 * ```tsx
 * function SeriesPage() {
 *   const { series, listSeries, isLoading } = useContentSeries();
 *
 *   useEffect(() => {
 *     listSeries({ page: 1, perPage: 10 });
 *   }, [listSeries]);
 *
 *   if (isLoading) return <div>Loading...</div>;
 *
 *   return (
 *     <ul>
 *       {series.map(s => (
 *         <li key={s.uniqueId}>{s.title}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export function useContentSeries(): UseContentSeriesReturn {
  const block = useContentBlock();

  const [series, setSeries] = useState<Series[]>([]);
  const [currentSeries, setCurrentSeries] = useState<Series | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // ─────────────────────────────────────────────────────────────────────────
  // CRUD Operations
  // ─────────────────────────────────────────────────────────────────────────

  const listSeries = useCallback(async (params?: ListSeriesParams): Promise<PageResult<Series>> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await block.series.list(params);
      setSeries(response.data);
      setTotalRecords(response.meta.totalRecords);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.series]);

  const querySeries = useCallback(async (params: QuerySeriesParams): Promise<PageResult<Series>> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await block.series.query(params);
      setSeries(response.data);
      setTotalRecords(response.meta.totalRecords);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.series]);

  const getSeries = useCallback(async (uniqueId: string): Promise<Series> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await block.series.get(uniqueId);
      setCurrentSeries(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.series]);

  const createSeries = useCallback(async (data: CreateSeriesRequest): Promise<Series> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await block.series.create(data);
      setSeries(prev => [...prev, result]);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.series]);

  const updateSeries = useCallback(async (uniqueId: string, data: UpdateSeriesRequest): Promise<Series> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await block.series.update(uniqueId, data);
      setSeries(prev => prev.map(s => s.uniqueId === uniqueId ? result : s));
      if (currentSeries?.uniqueId === uniqueId) {
        setCurrentSeries(result);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.series, currentSeries?.uniqueId]);

  const deleteSeries = useCallback(async (uniqueId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await block.series.delete(uniqueId);
      setSeries(prev => prev.filter(s => s.uniqueId !== uniqueId));
      if (currentSeries?.uniqueId === uniqueId) {
        setCurrentSeries(null);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.series, currentSeries?.uniqueId]);

  // ─────────────────────────────────────────────────────────────────────────
  // Social Actions
  // ─────────────────────────────────────────────────────────────────────────

  const likeSeries = useCallback(async (uniqueId: string): Promise<Series> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await block.series.like(uniqueId);
      setSeries(prev => prev.map(s => s.uniqueId === uniqueId ? result : s));
      if (currentSeries?.uniqueId === uniqueId) {
        setCurrentSeries(result);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.series, currentSeries?.uniqueId]);

  const dislikeSeries = useCallback(async (uniqueId: string): Promise<Series> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await block.series.dislike(uniqueId);
      setSeries(prev => prev.map(s => s.uniqueId === uniqueId ? result : s));
      if (currentSeries?.uniqueId === uniqueId) {
        setCurrentSeries(result);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.series, currentSeries?.uniqueId]);

  const followSeries = useCallback(async (uniqueId: string): Promise<Series> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await block.series.follow(uniqueId);
      setSeries(prev => prev.map(s => s.uniqueId === uniqueId ? result : s));
      if (currentSeries?.uniqueId === uniqueId) {
        setCurrentSeries(result);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.series, currentSeries?.uniqueId]);

  const unfollowSeries = useCallback(async (uniqueId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await block.series.unfollow(uniqueId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.series]);

  const saveSeries = useCallback(async (uniqueId: string): Promise<Series> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await block.series.save(uniqueId);
      setSeries(prev => prev.map(s => s.uniqueId === uniqueId ? result : s));
      if (currentSeries?.uniqueId === uniqueId) {
        setCurrentSeries(result);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.series, currentSeries?.uniqueId]);

  const unsaveSeries = useCallback(async (uniqueId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await block.series.unsave(uniqueId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.series]);

  // ─────────────────────────────────────────────────────────────────────────
  // Post Management
  // ─────────────────────────────────────────────────────────────────────────

  const getSeriesPosts = useCallback(async (uniqueId: string): Promise<Post[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await block.series.getPosts(uniqueId);
      setPosts(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.series]);

  const addSeriesPost = useCallback(async (
    seriesUniqueId: string,
    postUniqueId: string,
    sequence?: number
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await block.series.addPost(seriesUniqueId, postUniqueId, sequence);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.series]);

  const removeSeriesPost = useCallback(async (
    seriesUniqueId: string,
    postUniqueId: string
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await block.series.removePost(seriesUniqueId, postUniqueId);
      setPosts(prev => prev.filter(p => p.uniqueId !== postUniqueId));
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.series]);

  const reorderSeriesPosts = useCallback(async (
    uniqueId: string,
    data: ReorderPostsRequest
  ): Promise<Series> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await block.series.reorderPosts(uniqueId, data);
      setSeries(prev => prev.map(s => s.uniqueId === uniqueId ? result : s));
      if (currentSeries?.uniqueId === uniqueId) {
        setCurrentSeries(result);
      }
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.series, currentSeries?.uniqueId]);

  // ─────────────────────────────────────────────────────────────────────────
  // State Management
  // ─────────────────────────────────────────────────────────────────────────

  const clearSeries = useCallback(() => {
    setSeries([]);
    setCurrentSeries(null);
    setPosts([]);
    setTotalRecords(0);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    series,
    currentSeries,
    posts,
    totalRecords,
    isLoading,
    error,
    // CRUD Operations
    listSeries,
    querySeries,
    getSeries,
    createSeries,
    updateSeries,
    deleteSeries,
    // Social Actions
    likeSeries,
    dislikeSeries,
    followSeries,
    unfollowSeries,
    saveSeries,
    unsaveSeries,
    // Post Management
    getSeriesPosts,
    addSeriesPost,
    removeSeriesPost,
    reorderSeriesPosts,
    // State Management
    clearSeries,
    clearError,
  };
}
