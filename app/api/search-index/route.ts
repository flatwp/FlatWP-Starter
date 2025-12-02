/**
 * Search Index API Route
 * Fetches and serves the search index from WordPress
 *
 * This route:
 * 1. Fetches the search index from WordPress REST API
 * 2. Caches it with ISR for performance
 * 3. Serves it to the Next.js client for Fuse.js searching
 */

import { NextResponse } from 'next/server';

// Cache for 5 minutes (300 seconds)
export const revalidate = 300;

export async function GET() {
  try {
    const wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL?.replace(
      '/graphql',
      ''
    );

    if (!wordpressUrl) {
      return NextResponse.json(
        { error: 'WordPress URL not configured' },
        { status: 500 }
      );
    }

    // Fetch search index from WordPress FlatWP plugin
    const response = await fetch(
      `${wordpressUrl}/wp-json/flatwp/v1/search-index`,
      {
        // Cache for 5 minutes with stale-while-revalidate
        next: {
          revalidate: 300,
          tags: ['search-index'],
        },
      }
    );

    if (!response.ok) {
      // If WordPress plugin is not active or endpoint doesn't exist, return empty index
      if (response.status === 404) {
        return NextResponse.json({
          posts: [],
          version: '0',
          generated: new Date().toISOString(),
          total: 0,
          error: 'Search index not available. FlatWP plugin may not be activated in WordPress.',
        });
      }

      throw new Error(`WordPress search index error: ${response.statusText}`);
    }

    const data = await response.json();

    // Validate response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid search index format');
    }

    // Return search index with cache headers
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Search index fetch error:', error);

    // Return empty index on error for graceful degradation
    return NextResponse.json(
      {
        posts: [],
        version: '0',
        generated: new Date().toISOString(),
        total: 0,
        error: error instanceof Error ? error.message : 'Failed to fetch search index',
      },
      {
        status: 200, // Return 200 with empty index instead of error for better UX
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  }
}
