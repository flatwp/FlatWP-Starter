/**
 * Search Client
 * Client-side search functionality using Fuse.js and WordPress search index
 */

import Fuse, { type IFuseOptions } from 'fuse.js';
import type { SearchIndex, SearchIndexItem, SearchResult, SearchOptions } from './types';

const SEARCH_INDEX_URL = '/api/search-index';
const CACHE_KEY = 'flatwp_search_index';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

/**
 * Fetch search index from WordPress
 * Caches the index in sessionStorage for performance
 */
export async function fetchSearchIndex(): Promise<SearchIndex> {
  // Check cache first
  if (typeof window !== 'undefined') {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;

        // Return cached data if less than 1 hour old
        if (age < CACHE_DURATION) {
          return data as SearchIndex;
        }
      } catch (error) {
        // Invalid cache, continue to fetch
        console.warn('Invalid search index cache:', error);
      }
    }
  }

  // Fetch fresh index
  const response = await fetch(SEARCH_INDEX_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch search index: ${response.statusText}`);
  }

  const data: SearchIndex = await response.json();

  // Cache the result
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      // SessionStorage quota exceeded or disabled, continue without caching
      console.warn('Failed to cache search index:', error);
    }
  }

  return data;
}

/**
 * Clear search index cache
 */
export function clearSearchCache(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(CACHE_KEY);
  }
}

/**
 * Create Fuse.js instance with optimal settings for WordPress content
 */
function createFuseInstance(posts: SearchIndexItem[]): Fuse<SearchIndexItem> {
  return new Fuse(posts, {
    // Fields to search in (with weights)
    keys: [
      { name: 'title', weight: 3 },        // Title most important
      { name: 'excerpt', weight: 2 },      // Excerpt second
      { name: 'categories', weight: 1.5 }, // Categories relevant
      { name: 'tags', weight: 1 },         // Tags less relevant
    ],

    // Search settings
    threshold: 0.4,           // 0 = perfect match, 1 = match anything
    distance: 100,            // Maximum distance for fuzzy matching
    minMatchCharLength: 2,    // Minimum characters to trigger search

    // Enable advanced features
    includeScore: true,       // Include match score in results
    includeMatches: true,     // Include match positions for highlighting

    // Performance
    shouldSort: true,         // Sort results by relevance
    findAllMatches: false,    // Stop after first match per field
  });
}

/**
 * Search the index with given query
 * Returns sorted results by relevance
 */
export async function search(
  query: string,
  options: SearchOptions = {}
): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  // Fetch index
  const index = await fetchSearchIndex();

  if (!index.posts || index.posts.length === 0) {
    return [];
  }

  // Create Fuse instance
  const fuse = createFuseInstance(index.posts);

  // Perform search
  const results = fuse.search(query, {
    limit: options.limit || 20,
  });

  // Transform results
  return results.map((result) => ({
    ...result.item,
    score: result.score,
    matches: result.matches,
  }));
}

/**
 * Search with custom Fuse options
 * For advanced use cases
 */
export async function searchWithOptions(
  query: string,
  fuseOptions: Partial<IFuseOptions<SearchIndexItem>>
): Promise<SearchResult[]> {
  const index = await fetchSearchIndex();

  if (!index.posts || index.posts.length === 0) {
    return [];
  }

  const fuse = new Fuse(index.posts, {
    ...fuseOptions,
    includeScore: true,
    includeMatches: true,
  });

  const results = fuse.search(query);

  return results.map((result) => ({
    ...result.item,
    score: result.score,
    matches: result.matches,
  }));
}

/**
 * Get search suggestions based on partial query
 * Useful for autocomplete/typeahead
 */
export async function getSuggestions(
  query: string,
  limit: number = 5
): Promise<string[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const results = await search(query, { limit });

  // Return unique titles
  return Array.from(new Set(results.map((r) => r.title))).slice(0, limit);
}

/**
 * Filter posts by category
 */
export async function searchByCategory(
  category: string,
  limit?: number
): Promise<SearchIndexItem[]> {
  const index = await fetchSearchIndex();

  const filtered = index.posts.filter((post) =>
    post.categories.some((cat) =>
      cat.toLowerCase() === category.toLowerCase()
    )
  );

  return limit ? filtered.slice(0, limit) : filtered;
}

/**
 * Filter posts by tag
 */
export async function searchByTag(
  tag: string,
  limit?: number
): Promise<SearchIndexItem[]> {
  const index = await fetchSearchIndex();

  const filtered = index.posts.filter((post) =>
    post.tags.some((t) =>
      t.toLowerCase() === tag.toLowerCase()
    )
  );

  return limit ? filtered.slice(0, limit) : filtered;
}

/**
 * Get recent posts from index
 */
export async function getRecentPosts(limit: number = 10): Promise<SearchIndexItem[]> {
  const index = await fetchSearchIndex();

  // Sort by date descending
  const sorted = [...index.posts].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return sorted.slice(0, limit);
}
