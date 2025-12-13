import { useState, useCallback } from 'react';
import type {
  SearchResult,
  SearchRequest,
  SearchResponse,
  EntityType,
} from '@23blocks/block-search';
import { useSearchBlock } from '../context.js';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface UseSearchState {
  results: SearchResult[];
  totalRecords: number;
  isLoading: boolean;
  error: Error | null;
  query: string;
}

export interface UseSearchActions {
  search: (request: SearchRequest) => Promise<SearchResponse>;
  suggest: (query: string, limit?: number) => Promise<SearchResult[]>;
  getEntityTypes: () => Promise<EntityType[]>;
  clearResults: () => void;
  clearError: () => void;
}

export type UseSearchReturn = UseSearchState & UseSearchActions;

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hook for search operations with state management.
 *
 * @example
 * ```tsx
 * function SearchPage() {
 *   const { results, search, isLoading, query } = useSearch();
 *   const [inputValue, setInputValue] = useState('');
 *
 *   const handleSearch = async (e: FormEvent) => {
 *     e.preventDefault();
 *     await search({ query: inputValue });
 *   };
 *
 *   return (
 *     <div>
 *       <form onSubmit={handleSearch}>
 *         <input
 *           value={inputValue}
 *           onChange={(e) => setInputValue(e.target.value)}
 *           placeholder="Search..."
 *         />
 *         <button disabled={isLoading}>Search</button>
 *       </form>
 *
 *       {query && <p>Results for: {query}</p>}
 *
 *       <ul>
 *         {results.map(result => (
 *           <li key={result.id}>{result.entityDescription}</li>
 *         ))}
 *       </ul>
 *     </div>
 *   );
 * }
 * ```
 */
export function useSearch(): UseSearchReturn {
  const block = useSearchBlock();

  const [results, setResults] = useState<SearchResult[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [query, setQuery] = useState('');

  const search = useCallback(async (request: SearchRequest): Promise<SearchResponse> => {
    setIsLoading(true);
    setError(null);
    setQuery(request.query);
    try {
      const response = await block.search.search(request);
      setResults(response.results);
      setTotalRecords(response.totalRecords);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.search]);

  const suggest = useCallback(async (
    query: string,
    limit?: number
  ): Promise<SearchResult[]> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.search.suggest(query, limit);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.search]);

  const getEntityTypes = useCallback(async (): Promise<EntityType[]> => {
    setIsLoading(true);
    setError(null);
    try {
      return await block.search.entityTypes();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [block.search]);

  const clearResults = useCallback(() => {
    setResults([]);
    setTotalRecords(0);
    setQuery('');
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    results,
    totalRecords,
    isLoading,
    error,
    query,
    search,
    suggest,
    getEntityTypes,
    clearResults,
    clearError,
  };
}
