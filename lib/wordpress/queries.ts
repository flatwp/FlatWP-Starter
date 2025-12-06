/**
 * WordPress GraphQL Query Wrapper Functions
 * Provides typed, easy-to-use functions for fetching WordPress content
 */

import { gql } from '@apollo/client';
import { getClient } from './client/apollo';
import { adaptPost, type Post } from './adapters/post';
import { adaptPage, type Page } from './adapters/page';
import {
  GetAllPostsDocument,
  GetPostBySlugDocument,
  GetAllPostSlugsDocument,
  GetSearchIndexDocument,
  GetPaginatedPostsDocument,
  GetTotalPostCountDocument,
  GetAllCategoriesDocument,
  GetPostsByCategoryDocument,
  GetPostsByTagDocument,
  GetPostsByAuthorDocument,
  GetAllCategorySlugsDocument,
  GetAllTagSlugsDocument,
  GetAllAuthorSlugsDocument,
  GetAllTagsDocument,
  GetRelatedPostsByCategoryDocument,
  GetRelatedPostsByTagDocument,
  // GetAllPageSlugsDocument,  // Needs GraphQL codegen
  // GetPageBySlugDocument,     // Needs GraphQL codegen
  // GetPageByIdDocument,       // Needs GraphQL codegen
  // GetFeaturedPostsDocument, // Not available yet - using client-side filtering fallback
  // GetRegularPostsDocument,  // Not available yet - using client-side filtering fallback
} from './__generated__/graphql';

/**
 * Posts per page for pagination
 * Adjust this value to change the number of posts displayed per page
 */
export const POSTS_PER_PAGE = 10;

/**
 * Fetch all published posts
 * Uses ISR with time-based revalidation
 *
 * @returns Array of Post objects
 */
export async function getAllPosts(): Promise<Post[]> {
  const client = getClient();

  try {
    const { data } = await client.query({
      query: GetAllPostsDocument,
      context: {
        fetchOptions: {
          next: { revalidate: 300 }, // Revalidate every 5 minutes
        },
      },
    });

    if (!data?.posts?.nodes) {
      console.error('No posts data returned from WordPress GraphQL');
      return [];
    }

    return data.posts.nodes
      .filter((post): post is NonNullable<typeof post> => post !== null)
      .map((post) => adaptPost(post));
  } catch (error) {
    console.error('Error fetching all posts:', error);
    throw new Error('Failed to fetch posts from WordPress');
  }
}

/**
 * Fetch a single post by slug
 * Uses ISR with on-demand revalidation
 *
 * @param slug - Post slug
 * @returns Post object or null if not found
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const client = getClient();

  try {
    const { data } = await client.query({
      query: GetPostBySlugDocument,
      variables: { slug },
      context: {
        fetchOptions: {
          next: { revalidate: 60 }, // Revalidate every 1 minute
        },
      },
    });

    if (!data?.post) {
      return null;
    }

    return adaptPost(data.post);
  } catch (error) {
    console.error(`Error fetching post with slug "${slug}":`, error);
    throw new Error(`Failed to fetch post: ${slug}`);
  }
}

/**
 * Fetch all post slugs for static generation
 * Used in generateStaticParams for dynamic routes
 *
 * @returns Array of post slugs
 */
export async function getAllPostSlugs(): Promise<string[]> {
  const client = getClient();

  try {
    const { data } = await client.query({
      query: GetAllPostSlugsDocument,
      context: {
        fetchOptions: {
          next: { revalidate: 3600 }, // Revalidate every hour
        },
      },
    });

    if (!data?.posts?.nodes) {
      return [];
    }

    return data.posts.nodes
      .filter((post): post is NonNullable<typeof post> => post !== null)
      .map((post) => post.slug)
      .filter((slug): slug is string => Boolean(slug));
  } catch (error) {
    console.error('Error fetching post slugs:', error);
    throw new Error('Failed to fetch post slugs');
  }
}

/**
 * Search Index Post Type
 */
export interface SearchIndexPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  categories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

/**
 * Fetch posts for search index generation
 * Returns minimal data for client-side search across all posts
 *
 * @returns Array of minimal post data for search
 */
export async function getPostsForSearchIndex(): Promise<SearchIndexPost[]> {
  const client = getClient();

  try {
    const { data } = await client.query({
      query: GetSearchIndexDocument,
      context: {
        fetchOptions: {
          next: { revalidate: 3600 }, // Revalidate every hour
        },
      },
    });

    if (!data?.posts?.nodes) {
      return [];
    }

    return data.posts.nodes
      .filter((post): post is NonNullable<typeof post> => post !== null)
      .map((post) => ({
        id: post.id,
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        date: post.date || '',
        categories:
          post.categories?.nodes
            ?.filter((cat): cat is NonNullable<typeof cat> => cat !== null)
            .map((cat) => ({
              id: cat.id || cat.databaseId?.toString() || '',
              name: cat.name || '',
              slug: cat.slug || '',
            })) || [],
        tags:
          post.tags?.nodes
            ?.filter((tag): tag is NonNullable<typeof tag> => tag !== null)
            .map((tag) => ({
              id: tag.id || tag.databaseId?.toString() || '',
              name: tag.name || '',
              slug: tag.slug || '',
            })) || [],
      }));
  } catch (error) {
    console.error('Error fetching search index:', error);
    throw new Error('Failed to fetch search index');
  }
}

/**
 * Category Type
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
}

/**
 * Fetch all categories with post counts
 * Used for sidebar category filtering
 *
 * @returns Array of categories with post counts
 */
export async function getAllCategories(): Promise<Category[]> {
  const client = getClient();

  try {
    const { data } = await client.query({
      query: GetAllCategoriesDocument,
      context: {
        fetchOptions: {
          next: { revalidate: 3600 }, // Revalidate every hour
        },
      },
    });

    if (!data?.categories?.nodes) {
      return [];
    }

    return data.categories.nodes
      .filter((cat): cat is NonNullable<typeof cat> => cat !== null)
      .filter((cat) => (cat.count || 0) > 0) // Only categories with posts
      .map((cat) => ({
        id: cat.id || cat.databaseId?.toString() || '',
        name: cat.name || '',
        slug: cat.slug || '',
        count: cat.count || 0,
      }))
      .sort((a, b) => b.count - a.count); // Sort by post count descending
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
}

/**
 * Fetch paginated posts using cursor-based pagination workaround
 *
 * Note: Standard WPGraphQL doesn't support offset pagination natively.
 * This implementation fetches all posts up to the requested page and slices the result.
 * For large sites (>200 posts), consider installing WPGraphQL Offset Pagination plugin.
 *
 * @param page - Page number (1-indexed)
 * @param postsPerPage - Number of posts per page (default: POSTS_PER_PAGE)
 * @returns Array of Post objects
 */
export async function getPaginatedPosts(
  page: number = 1,
  postsPerPage: number = POSTS_PER_PAGE
): Promise<Post[]> {
  const client = getClient();

  // Calculate how many posts we need to fetch to get to this page
  const totalToFetch = page * postsPerPage;

  try {
    const { data } = await client.query({
      query: GetPaginatedPostsDocument,
      variables: {
        first: totalToFetch,
      },
      context: {
        fetchOptions: {
          next: { revalidate: 300 }, // Revalidate every 5 minutes
        },
      },
    });

    if (!data?.posts?.nodes) {
      console.error('No posts data returned from WordPress GraphQL');
      return [];
    }

    // Convert all posts to our Post type
    const allPosts = data.posts.nodes
      .filter((post): post is NonNullable<typeof post> => post !== null)
      .map((post) => adaptPost(post));

    // Slice to get only the posts for this page
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;

    return allPosts.slice(startIndex, endIndex);
  } catch (error) {
    console.error(`Error fetching paginated posts (page ${page}):`, error);
    throw new Error(`Failed to fetch posts for page ${page}`);
  }
}

/**
 * Get total count of published posts
 * Used for calculating total number of pages
 *
 * Note: Fetches up to 1000 post IDs to count them.
 * For sites with >1000 posts, consider WPGraphQL Offset Pagination plugin.
 *
 * @returns Total number of published posts
 */
export async function getTotalPostCount(): Promise<number> {
  const client = getClient();

  try {
    const { data } = await client.query({
      query: GetTotalPostCountDocument,
      context: {
        fetchOptions: {
          next: { revalidate: 3600 }, // Revalidate every hour
        },
      },
    });

    // Count the nodes since WPGraphQL doesn't provide a direct count
    const total = data?.posts?.nodes?.length ?? 0;
    return total;
  } catch (error) {
    console.error('Error fetching total post count:', error);
    throw new Error('Failed to fetch total post count');
  }
}

/**
 * Calculate total number of pages based on total posts
 *
 * @param totalPosts - Total number of posts
 * @param postsPerPage - Number of posts per page (default: POSTS_PER_PAGE)
 * @returns Total number of pages
 */
export function calculateTotalPages(
  totalPosts: number,
  postsPerPage: number = POSTS_PER_PAGE
): number {
  return Math.ceil(totalPosts / postsPerPage);
}

/**
 * Taxonomy Archive Types
 */
export interface TaxonomyTerm {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count: number;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  description?: string;
  avatar?: string;
}

export interface TaxonomyArchive {
  term: TaxonomyTerm | Author;
  posts: Post[];
  total: number;
}

/**
 * Get posts by category slug
 */
export async function getPostsByCategory(slug: string): Promise<TaxonomyArchive | null> {
  const client = getClient();

  try {
    const { data } = await client.query({
      query: GetPostsByCategoryDocument,
      variables: {
        slug,
        categoryName: slug,
        first: 100,
      },
      context: {
        fetchOptions: {
          next: { revalidate: 300 }, // 5 minutes
        },
      },
    });

    if (!data?.category) {
      return null;
    }

    const posts = data.posts?.nodes
      ?.filter((post): post is NonNullable<typeof post> => post !== null)
      .map((post) => adaptPost(post)) || [];

    return {
      term: {
        id: data.category.id,
        name: data.category.name || '',
        slug: data.category.slug || '',
        description: data.category.description || undefined,
        count: data.category.count || 0,
      },
      posts,
      total: data.category.count || 0,
    };
  } catch (error) {
    console.error(`Error fetching posts for category "${slug}":`, error);
    throw new Error(`Failed to fetch category: ${slug}`);
  }
}

/**
 * Get posts by tag slug
 */
export async function getPostsByTag(slug: string): Promise<TaxonomyArchive | null> {
  const client = getClient();

  try {
    const { data } = await client.query({
      query: GetPostsByTagDocument,
      variables: {
        slug,
        tagSlug: slug,
        first: 100,
      },
      context: {
        fetchOptions: {
          next: { revalidate: 300 }, // 5 minutes
        },
      },
    });

    if (!data?.tag) {
      return null;
    }

    const posts = data.posts?.nodes
      ?.filter((post): post is NonNullable<typeof post> => post !== null)
      .map((post) => adaptPost(post)) || [];

    return {
      term: {
        id: data.tag.id,
        name: data.tag.name || '',
        slug: data.tag.slug || '',
        description: data.tag.description || undefined,
        count: data.tag.count || 0,
      },
      posts,
      total: data.tag.count || 0,
    };
  } catch (error) {
    console.error(`Error fetching posts for tag "${slug}":`, error);
    throw new Error(`Failed to fetch tag: ${slug}`);
  }
}

/**
 * Get posts by author slug
 */
export async function getPostsByAuthor(slug: string): Promise<TaxonomyArchive | null> {
  const client = getClient();

  try {
    const { data } = await client.query({
      query: GetPostsByAuthorDocument,
      variables: {
        slug,
        authorName: slug,
        first: 100,
      },
      context: {
        fetchOptions: {
          next: { revalidate: 300 }, // 5 minutes
        },
      },
    });

    if (!data?.user) {
      return null;
    }

    const posts = data.posts?.nodes
      ?.filter((post): post is NonNullable<typeof post> => post !== null)
      .map((post) => adaptPost(post)) || [];

    return {
      term: {
        id: data.user.id,
        name: data.user.name || '',
        slug: data.user.slug || '',
        description: data.user.description || undefined,
        avatar: data.user.avatar?.url || undefined,
      } as Author,
      posts,
      total: posts.length, // Authors don't have a count field
    };
  } catch (error) {
    console.error(`Error fetching posts for author "${slug}":`, error);
    throw new Error(`Failed to fetch author: ${slug}`);
  }
}

/**
 * Get all category slugs for static generation
 */
export async function getAllCategorySlugs(): Promise<string[]> {
  const client = getClient();

  try {
    const { data } = await client.query({
      query: GetAllCategorySlugsDocument,
      context: {
        fetchOptions: {
          next: { revalidate: 3600 }, // 1 hour
        },
      },
    });

    return data?.categories?.nodes
      ?.filter((cat): cat is NonNullable<typeof cat> => cat !== null)
      .filter((cat) => (cat.count || 0) > 0) // Only categories with posts
      .map((cat) => cat.slug)
      .filter((slug): slug is string => Boolean(slug)) || [];
  } catch (error) {
    console.error('Error fetching category slugs:', error);
    throw new Error('Failed to fetch category slugs');
  }
}

/**
 * Get all tag slugs for static generation
 */
export async function getAllTagSlugs(): Promise<string[]> {
  const client = getClient();

  try {
    const { data } = await client.query({
      query: GetAllTagSlugsDocument,
      context: {
        fetchOptions: {
          next: { revalidate: 3600 }, // 1 hour
        },
      },
    });

    return data?.tags?.nodes
      ?.filter((tag): tag is NonNullable<typeof tag> => tag !== null)
      .filter((tag) => (tag.count || 0) > 0) // Only tags with posts
      .map((tag) => tag.slug)
      .filter((slug): slug is string => Boolean(slug)) || [];
  } catch (error) {
    console.error('Error fetching tag slugs:', error);
    throw new Error('Failed to fetch tag slugs');
  }
}

/**
 * Get all author slugs for static generation
 */
export async function getAllAuthorSlugs(): Promise<string[]> {
  const client = getClient();

  try {
    const { data } = await client.query({
      query: GetAllAuthorSlugsDocument,
      context: {
        fetchOptions: {
          next: { revalidate: 3600 }, // 1 hour
        },
      },
    });

    return data?.users?.nodes
      ?.filter((user): user is NonNullable<typeof user> => user !== null)
      .map((user) => user.slug)
      .filter((slug): slug is string => Boolean(slug)) || [];
  } catch (error) {
    console.error('Error fetching author slugs:', error);
    throw new Error('Failed to fetch author slugs');
  }
}

/**
 * Get author by slug with all posts
 */
export async function getAuthorBySlug(slug: string): Promise<unknown | null> {
  const client = getClient();

  try {
    const { data } = await client.query({
      query: gql`
        query GetAuthorBySlug($slug: ID!) {
          user(id: $slug, idType: SLUG) {
            id
            databaseId
            name
            firstName
            lastName
            nickname
            slug
            email
            url
            description
            avatar { url }
            posts(first: 100, where: { status: PUBLISH }) {
              pageInfo { total }
              nodes {
                id
                title
                slug
                excerpt
                date
                featuredImage { node { sourceUrl altText mediaDetails { width height } } }
                categories { nodes { id name slug } }
              }
            }
          }
        }
      `,
      variables: { slug },
      context: {
        fetchOptions: {
          next: { revalidate: 300 },
        },
      },
    });

    if (!data?.user) {
      return null;
    }

    return data.user;
  } catch (error) {
    console.error(`Error fetching author "${slug}":`, error);
    throw new Error(`Failed to fetch author: ${slug}`);
  }
}

/**
 * Tag Type with description
 */
export interface Tag {
  id: string;
  name: string;
  slug: string;
  count: number;
  description?: string;
}

/**
 * Get all tags with post counts
 * Used for sidebar tag cloud
 */
export async function getAllTags(): Promise<Tag[]> {
  const client = getClient();

  try {
    const { data } = await client.query({
      query: GetAllTagsDocument,
      context: {
        fetchOptions: {
          next: { revalidate: 3600 }, // 1 hour
        },
      },
    });

    return data?.tags?.nodes
      ?.filter((tag): tag is NonNullable<typeof tag> => tag !== null)
      .filter((tag) => (tag.count || 0) > 0) // Only tags with posts
      .map((tag) => ({
        id: tag.id || tag.databaseId?.toString() || '',
        name: tag.name || '',
        slug: tag.slug || '',
        count: tag.count || 0,
        description: tag.description || undefined,
      }))
      .sort((a, b) => b.count - a.count) || []; // Sort by post count descending
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw new Error('Failed to fetch tags');
  }
}

/**
 * Get related posts based on shared categories or tags
 * Uses intelligent fallback strategy for optimal results
 *
 * @param post - Current post to find related posts for
 * @param limit - Maximum number of related posts to return (default: 4)
 * @returns Array of related Post objects
 */
export async function getRelatedPosts(post: Post, limit: number = 4): Promise<Post[]> {
  const client = getClient();

  try {
    // Strategy 1: Try to find posts with shared categories
    if (post.categories && post.categories.length > 0) {
      const categoryIds = post.categories.map((cat) => cat.id);

      const { data } = await client.query({
        query: GetRelatedPostsByCategoryDocument,
        variables: {
          categoryIds,
          first: limit + 1, // Fetch one extra to account for current post
        },
        context: {
          fetchOptions: {
            next: { revalidate: 60 }, // Same as post page
          },
        },
      });

      if (data?.posts?.nodes) {
        const relatedPosts = data.posts.nodes
          .filter((p): p is NonNullable<typeof p> => p !== null)
          .filter((p) => p.id !== post.id) // Exclude current post
          .map((p) => adaptPost(p))
          .slice(0, limit); // Limit to requested number

        // If we found enough related posts, return them
        if (relatedPosts.length >= Math.min(3, limit)) {
          return relatedPosts;
        }

        // If we have some but not enough, continue to tag strategy
        // and merge results
        if (relatedPosts.length > 0) {
          const remaining = limit - relatedPosts.length;
          if (post.tags && post.tags.length > 0) {
            const tagRelated = await getRelatedPostsByTags(post, remaining);
            // Merge and deduplicate
            const merged = [...relatedPosts, ...tagRelated];
            const uniquePosts = Array.from(
              new Map(merged.map((p) => [p.id, p])).values()
            );
            return uniquePosts.slice(0, limit);
          }
          return relatedPosts;
        }
      }
    }

    // Strategy 2: Fallback to posts with shared tags
    if (post.tags && post.tags.length > 0) {
      return await getRelatedPostsByTags(post, limit);
    }

    // Strategy 3: No categories or tags - return empty array
    return [];
  } catch (error) {
    console.error('Error fetching related posts:', error);
    // Return empty array on error rather than throwing
    // This prevents related posts from breaking the page
    return [];
  }
}

/**
 * Helper function to get related posts by shared tags
 * @private
 */
async function getRelatedPostsByTags(post: Post, limit: number): Promise<Post[]> {
  const client = getClient();

  if (!post.tags || post.tags.length === 0) {
    return [];
  }

  const tagSlugs = post.tags.map((tag) => tag.slug);

  try {
    const { data } = await client.query({
      query: GetRelatedPostsByTagDocument,
      variables: {
        tagSlugs,
        first: limit + 1, // Fetch one extra to account for current post
      },
      context: {
        fetchOptions: {
          next: { revalidate: 60 }, // Same as post page
        },
      },
    });

    if (!data?.posts?.nodes) {
      return [];
    }

    return data.posts.nodes
      .filter((p): p is NonNullable<typeof p> => p !== null)
      .filter((p) => p.id !== post.id) // Exclude current post
      .map((p) => adaptPost(p))
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching related posts by tags:', error);
    return [];
  }
}

/**
 * Get featured posts for hero section
 * Uses WordPress's built-in sticky posts feature
 *
 * TEMPORARY FALLBACK: Using client-side filtering until WordPress GraphQL
 * schema is configured with isSticky field support.
 *
 * Once WordPress is configured with WPGraphQL 1.14.0+, update this to use:
 * query GetFeaturedPosts($first: Int = 3) {
 *   posts(first: $first, where: { onlySticky: true }) { ... }
 * }
 *
 * @param limit - Maximum number of featured posts to return (default: 3)
 * @returns Array of featured Post objects
 */
export async function getFeaturedPosts(limit: number = 3): Promise<Post[]> {
  try {
    // Fallback: Get all posts and filter client-side for sticky posts
    const allPosts = await getAllPosts();

    // Filter for sticky posts (isSticky will be available once WordPress is configured)
    const featuredPosts = allPosts
      .filter((post: Post) => post.isSticky === true)
      .slice(0, limit);

    return featuredPosts;
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    // Return empty array on error to prevent breaking the page
    return [];
  }
}

/**
 * Get regular (non-sticky) posts for main blog listing
 * Excludes sticky posts to avoid duplication
 *
 * TEMPORARY FALLBACK: Using client-side filtering until WordPress GraphQL
 * schema is configured with excludeSticky support.
 *
 * Once WordPress is configured with WPGraphQL 1.14.0+, update this to use:
 * query GetRegularPosts($first: Int = 10, $after: String) {
 *   posts(first: $first, after: $after, where: { excludeSticky: true }) { ... }
 * }
 *
 * @param page - Page number (1-indexed)
 * @param postsPerPage - Number of posts per page (default: POSTS_PER_PAGE)
 * @returns Array of regular Post objects
 */
export async function getRegularPosts(
  page: number = 1,
  postsPerPage: number = POSTS_PER_PAGE
): Promise<Post[]> {
  try {
    // Fallback: Get all posts and filter client-side
    const allPosts = await getAllPosts();

    // Filter out sticky posts to avoid duplication with featured section
    const regularPosts = allPosts.filter((post: Post) => post.isSticky !== true);

    // Paginate the results
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;

    return regularPosts.slice(startIndex, endIndex);
  } catch (error) {
    console.error(`Error fetching regular posts (page ${page}):`, error);
    throw new Error(`Failed to fetch posts for page ${page}`);
  }
}

/**
 * =============================================================================
 * PAGE QUERIES - WordPress Pages with ACF Flexible Content
 * =============================================================================
 */

/**
 * Fetch all page slugs for static generation
 * Used in generateStaticParams for dynamic page routes
 *
 * @returns Array of page slugs
 */
export async function getAllPageSlugs(): Promise<string[]> {
  // TODO: Uncomment after running GraphQL codegen to generate GetAllPageSlugsDocument
  /*
  const client = getClient();

  try {
    const { data } = await client.query({
      query: GetAllPageSlugsDocument,
      context: {
        fetchOptions: {
          next: { revalidate: 3600 }, // Revalidate every hour
        },
      },
    });

    if (!data?.pages?.nodes) {
      return [];
    }

    return data.pages.nodes
      .filter((page): page is NonNullable<typeof page> => page !== null)
      .map((page) => page.slug)
      .filter((slug): slug is string => Boolean(slug));
  } catch (error) {
    console.error('Error fetching page slugs:', error);
    throw new Error('Failed to fetch page slugs');
  }
  */
  return [];
}

/**
 * Fetch a single page by slug with ACF Flexible Content blocks
 * Uses ISR with configurable revalidation
 *
 * @param slug - Page slug
 * @param revalidate - ISR revalidation period in seconds (default: 3600 = 1 hour)
 * @returns Page object or null if not found
 */
export async function getPageBySlug(
  slug: string,
  revalidate: number = 3600
): Promise<Page | null> {
  // TODO: Uncomment after running GraphQL codegen to generate GetPageBySlugDocument
  /*
  const client = getClient();

  try {
    const { data } = await client.query({
      query: GetPageBySlugDocument,
      variables: { slug },
      context: {
        fetchOptions: {
          next: { revalidate }, // Configurable ISR
        },
      },
    });

    if (!data?.page) {
      return null;
    }

    return adaptPage(data.page);
  } catch (error) {
    console.error(`Error fetching page with slug "${slug}":`, error);
    throw new Error(`Failed to fetch page: ${slug}`);
  }
  */
  return null;
}

/**
 * Fetch a page by ID (used for preview mode)
 *
 * @param id - Page database ID
 * @returns Page object or null if not found
 */
export async function getPageById(id: string): Promise<Page | null> {
  // TODO: Uncomment after running GraphQL codegen to generate GetPageByIdDocument
  /*
  const client = getClient();

  try {
    const { data } = await client.query({
      query: GetPageByIdDocument,
      variables: { id },
      context: {
        fetchOptions: {
          cache: 'no-store', // No caching for preview
        },
      },
    });

    if (!data?.page) {
      return null;
    }

    return adaptPage(data.page);
  } catch (error) {
    console.error(`Error fetching page with ID "${id}":`, error);
    throw new Error(`Failed to fetch page: ${id}`);
  }
  */
  return null;
}
