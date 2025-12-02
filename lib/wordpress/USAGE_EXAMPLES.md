# WordPress GraphQL Usage Examples

Practical examples for using the WordPress GraphQL integration in FlatWP.

## Example 1: Blog Index Page

Create a blog listing page with ISR.

```typescript
// app/blog/page.tsx
import { getAllPosts } from '@/lib/wordpress/queries';
import Link from 'next/link';
import Image from 'next/image';

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article
            key={post.id}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            {post.featuredImage && (
              <Link href={`/blog/${post.slug}`}>
                <Image
                  src={post.featuredImage.url}
                  alt={post.featuredImage.alt}
                  width={post.featuredImage.width}
                  height={post.featuredImage.height}
                  className="w-full h-48 object-cover"
                />
              </Link>
            )}

            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:text-blue-600"
                >
                  {post.title}
                </Link>
              </h2>

              <div className="text-sm text-gray-600 mb-4">
                <span>{new Date(post.date).toLocaleDateString()}</span>
                <span className="mx-2">·</span>
                <span>{post.author.name}</span>
              </div>

              <div
                className="text-gray-700 mb-4"
                dangerouslySetInnerHTML={{ __html: post.excerpt }}
              />

              {post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.categories.map((category) => (
                    <span
                      key={category}
                      className="px-3 py-1 bg-gray-100 text-sm rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
```

## Example 2: Single Blog Post Page with Static Generation

Dynamic route with ISR and static generation.

```typescript
// app/blog/[slug]/page.tsx
import { getPostBySlug, getAllPostSlugs } from '@/lib/wordpress/queries';
import { notFound } from 'next/navigation';
import Image from 'next/image';

// Generate static paths at build time
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();

  return slugs.map((slug) => ({
    slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [post.featuredImage.url] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      {/* Featured Image */}
      {post.featuredImage && (
        <div className="mb-8">
          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.alt}
            width={post.featuredImage.width}
            height={post.featuredImage.height}
            className="w-full h-auto rounded-lg"
            priority
          />
        </div>
      )}

      {/* Post Header */}
      <header className="mb-8">
        <h1 className="text-5xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 text-gray-600">
          {post.author.avatar && (
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          <div>
            <p className="font-medium">{post.author.name}</p>
            <p className="text-sm">
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Categories */}
        {post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.categories.map((category) => (
              <span
                key={category}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {category}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Post Content */}
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
```

## Example 3: Client-Side Search

Implement client-side search using Fuse.js.

```typescript
// app/search/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import Link from 'next/link';

interface SearchPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  categories: string[];
}

export default function SearchPage() {
  const [searchIndex, setSearchIndex] = useState<SearchPost[]>([]);
  const [fuse, setFuse] = useState<Fuse<SearchPost> | null>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchPost[]>([]);

  // Load search index on mount
  useEffect(() => {
    async function loadSearchIndex() {
      const response = await fetch('/api/search-index');
      const data: SearchPost[] = await response.json();
      setSearchIndex(data);

      // Initialize Fuse.js
      const fuseInstance = new Fuse(data, {
        keys: ['title', 'excerpt', 'categories'],
        threshold: 0.3,
        includeScore: true,
      });
      setFuse(fuseInstance);
    }

    loadSearchIndex();
  }, []);

  // Perform search when query changes
  useEffect(() => {
    if (!fuse || !query) {
      setResults([]);
      return;
    }

    const searchResults = fuse.search(query);
    setResults(searchResults.map((result) => result.item));
  }, [query, fuse]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Search</h1>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search posts..."
        className="w-full px-4 py-3 border rounded-lg mb-8"
      />

      {query && (
        <p className="text-gray-600 mb-6">
          Found {results.length} result{results.length !== 1 ? 's' : ''}
        </p>
      )}

      <div className="space-y-6">
        {results.map((post) => (
          <article key={post.id} className="border-b pb-6">
            <h2 className="text-2xl font-semibold mb-2">
              <Link href={`/blog/${post.slug}`} className="hover:text-blue-600">
                {post.title}
              </Link>
            </h2>

            <div
              className="text-gray-700 mb-2"
              dangerouslySetInnerHTML={{ __html: post.excerpt }}
            />

            {post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.categories.map((category) => (
                  <span
                    key={category}
                    className="px-2 py-1 bg-gray-100 text-xs rounded"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
```

```typescript
// app/api/search-index/route.ts
import { getPostsForSearchIndex } from '@/lib/wordpress/queries';

export async function GET() {
  const searchIndex = await getPostsForSearchIndex();

  return Response.json(searchIndex, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
    },
  });
}
```

## Example 4: Homepage with Recent Posts

Show recent posts on homepage with custom query.

```typescript
// app/page.tsx
import { getAllPosts } from '@/lib/wordpress/queries';
import Link from 'next/link';
import Image from 'next/image';

export default async function HomePage() {
  const allPosts = await getAllPosts();
  const recentPosts = allPosts.slice(0, 3); // Get 3 most recent

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="mb-16">
        <h1 className="text-6xl font-bold mb-4">Welcome to FlatWP</h1>
        <p className="text-xl text-gray-600 mb-8">
          A modern headless WordPress starter kit with Next.js
        </p>
      </section>

      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Recent Posts</h2>
          <Link href="/blog" className="text-blue-600 hover:underline">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <article key={post.id} className="border rounded-lg overflow-hidden">
              {post.featuredImage && (
                <Image
                  src={post.featuredImage.url}
                  alt={post.featuredImage.alt}
                  width={post.featuredImage.width}
                  height={post.featuredImage.height}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>

                <p className="text-gray-600 text-sm mb-4">
                  {new Date(post.date).toLocaleDateString()}
                </p>

                <div
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{ __html: post.excerpt }}
                />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
```

## Example 5: Loading States with Suspense

Use React Suspense for better UX.

```typescript
// app/blog/page.tsx
import { Suspense } from 'react';
import { getAllPosts } from '@/lib/wordpress/queries';

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="border rounded-lg p-6 animate-pulse">
          <div className="h-48 bg-gray-200 rounded mb-4" />
          <div className="h-6 bg-gray-200 rounded mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
          <div className="h-20 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}

async function BlogPosts() {
  const posts = await getAllPosts();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {posts.map((post) => (
        <article key={post.id}>{/* Post content */}</article>
      ))}
    </div>
  );
}

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>

      <Suspense fallback={<LoadingSkeleton />}>
        <BlogPosts />
      </Suspense>
    </div>
  );
}
```

## Example 6: Error Handling

Implement proper error boundaries.

```typescript
// app/blog/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-gray-600 mb-8">{error.message}</p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Try again
      </button>
    </div>
  );
}
```

## Example 7: Custom Hook for Client Components

If you need to fetch data from client components:

```typescript
// lib/hooks/use-posts.ts
'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/lib/wordpress/adapters/post';

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) throw new Error('Failed to fetch posts');

        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  return { posts, loading, error };
}
```

```typescript
// app/api/posts/route.ts
import { getAllPosts } from '@/lib/wordpress/queries';

export async function GET() {
  const posts = await getAllPosts();

  return Response.json(posts, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
```

## Testing Examples

### Example 8: Mock Data for Testing

```typescript
// lib/wordpress/__mocks__/queries.ts
import { Post } from '../adapters/post';

export const mockPost: Post = {
  id: '1',
  title: 'Test Post',
  slug: 'test-post',
  excerpt: 'This is a test post',
  content: '<p>This is the full content</p>',
  date: '2024-01-01T00:00:00Z',
  author: {
    name: 'Test Author',
    avatar: 'https://example.com/avatar.jpg',
  },
  featuredImage: {
    url: 'https://example.com/image.jpg',
    alt: 'Test image',
    width: 800,
    height: 600,
  },
  categories: ['Technology', 'Web Development'],
};

export async function getAllPosts(): Promise<Post[]> {
  return [mockPost];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return slug === 'test-post' ? mockPost : null;
}

export async function getAllPostSlugs(): Promise<string[]> {
  return ['test-post'];
}
```

## Performance Tips

1. **Use Static Generation when possible**
   - Pre-render pages at build time
   - Use `generateStaticParams` for dynamic routes

2. **Leverage ISR effectively**
   - Set appropriate revalidation times
   - Use on-demand revalidation for critical updates

3. **Optimize images**
   - Always use Next.js `Image` component
   - Provide width/height from WordPress data

4. **Minimize client-side fetching**
   - Prefer server components
   - Use API routes with proper caching

5. **Monitor bundle size**
   - Tree-shake unused code
   - Lazy load heavy components
