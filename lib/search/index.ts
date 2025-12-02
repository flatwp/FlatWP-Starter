/**
 * FlatWP Search Module
 * Client-side fuzzy search powered by Fuse.js and WordPress search index
 *
 * @example
 * ```tsx
 * import { Search, useSearch, search } from '@/lib/search';
 *
 * // Use the hook in a component
 * function MyComponent() {
 *   const { query, results, setQuery } = useSearch();
 *   // ...
 * }
 *
 * // Or use the search function directly
 * const results = await search('my query');
 * ```
 */

// Core search functionality
export {
  search,
  searchWithOptions,
  getSuggestions,
  searchByCategory,
  searchByTag,
  getRecentPosts,
  fetchSearchIndex,
  clearSearchCache,
} from './search-client';

// React hooks
export {
  useSearch,
  useSearchIndexPreload,
} from './useSearch';

// Types
export type {
  SearchIndex,
  SearchIndexItem,
  SearchResult,
  SearchOptions,
} from './types';
