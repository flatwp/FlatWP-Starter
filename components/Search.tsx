/**
 * Search Component
 * Complete search UI with results and loading states
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearch } from '@/lib/search/useSearch';
import { cn } from '@/lib/utils';

interface SearchProps {
  /** CSS class name */
  className?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Show results inline or as dropdown */
  variant?: 'inline' | 'dropdown';
  /** Maximum results to show */
  limit?: number;
  /** Auto-focus input on mount */
  autoFocus?: boolean;
  /** Callback when result is selected */
  onSelect?: () => void;
}

/**
 * Search component with real-time results
 *
 * Features:
 * - Real-time fuzzy search
 * - Debounced input
 * - Loading states
 * - Keyboard navigation
 * - Responsive design
 *
 * @example
 * ```tsx
 * <Search
 *   variant="dropdown"
 *   placeholder="Search posts..."
 *   limit={5}
 * />
 * ```
 */
export function Search({
  className,
  placeholder = 'Search...',
  variant = 'inline',
  limit = 10,
  autoFocus = false,
  onSelect,
}: SearchProps) {
  const { query, results, isLoading, setQuery, clear } = useSearch({ limit });
  const [isFocused, setIsFocused] = useState(false);

  const showResults = query.length >= 2 && (isFocused || variant === 'inline');

  const handleSelect = () => {
    if (variant === 'dropdown') {
      clear();
      setIsFocused(false);
    }
    onSelect?.();
  };

  return (
    <div className={cn('relative w-full', className)}>
      {/* Search Input */}
      <div className="relative">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            'w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pr-10',
            'placeholder:text-gray-400',
            'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
            'dark:border-gray-700 dark:bg-gray-900 dark:text-white'
          )}
        />

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
          </div>
        )}

        {/* Clear Button */}
        {query && !isLoading && (
          <button
            onClick={clear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Clear search"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results */}
      {showResults && (
        <div
          className={cn(
            'mt-2 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900',
            variant === 'dropdown' && 'absolute left-0 right-0 z-50 max-h-96 overflow-y-auto'
          )}
        >
          {results.length > 0 ? (
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {results.map((result) => (
                <li key={result.id}>
                  <Link
                    href={result.url}
                    onClick={handleSelect}
                    className={cn(
                      'block px-4 py-3 transition-colors',
                      'hover:bg-gray-50 dark:hover:bg-gray-800'
                    )}
                  >
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {result.title}
                    </h3>
                    {result.excerpt && (
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {result.excerpt}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                      <span className="capitalize">{result.type}</span>
                      {result.categories.length > 0 && (
                        <>
                          <span>•</span>
                          <span>{result.categories[0]}</span>
                        </>
                      )}
                      {result.score !== undefined && (
                        <>
                          <span>•</span>
                          <span>Score: {(1 - result.score).toFixed(2)}</span>
                        </>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              {query.length < 2 ? (
                'Type at least 2 characters to search'
              ) : (
                <>
                  No results found for "<span className="font-medium">{query}</span>"
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Compact search button that opens a modal/dropdown
 * Useful for mobile navigation
 */
interface SearchButtonProps {
  className?: string;
  onClick?: () => void;
}

export function SearchButton({ className, onClick }: SearchButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2',
        'border border-gray-300 bg-white text-gray-700',
        'hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800',
        className
      )}
      aria-label="Search"
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <span className="hidden sm:inline">Search</span>
    </button>
  );
}

/**
 * Search modal overlay
 * Full-screen search experience
 */
interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto max-w-2xl px-4 pt-20">
        <div className="rounded-lg bg-white p-6 shadow-2xl dark:bg-gray-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Search
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              aria-label="Close search"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <Search
            variant="inline"
            autoFocus
            limit={20}
            onSelect={onClose}
          />
        </div>
      </div>
    </div>
  );
}
