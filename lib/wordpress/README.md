# WordPress GraphQL Integration

This directory contains the complete WordPress GraphQL integration layer for FlatWP.

## Directory Structure

```
lib/wordpress/
├── __generated__/          # Auto-generated TypeScript types (DO NOT EDIT)
│   ├── graphql.ts         # GraphQL types and documents
│   ├── gql.ts             # gql() helper function
│   ├── fragment-masking.ts # Fragment masking utilities
│   └── index.ts           # Public exports
├── adapters/              # Data transformation layer
│   └── post.ts           # WordPress Post → App Post adapter
├── client/               # Apollo Client configuration
│   └── apollo.ts         # Server & client-side Apollo setup
├── queries.ts            # Query wrapper functions (USE THESE)
└── README.md             # This file
```

## Quick Start

### 1. Fetching All Posts

```typescript
import { getAllPosts } from '@/lib/wordpress/queries';

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

### 2. Fetching Single Post

```typescript
import { getPostBySlug } from '@/lib/wordpress/queries';

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

### 3. Static Generation with ISR

```typescript
import { getAllPostSlugs, getPostBySlug } from '@/lib/wordpress/queries';

// Generate static paths at build time
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map(slug => ({ slug }));
}

// This page uses ISR - will revalidate every 60 seconds
export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  return <article>{/* ... */}</article>;
}
```

## Available Query Functions

### `getAllPosts(): Promise<Post[]>`
Fetches all published posts with ISR revalidation every 5 minutes.

**Returns:** Array of Post objects
**Revalidation:** 300 seconds (5 minutes)

### `getPostBySlug(slug: string): Promise<Post | null>`
Fetches a single post by slug with ISR revalidation every 1 minute.

**Parameters:**
- `slug` - The post slug (e.g., "my-blog-post")

**Returns:** Post object or null if not found
**Revalidation:** 60 seconds (1 minute)

### `getAllPostSlugs(): Promise<string[]>`
Fetches all post slugs for static generation.

**Returns:** Array of post slugs
**Revalidation:** 3600 seconds (1 hour)
**Usage:** Use in `generateStaticParams()`

### `getPostsForSearchIndex(): Promise<SearchIndexPost[]>`
Fetches minimal post data for client-side search index.

**Returns:** Array of minimal post data
**Revalidation:** 3600 seconds (1 hour)

## Post Type

All query functions return posts in this normalized format:

```typescript
interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  author: {
    name: string;
    avatar?: string;
  };
  featuredImage?: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  categories: string[];
}
```

This format is decoupled from WordPress's GraphQL schema through adapters.

## GraphQL Queries

GraphQL queries are defined in `/graphql/queries/*.graphql` files:

- `posts.graphql` - GetAllPosts and GetPostBySlug queries
- `slugs.graphql` - GetAllPostSlugs query
- `search.graphql` - GetSearchIndex query

**Important:** After modifying `.graphql` files, run:

```bash
npm run graphql:codegen
```

This regenerates TypeScript types in `__generated__/` directory.

## Type Generation

### Configuration

Type generation is configured in `codegen.ts`:

```typescript
{
  schema: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || './graphql/schema.graphql',
  documents: ['graphql/**/*.graphql', 'graphql/**/*.gql'],
  generates: {
    'lib/wordpress/__generated__/': {
      preset: 'client',
      // ...
    }
  }
}
```

### Workflow

1. **Edit GraphQL queries** in `/graphql/queries/*.graphql`
2. **Run codegen**: `npm run graphql:codegen`
3. **Use generated types** in your code

### Schema Sources

The codegen can use two schema sources:

1. **Live WordPress GraphQL endpoint** (production/staging):
   ```bash
   NEXT_PUBLIC_WORDPRESS_API_URL=https://cms.flatwp.com/graphql npm run graphql:codegen
   ```

2. **Local schema file** (development without WordPress):
   - Uses `graphql/schema.graphql` by default
   - Minimal WPGraphQL-compatible schema for development

## ISR Revalidation Strategy

FlatWP uses different revalidation strategies based on content type:

### Blog Posts (Individual)
- **Revalidation:** 60 seconds
- **Strategy:** ISR with on-demand revalidation
- **Rationale:** Keep content fresh while avoiding constant rebuilds

### Blog Archive/List
- **Revalidation:** 300 seconds (5 minutes)
- **Strategy:** Time-based ISR
- **Rationale:** Balance freshness with performance

### Static Data (Slugs, Search Index)
- **Revalidation:** 3600 seconds (1 hour)
- **Strategy:** Long-term caching
- **Rationale:** Rarely changes, optimize for performance

### On-Demand Revalidation

WordPress can trigger revalidation via webhook:

```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const { secret, paths } = await request.json();

  if (secret !== process.env.REVALIDATION_SECRET) {
    return Response.json({ error: 'Invalid secret' }, { status: 401 });
  }

  for (const path of paths) {
    await revalidatePath(path);
  }

  return Response.json({ revalidated: true });
}
```

## Environment Variables

Required environment variables in `.env.local`:

```env
# WordPress GraphQL endpoint
NEXT_PUBLIC_WORDPRESS_API_URL=https://cms.flatwp.com/graphql

# Revalidation webhook secret (must match WordPress plugin)
REVALIDATION_SECRET=your-random-secret-here

# Preview mode secret (for draft content preview)
PREVIEW_SECRET=another-random-secret
```

## Apollo Client Configuration

### Server Components (Default)

```typescript
import { getClient } from '@/lib/wordpress/client/apollo';

const client = getClient();
const { data } = await client.query({ query: YOUR_QUERY });
```

### Client Components (If Needed)

```typescript
import { getClientSideClient } from '@/lib/wordpress/client/apollo';

const client = getClientSideClient();
```

**Note:** Prefer server components for data fetching in Next.js 14+ App Router.

## Adapters

Adapters decouple your app from WordPress's GraphQL schema:

```typescript
// lib/wordpress/adapters/post.ts
export function adaptPost(wpPost: WPGraphQL.Post): Post {
  return {
    id: wpPost.id,
    title: wpPost.title || '',
    // ... transform WordPress shape to app shape
  };
}
```

**Benefits:**
- Change WordPress schema without affecting components
- Normalize data structure across different sources
- Type safety and consistency

## Error Handling

All query functions include error handling:

```typescript
try {
  const { data } = await client.query({ query: GET_ALL_POSTS });

  if (!data?.posts?.nodes) {
    console.error('No posts data returned from WordPress GraphQL');
    return [];
  }

  return data.posts.nodes.map(adaptPost);
} catch (error) {
  console.error('Error fetching all posts:', error);
  throw new Error('Failed to fetch posts from WordPress');
}
```

## Best Practices

### 1. Always Use Query Wrapper Functions

✅ **Do this:**
```typescript
import { getAllPosts } from '@/lib/wordpress/queries';
const posts = await getAllPosts();
```

❌ **Don't do this:**
```typescript
import { getClient } from '@/lib/wordpress/client/apollo';
const client = getClient();
const { data } = await client.query({ query: GetAllPostsDocument });
```

### 2. Leverage ISR for Performance

Server components + ISR = best performance:

```typescript
// Automatic ISR with configured revalidation
export default async function BlogPage() {
  const posts = await getAllPosts(); // Revalidates every 5 minutes
  return <div>{/* ... */}</div>;
}
```

### 3. Handle Missing Data Gracefully

```typescript
const post = await getPostBySlug(params.slug);

if (!post) {
  notFound(); // Next.js 14+ App Router
}

// Safe to use post here
```

### 4. Type Safety

All functions are fully typed with TypeScript:

```typescript
const posts: Post[] = await getAllPosts();
const post: Post | null = await getPostBySlug('my-slug');
const slugs: string[] = await getAllPostSlugs();
```

## Troubleshooting

### Type Generation Fails

**Problem:** `npm run graphql:codegen` fails with connection error

**Solution:** Ensure WordPress endpoint is accessible or use local schema:
```bash
# Use local schema during development
npm run graphql:codegen

# Or specify WordPress URL
NEXT_PUBLIC_WORDPRESS_API_URL=https://cms.flatwp.com/graphql npm run graphql:codegen
```

### Types Out of Sync

**Problem:** TypeScript errors after changing GraphQL queries

**Solution:** Regenerate types:
```bash
npm run graphql:codegen
```

### ISR Not Working

**Problem:** Content not updating after WordPress changes

**Solution:**
1. Check revalidation configuration in queries.ts
2. Verify webhook is configured in WordPress
3. Check REVALIDATION_SECRET matches

## WordPress GraphQL Schema

This integration assumes WPGraphQL plugin is installed on WordPress with this structure:

- `posts` - Query all posts
- `post(id, idType)` - Query single post by ID/SLUG
- Post fields: id, title, slug, content, excerpt, date
- Related: author, featuredImage, categories

## Future Enhancements

Planned improvements:

- [ ] Support for custom post types
- [ ] ACF field integration
- [ ] Preview mode implementation
- [ ] Category and tag queries
- [ ] Pagination support
- [ ] Draft content fetching

## Related Documentation

- [Next.js ISR](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Apollo Client](https://www.apollographql.com/docs/react/)
- [WPGraphQL](https://www.wpgraphql.com/)
- [GraphQL Code Generator](https://the-guild.dev/graphql/codegen)
