/**
 * useSearch Hook
 * React hook for client-side search with automatic state management
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { search, fetchSearchIndex } from './search-client';
import type { SearchResult, SearchOptions } from './types';

interface UseSearchOptions extends SearchOptions {
  /** Debounce delay in milliseconds */
  debounce?: number;
  /** Minimum query length to trigger search */
  minLength?: number;
}

interface UseSearchReturn {
  /** Current search query */
  query: string;
  /** Search results */
  results: SearchResult[];
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Set search query */
  setQuery: (query: string) => void;
  /** Clear search */
  clear: () => void;
  /** Manually trigger search */
  performSearch: (query: string) => Promise<void>;
}

/**
 * Hook for client-side search functionality
 *
 * @example
 * ```tsx
 * function SearchComponent() {
 *   const { query, results, isLoading, setQuery } = useSearch({
 *     debounce: 300,
 *     limit: 10,
 *   });
 *
 *   return (
 *     <div>
 *       <input value={query} onChange={(e) => setQuery(e.target.value)} />
 *       {isLoading && <div>Searching...</div>}
 *       {results.map((result) => (
 *         <div key={result.id}>{result.title}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const {
    debounce = 300,
    minLength = 2,
    limit = 20,
    threshold,
    keys,
  } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Use ref to track mounted state
  const mountedRef = useRef(true);

  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Perform search
  const performSearch = useCallback(
    async (searchQuery: string) => {
      // Clear previous timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Reset error
      setError(null);

      // Check minimum length
      if (searchQuery.trim().length < minLength) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      // Set loading
      setIsLoading(true);

      try {
        const searchResults = await search(searchQuery, {
          limit,
          threshold,
          keys,
        });

        // Only update if still mounted
        if (mountedRef.current) {
          setResults(searchResults);
          setIsLoading(false);
        }
      } catch (err) {
        if (mountedRef.current) {
          setError(err instanceof Error ? err : new Error('Search failed'));
          setResults([]);
          setIsLoading(false);
        }
      }
    },
    [limit, threshold, keys, minLength]
  );

  // Debounced search effect
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Empty query - clear results immediately
    if (query.trim().length === 0) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    // Too short - don't search
    if (query.trim().length < minLength) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    // Set loading state immediately for better UX
    setIsLoading(true);

    // Debounce search
    debounceTimerRef.current = setTimeout(() => {
      performSearch(query);
    }, debounce);

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, debounce, minLength, performSearch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Clear search
  const clear = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    query,
    results,
    isLoading,
    error,
    setQuery,
    clear,
    performSearch,
  };
}

/**
 * Hook to preload search index on component mount
 * Useful for search pages to improve first search performance
 *
 * @example
 * ```tsx
 * function SearchPage() {
 *   const { isReady, error } = useSearchIndexPreload();
 *
 *   if (error) return <div>Failed to load search index</div>;
 *   if (!isReady) return <div>Loading search...</div>;
 *
 *   return <SearchComponent />;
 * }
 * ```
 */
export function useSearchIndexPreload() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchSearchIndex()
      .then(() => {
        setIsReady(true);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error('Failed to load search index'));
      });
  }, []);

  return { isReady, error };
}
